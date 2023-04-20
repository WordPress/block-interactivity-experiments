import { test as base, type Page } from '@playwright/test';
import { join } from 'path';

type Fixtures = {
	/**
	 * Allow visiting local HTML files as if they were under a real domain,
	 * mainly to avoid errors from `fetch` calls
	 *
	 * It looks for HTML files inside the `/e2e/html` folder, and uses
	 * `Page.goto` under the hood.
	 *
	 * @example
	 * ```ts
	 * test.beforeEach(async ({ goToFile }) => {
	 *     await goToFile('directives-context.html');
	 * });
	 * ```
	 *
	 * @param  filename The name of the HTML file to visit.
	 * @param  options  Same options object accepted by `page.goto`.
	 *
	 * @return Promise.
	 */
	goToFile: (...params: Parameters<Page['goto']>) => ReturnType<Page['goto']>;
};

export const test = base.extend<Fixtures>({
	goToFile: async ({ page }, use) => {
		await page.route('**/*.html', async (route, req) => {
			const { pathname } = new URL(req.url());
			route.fulfill({ path: join(__dirname, './html', pathname) });
		});
		await page.route('**/*.{js,css}', async (route, req) => {
			const { pathname } = new URL(req.url());
			route.fulfill({ path: join(__dirname, '..', pathname) });
		});

		await use(async (filename, options) =>
			page.goto(join('http://a.b', filename), options)
		);
	},
});

export { expect } from '@playwright/test';
