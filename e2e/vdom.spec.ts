import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('vdom', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'vdom.html'));
	});

	test('directives that are not inside islands should not be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId('not inside an island');
		await expect(el).toBeVisible();
	});

	test('directives that are inside islands should be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId('inside an island');
		await expect(el).toBeHidden();
	});

	test('directives that are inside inner blocks of isolated islands should not be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId(
			'inside an inner block of an isolated island'
		);
		await expect(el).toBeVisible();
	});

	test('islands that are inside islands should not be hydrated again', async ({
		page,
	}) => {
		const el = page.getByTestId('island inside another island');
		const templates = el.locator('template');
		expect(await templates.count()).toEqual(1);
	});
});
