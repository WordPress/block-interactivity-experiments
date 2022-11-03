import * as fs from 'fs';
import { parse } from 'csv-parse';
import playwright from 'playwright';
import { inspect } from 'util';
import { Sequelize } from 'sequelize';

import { createModels } from './models.mjs';

// Get the path to the CSV file
const fileArg = process.argv[2];
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
	storage: new URL('./test_results.db', import.meta.url).pathname,
});

// Create the models for the database
const { TestResult, WordPressPage } = createModels(sequelize);

// Run the benchmark
(async () => {
	try {
		const domains = await getDomains();
		const browser = await playwright.chromium.launch();

		await sequelize.sync();
		await asyncParallelQueue(40, domains, (url) => testUrl(url, browser));
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

	if (wordPressPage?.errorOrSuccess === 'success') {
		console.log('Already tested', url);
		return;
	}

	if (!wordPressPage) {
		wordPressPage = await WordPressPage.create({ url });
	}

	try {
		const page = await browser.newPage();

		console.log(
			`\n==================================\nNavigating to ${url}\n`
		);

		await page.goto(`http://${url}`, {
			waitUntil: 'networkidle',
			timeout: 60000,
		});

		const preloadFile = fs.readFileSync(
			'./build/hydrationScriptForTesting.js',
			'utf8'
		);
		await page.evaluate(preloadFile);

		page.on('console', async (msg) => {
			const message = msg.text();
			if (message.startsWith('mutation')) {
				const mutation = JSON.parse(message.replace('mutation ', ''));
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
			}
		});

		const { time } = await page.evaluate(async () => {
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
				for (const mutation of mutations) {
					console.log(
						'mutation',
						// The MutationRecord is not serializable with JSON.stringify()
						// We have to stringify it manually because it contains a DOM
						// node and we can't send that over the console.
						JSON.stringify({
							nodeName: mutation.target.nodeName,
							mutationType: mutation.type,
							addedNodes:
								mutation?.addedNodes?.length > 0
									? Array.from(mutation.addedNodes).map(
											(node) => ({
												nodeName: node.nodeName,
												node: nodeToString(node),
											})
									  )
									: [],
							removedNodes:
								mutation?.removedNodes?.length > 0
									? Array.from(mutation.removedNodes).map(
											(node) => ({
												nodeName: node.nodeName,
												node: nodeToString(node),
											})
									  )
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
						})
					);
				}
			}

			const observer = new MutationObserver(processMutations);
			observer.observe(document.body, {
				attributes: true,
				childList: true,
				subtree: true,
			});

			let time = performance.now();
			window.__runHydration();
			time = performance.now() - time;

			// Process pending mutations
			let mutations = observer.takeRecords();
			observer.disconnect();
			processMutations(mutations);

			return { time };
		});

		console.log(`Time to hydrate: ${time}ms`);

		wordPressPage.set('errorOrSuccess', 'success');
		wordPressPage.save();

		await page.close();
	} catch (e) {
		console.error(e);

		if (e instanceof playwright.errors.TimeoutError) {
			wordPressPage.set('errorOrSuccess', 'timeoutError');
		} else {
			wordPressPage.set('errorOrSuccess', 'error');
		}

		wordPressPage.save();
	}
}

async function getDomains() {
	const domains = [];
	const csvFile = new URL(`../${fileArg}`, import.meta.url).pathname;
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

async function asyncParallelQueue(concurrency = 3, items, func) {
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
