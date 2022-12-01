import * as fs from 'fs';
import { parse } from 'csv-parse';
import minimist from 'minimist';
import { request } from '@playwright/test';
import Parser from 'rss-parser';
import { Sequelize } from 'sequelize';
import { promises as dnsPromises } from 'dns';

import { createModels } from './models.mjs';

// Get the CLI arguments for the file to use
// and the number of pages to test concurrently.
const { _, concurrency, rss, database } = minimist(process.argv.slice(2), {
	default: { concurrency: 10, rss: false, database: 'posts_db' },
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

const { WordPressPage } = createModels(sequelize);

// Run the benchmark
(async () => {
	try {
		const domains = await getDomains();
		await sequelize.sync();
		await asyncParallelQueue(concurrency || 40, domains, async (url) => {
			return (await rss) ? testUrlWithRSS(url) : testUrl(url);
		});
	} catch (e) {
		console.log(e);
	}
})();

async function addToDB(urlLink) {
	try {
		let wordPressPage = await WordPressPage.findOne({
			where: {
				url: urlLink,
			},
		});

		if (!wordPressPage) {
			wordPressPage = await WordPressPage.create({
				url: urlLink,
			});
		}

		// Skip test if it is a Cloudflare site and `testCloudflare` is not enabled
		if (wordPressPage?.cloudflare === 'true' && !testCloudflare) {
			console.log('Skip: Cloudfare site', urlLink);
			return;
		}

		// Skip test if we have already checked if it is a Cloudflare site and is a success
		if (
			wordPressPage?.cloudflare !== null &&
			wordPressPage?.errorOrSuccess === 'success'
		) {
			console.log('Already tested', urlLink);
			return;
		}

		// Check if it is a Cloudflare site and act accordingly
		if (
			wordPressPage?.cloudflare === null ||
			wordPressPage?.cloudflare === undefined
		) {
			let cloudflareSite = false;
			try {
				const dns = await dnsPromises.resolveNs(urlLink);
				cloudflareSite = dns.some((host) => /cloudflare/.test(host));
			} catch (e) {
				console.log(e);
			}
			wordPressPage.set('cloudflare', cloudflareSite ? 'true' : 'false');

			// Remove record if it is a Cloudflare site
			if (cloudflareSite) {
				wordPressPage.set('errorOrSuccess', null);
			}
			wordPressPage.save();

			// Skip test if `testCloudflare` is not enabled
			if (cloudflareSite && !testCloudflare) {
				console.log('Skip: Cloudfare site', urlLink);
				return;
			}

			// Skip test if it is not a Cloudflare site and it was a success
			if (
				!cloudflareSite &&
				wordPressPage?.errorOrSuccess === 'success'
			) {
				console.log('Already tested', urlLink);
				return;
			}
		}
	} catch (error) {
		console.log(error);
	}
}

async function testUrlWithRSS(url) {
	try {
		const feed = await parser.parseURL(`http://${url}/feed/`);
		const urlLink = feed.items[0].link;
		await addToDB(urlLink);
		throw new Error('stop here');
		await fs.appendFileSync(
			'./benchmark/data/posts_rss.csv',
			`\n${urlLink}`
		);
	} catch (error) {
		console.log(error);
	}
}

async function testUrl(url) {
	try {
		const context = await request.newContext({
			baseURL: `http://${url}`,
		});

		try {
			await addToDB(url);
			throw new Error('stop here');
			const response = await context.get(
				'?rest_route=/wp/v2/posts&post_per_page=1'
			);
			const href = await response.json();
			await fs.appendFileSync(
				'./benchmark/data/posts.csv',
				`\n${href[0].link}`
			);
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		console.log(error);
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
