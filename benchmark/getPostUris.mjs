import * as fs from 'fs';
import { parse } from 'csv-parse';
import minimist from 'minimist';
import Parser from 'rss-parser';
import { Sequelize } from 'sequelize';
import { promises as dnsPromises } from 'dns';

import { createPostModel } from './models.mjs';

// Get the CLI arguments for the file to use
// and the number of pages to test concurrently.
const {
	_,
	concurrency,
	database,
	cloudfare: testCloudflare,
} = minimist(process.argv.slice(2), {
	default: { concurrency: 10, database: 'posts_db', cloudfare: false },
});
const parser = new Parser();
const fileArg = _[0];
if (typeof fileArg === 'undefined') {
	console.error(
		'\x1b[41m',
		'\nPlease provide a CSV file as an argument\n\nFor example: npm run benchmark 1.csv\n'
	);
	process.exit(1);
}

// Initialize the database
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: new URL(`./data/${database}.db`, import.meta.url).pathname,
	logging: false,
});

const { Post } = createPostModel(sequelize);

// Run the benchmark
(async () => {
	try {
		const domains = await getDomains();
		await sequelize.sync();
		await asyncParallelQueue(concurrency || 40, domains, async (url) => {
			return await addToDB(url);
		});
	} catch (e) {
		console.log(e);
	}
})();

async function addToDB(url) {
	let post = await Post.findOne({
		where: {
			url: url,
		},
	});
	if (post && post.postUrl) {
		post.set('errorOrSuccess', 'success');
		post.save();
		return;
	}
	if (!post) {
		post = await Post.create({
			url: url,
		});
	}
	try {
		// Skip test if it is a Cloudflare site and `testCloudflare` is not enabled
		if (post?.cloudflare === 'true' && !testCloudflare) {
			console.log('Skip: Cloudfare site', url);
			return;
		}

		// Skip test if we have already checked if it is a Cloudflare site and is a success
		if (post?.cloudflare !== null && post?.errorOrSuccess === 'success') {
			console.log('Already tested', url);
			return;
		}

		// Check if it is a Cloudflare site and act accordingly
		if (post?.cloudflare === null || post?.cloudflare === undefined) {
			let cloudflareSite = false;
			try {
				const dns = await dnsPromises.resolveNs(url);
				cloudflareSite = dns.some((host) => /cloudflare/.test(host));
			} catch (e) {
				console.log(e);
			}
			post.set('cloudflare', cloudflareSite ? 'true' : 'false');

			// Remove record if it is a Cloudflare site
			if (cloudflareSite) {
				post.set('errorOrSuccess', null);
			}
			post.save();

			// Skip test if `testCloudflare` is not enabled
			if (cloudflareSite && !testCloudflare) {
				console.log('Skip: Cloudfare site', url);
				return;
			}

			// Skip test if it is not a Cloudflare site and it was a success
			if (!cloudflareSite && post?.errorOrSuccess === 'success') {
				console.log('Already tested', url);
				return;
			}
		}
		console.log(`Getting the feed from: http://${url}/feed/`);
		const feed = await parser.parseURL(`http://${url}/feed/`);
		const postUrl = feed.items[0].link;
		console.log('Post URL saved', postUrl);

		if (postUrl) {
			post.set('errorOrSuccess', 'success');
			post.set('postUrl', postUrl);
			post.save();
		} else {
			post.set('errorOrSuccess', 'error');
			post.save();
		}
		return;
	} catch (error) {
		console.log(error);
		post.set('errorOrSuccess', 'error');
		post.save();
		return;
	}
}

async function getDomains() {
	const domains = [];
	const csvFile = new URL(`./data/${fileArg}`, import.meta.url).pathname;
	return new Promise((resolve, reject) => {
		fs.createReadStream(csvFile)
			.pipe(
				parse({
					delimiter: ',',
					from_line: 2,
					skip_records_with_error: true,
				})
			)
			.on('data', (row) => {
				domains.push(row[0]);
			})
			.on('end', () => {
				console.log('Domains Created');
				resolve(domains);
			})
			.on('error', (error) => {
				reject(error);
			});
	});
}

async function asyncParallelQueue(concurrency, items, func) {
	const batch = items.slice(0, concurrency);
	let promisesArray = batch
		.map(func)
		.map((p, i) => [i, p.then(() => i).catch(() => i)]);

	// Create a "pool" of Promises.
	const pool = new Map(promisesArray);

	for (let index = 0; index < items.length; index++) {
		const key = await Promise.race(pool.values());
		pool.delete(key);
		if (concurrency + index < items.length) {
			pool.set(
				concurrency + index,
				func(items[concurrency + index])
					.then(() => concurrency + index)
					.catch(() => concurrency + index)
			);
		}
	}
}

process.on('SIGINT', () => {
	console.log('Caught interrupt signal');
	process.exit(1);
});
