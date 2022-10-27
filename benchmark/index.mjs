import playwright from 'playwright';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { inspect } from 'util';

import { domains, top_sites } from './domains.mjs';

const dirname = process.cwd();

const allMutations = {};

(async () => {
	const browser = await playwright.chromium.launch();

	for (const wordpressPage of [...top_sites, ...domains.slice(0, 100)]) {
		try {
			const page = await browser.newPage();

			console.log(
				`\n==================================\nNavigating to ${wordpressPage}\n`
			);

			await page.goto(`http://www.${wordpressPage}`, {
				waitUntil: 'networkidle',
				timeout: 30000,
			});

			await page.addScriptTag({
				path: join(dirname, './build/hydrationScriptForTesting.js'),
			});

			page.on('console', (msg) => {
				const message = msg.text();
				if (message.startsWith('mutation')) {
					const mutation = JSON.parse(
						message.replace('mutation ', '')
					);
					console.log(inspect(mutation, { colors: true, depth: 5 }));

					if (!allMutations[wordpressPage]) {
						allMutations[wordpressPage] = [];
					}
					allMutations[wordpressPage].push({
						wordpressPage,
						...mutation,
					});
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

			await page.close();
		} catch (e) {
			console.error(e);
			continue;
		}
	}

	dumpAllMutations();

	await browser.close();
})();

const dumpAllMutations = () => {
	writeFileSync(
		join(dirname, './benchmark/mutation-observer-results.json'),
		JSON.stringify(allMutations, null, 2)
	);
};

process.on('SIGINT', function () {
	dumpAllMutations();
	process.exit();
});
