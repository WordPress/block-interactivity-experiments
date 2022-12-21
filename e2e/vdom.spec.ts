import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('vdom', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'vdom.html'));
	});

	test('directives that are not inside islands should not be hydrated', async ({
		page,
	}) => {
		const el = await page.getByTestId('not inside an island');
		await expect(el).toBeVisible();
	});

	test('directives that are inside islands should be hydrated', async ({
		page,
	}) => {
		const el = await page.getByTestId('inside an island');
		await expect(el).toBeHidden();
	});

	test('directive that are inside inner blocks of isolated islands should not be hydrated', async ({
		page,
	}) => {
		const el = await page.getByTestId(
			'inside an inner block of an isolated island'
		);
		await expect(el).toBeVisible();
	});
});
