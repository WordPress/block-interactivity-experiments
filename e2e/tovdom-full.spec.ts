import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'tovdom-full.html'));
	});

	test('it should stop when it founds wp-ignore', async ({ page }) => {
		const el = page.getByTestId('inside wp-ignore');
		await expect(el).toBeVisible();
	});
});
