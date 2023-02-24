import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ page }) => {
		await page.route('**/*.html', async (route, req) => {
			const { pathname } = new URL(req.url());
			route.fulfill({ path: join(__dirname, pathname) });
		});

		await page.goto('http://a.b/tovdom-full.html');
	});

	test('it should stop when it founds wp-ignore', async ({ page }) => {
		const el = page.getByTestId('inside wp-ignore');
		await expect(el).toBeVisible();
	});

	test('it should not change wp-ignore content after navigation', async ({
		page,
	}) => {
		// Next HTML purposely removes all content inside `wp-ignore`.
		await page.getByRole('link').click();

		// HTML content inside `wp-ignore` should remain.
		const el = page.getByTestId('inside wp-ignore');
		await expect(el).toBeVisible();
	});
});
