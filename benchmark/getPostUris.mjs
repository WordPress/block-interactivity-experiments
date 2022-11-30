import * as fs from 'fs';
import { parse } from 'csv-parse';
import minimist from 'minimist';
import { request } from '@playwright/test';
import Parser from 'rss-parser';

// Get the CLI arguments for the file to use
// and the number of pages to test concurrently.
const { _, concurrency, rss } = minimist(process.argv.slice(2), {
	default: { concurrency: 10, rss: false },
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

// Run the benchmark
(async () => {
	try {
		const domains = await getDomains();
		// (B) WRITE TO FILE
		if (rss) {
			await fs.writeFileSync('./benchmark/data/posts_rss.csv', '');
		} else {
			await fs.writeFileSync('./benchmark/data/posts.csv', '');
		}
		await asyncParallelQueue(concurrency || 40, domains, async (url) => {
			return (await rss) ? testUrlWithRSS(url) : testUrl(url);
		});
	} catch (e) {
		console.log(e);
	}
})();

async function testUrlWithRSS(url) {
	try {
		const feed = await parser.parseURL(`http://${url}/feed/`);
		try {
			await fs.appendFileSync(
				'./benchmark/data/posts_rss.csv',
				`\n${feed?.items[0].link}`
			);
		} catch (error) {
			console.log(error);
		}
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
