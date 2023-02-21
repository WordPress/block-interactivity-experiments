import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('wp-show', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'directives-show.html'));
	});

	test('do not show if callback returns falsy value', async ({ page }) => {
		const el1 = page.getByTestId('show if callback returns truthy value');
		await expect(el1).toBeVisible();
		const el2 = page.getByTestId('do not show if callback returns false value')
		await expect(el2).toBeHidden();
	});
});
