import * as fs from 'fs';
import { parse } from 'csv-parse';
import playwright from 'playwright';
import { inspect } from 'util';
import { Sequelize } from 'sequelize';
import minimist from 'minimist';
import { promises as dnsPromises } from 'dns';

import { createModels } from './models.mjs';

// Get the CLI arguments for the file to use
// and the number of pages to test concurrently.
const {
	_,
	concurrency,
	cloudflare: testCloudflare,
	database,
} = minimist(process.argv.slice(2), {
	default: { cloudflare: false, database: 'test_results' },
});
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

// Create the models for the database
const { TestResult, WordPressPage } = createModels(sequelize);

// Run the benchmark
(async () => {
	try {
		const domains = await getDomains();
		const browser = await playwright.chromium.launch();

		await sequelize.sync();
		await asyncParallelQueue(concurrency || 40, domains, (url) =>
			testUrl(url, browser)
		);
		await browser.close();
	} catch (e) {
		console.log(e);
	}
})();

async function testUrl(url, browser) {
	let wordPressPage = await WordPressPage.findOne({
		where: {
			url: url,
		},
	});

	if (!wordPressPage) {
		wordPressPage = await WordPressPage.create({ url });
	}

	// Skip test if it is a Cloudflare site and `testCloudflare` is not enabled
	if (wordPressPage?.cloudflare === 'true' && !testCloudflare) {
		console.log('Skip: Cloudfare site', url);
		return;
	}

	// Skip test if we have already checked if it is a Cloudflare site and is a success
	if (
		wordPressPage?.cloudflare !== null &&
		wordPressPage?.errorOrSuccess === 'success'
	) {
		console.log('Already tested', url);
		return;
	}

	// Check if it is a Cloudflare site and act accordingly
	if (
		wordPressPage?.cloudflare === null ||
		wordPressPage?.cloudflare === undefined
	) {
		let cloudflareSite = false;
		try {
			const dns = await dnsPromises.resolveNs(url);
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
			console.log('Skip: Cloudfare site', url);
			return;
		}

		// Skip test if it is not a Cloudflare site and it was a success
		if (!cloudflareSite && wordPressPage?.errorOrSuccess === 'success') {
			console.log('Already tested', url);
			return;
		}
	}

	// Run script if we haven't exit before
	await runScript(wordPressPage, url, browser);
}

async function runScript(wordPressPage, url, browser) {
	try {
		const page = await browser.newPage();

		console.log(`Navigating to ${url}\n`);

		const response = await page.goto(`http://${url}`, {
			waitUntil: 'networkidle',
			timeout: 60000,
		});

		if (response.status() === 403) {
			throw '403 error';
		}

		const preloadFile = fs.readFileSync(
			'./build/hydrationScriptForTesting.js',
			'utf8'
		);
		await page.evaluate(preloadFile);

		const result = await page.evaluate(async () => {
			/**
			 * Takes a Mutation and returns the string representation of the node
			 * @param {MutationRecord} mutation
			 */
			function mutationToString(mutation) {
				var tmpNode = document.createElement('div');
				tmpNode.appendChild(mutation.target.cloneNode(true));
				var str = tmpNode.innerHTML.slice(0, 70);
				tmpNode = mutation = null; // prevent memory leaks in IE
				return str;
			}

			/**
			 * Takes a DOM Node and returns the string representation of the node
			 */
			function nodeToString(node) {
				if (node === null) return null;
				var tmpNode = document.createElement('div');
				tmpNode.appendChild(node.cloneNode(true));
				var str = tmpNode.innerHTML.slice(0, 70);
				tmpNode = node = null; // prevent memory leaks in IE
				return str;
			}

			/**
			 * Takes a Mutation and console logs the string representation of the node
			 * @param {MutationRecord[]} mutations
			 */
			function processMutations(mutations) {
				return mutations.map((mutation) => ({
					nodeName: mutation.target.nodeName,
					mutationType: mutation.type,
					addedNodes:
						mutation?.addedNodes?.length > 0
							? Array.from(mutation.addedNodes).map((node) => ({
									nodeName: node.nodeName,
									node: nodeToString(node),
							  }))
							: [],
					removedNodes:
						mutation?.removedNodes?.length > 0
							? Array.from(mutation.removedNodes).map((node) => ({
									nodeName: node.nodeName,
									node: nodeToString(node),
							  }))
							: [],
					previousSibling: {
						node: nodeToString(mutation.previousSibling),
						nodeName: mutation.previousSibling?.nodeName,
					},
					nextSibling: {
						node: nodeToString(mutation.nextSibling),
						nodeName: mutation.nextSibling?.nodeName,
					},
					node: mutationToString(mutation),
				}));
			}

			const observer = new MutationObserver(processMutations);
			observer.observe(document.body, {
				attributes: true,
				childList: true,
				subtree: true,
			});

			try {
				window.__runHydration();
				window.document
					.querySelector('body div')
					.appendChild(window.document.createTextNode('FLAMES!'));
			} catch (error) {
				return { hydrationError: error };
			}

			// Process pending mutations
			const mutations = processMutations(observer.takeRecords());
			observer.disconnect();

			return { mutations };
		});

		if (result.hydrationError) {
			wordPressPage.set('errorOrSuccess', 'hydrationError');
		} else {
			wordPressPage.set('errorOrSuccess', 'success');
		}

		wordPressPage.save();

		await page.close();

		// Save mutations in DB.
		if (result.mutations) {
			result.mutations.forEach(async (mutation) => {
				const isComment =
					mutation?.addedNodes.length === 0 &&
					mutation?.removedNodes.length === 1 &&
					mutation?.removedNodes[0]?.nodeName === '#comment';

				// Ignore comment mutations
				if (!isComment) {
					console.log(inspect(mutation, { colors: true, depth: 5 }));

					for (let node of mutation.removedNodes) {
						const testResult = await TestResult.create({
							wordpressPage: url,
							nodeName: mutation.nodeName,
							mutationType: mutation.mutationType,
							node: mutation.node,
							nodeOperation: 'remove',
							removedNode: node.node,
							removedNodeName: node.nodeName,
						});
						await wordPressPage.addTestResult(testResult);
					}

					for (let node of mutation.addedNodes) {
						const testResult = await TestResult.create({
							wordpressPage: url,
							nodeName: mutation.nodeName,
							mutationType: mutation.mutationType,
							node: mutation.node,
							nodeOperation: 'add',
							addedNode: node.node,
							addedNodeName: node.nodeName,
						});
						await wordPressPage.addTestResult(testResult);
					}
				}
			});
		}
	} catch (e) {
		console.error(e);

		if (e instanceof playwright.errors.TimeoutError) {
			wordPressPage.set('errorOrSuccess', 'timeoutError');
		} else if (e === '403 error') {
			wordPressPage.set('errorOrSuccess', '403error');
		} else {
			wordPressPage.set('errorOrSuccess', 'error');
		}

		wordPressPage.save();
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
