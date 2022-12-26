import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('Directives', () => {
	test.describe('wp-class', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(
				'file://' + join(__dirname, 'directives-class.html')
			);
		});

		test('removes class if callback returns falsy value', async ({
			page,
		}) => {
			const el = page.getByTestId(
				'removes class if callback returns falsy value'
			);
			await expect(el).not.toHaveClass('foo');
		});

		test('add class if callback returns truthy value', async ({ page }) => {
			const el = page.getByTestId(
				'add class if callback returns truthy value'
			);
			await expect(el).toHaveClass('foo bar');
		});
	});
});
