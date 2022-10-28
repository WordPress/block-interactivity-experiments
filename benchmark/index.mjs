import * as fs from 'fs';
import { parse } from 'csv-parse';
import playwright from 'playwright';
import { join } from 'path';
import { inspect } from 'util';
import { createModels } from './models.mjs';
import { Sequelize } from 'sequelize';

const dirname = process.cwd();

const domains = [];
fs.createReadStream('./benchmark/sites.csv')
	.pipe(parse({ delimiter: ',', from_line: 2 }))
	.on('data', function (row) {
		domains.push(row[0]);
	})
	.on('end', () => {
		console.log('Domains Created');
	})
	.on('error', function (error) {
		console.log(error.message);
	});

(async () => {
	const browser = await playwright.chromium.launch();

	// Initialize the database
	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: join(dirname, './benchmark/test_results.db'),
	});

	const { TestResult, WordPressPage } = createModels(sequelize);

	await sequelize.sync();

	for (const url of domains) {
		let wordPressPage = await WordPressPage.findOne({
			where: {
				url: url,
			},
		});

		// If we've already tested this page, skip it.
		if (wordPressPage) continue;

		wordPressPage = await WordPressPage.create({ url });

		try {
			const page = await browser.newPage();

			console.log(
				`\n==================================\nNavigating to ${url}\n`
			);

			await page.goto(`http://${url}`, {
				waitUntil: 'networkidle',
				timeout: 30000,
			});

			await page.addScriptTag({
				path: join(dirname, './build/hydrationScriptForTesting.js'),
			});

			page.on('console', async (msg) => {
				const message = msg.text();
				if (message.startsWith('mutation')) {
					const mutation = JSON.parse(
						message.replace('mutation ', '')
					);
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
									node: nodeToString(
										mutation.previousSibling
									),
									nodeName:
										mutation.previousSibling?.nodeName,
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

			wordPressPage.set('errorOrSuccess', 'error');
			wordPressPage.save();
		}
	}

	await browser.close();
})();

process.on('SIGINT', function () {
	// TODO: Here we should save the results to the database
	process.exit();
});
