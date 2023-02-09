import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('store tag', () => {
	test('hydrates when it is well defined', async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'store-tag-ok.html'));
		const value = page.getByTestId('counter value');
		const double = page.getByTestId('counter double');
		const clicks = page.getByTestId('counter clicks');

		await expect(value).toHaveText('3');
		await expect(double).toHaveText('6');
		await expect(clicks).toHaveText('0');

		page.getByTestId('counter button').click();

		await expect(value).toHaveText('4');
		await expect(double).toHaveText('8');
		await expect(clicks).toHaveText('1');
	});

	test('does not break the page when missing', async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'store-tag-missing.html'));

		const clicks = page.getByTestId('counter clicks');
		await expect(clicks).toHaveText('0');
		page.getByTestId('counter button').click();
		await expect(clicks).toHaveText('1');
	});

	test('does not break the page when corrupted', async ({ page }) => {
		await page.goto(
			'file://' + join(__dirname, 'store-tag-corrupted-json.html')
		);

		const clicks = page.getByTestId('counter clicks');
		await expect(clicks).toHaveText('0');
		page.getByTestId('counter button').click();
		await expect(clicks).toHaveText('1');
	});

	test('does not break the page when it contains an invalid state', async ({
		page,
	}) => {
		await page.goto(
			'file://' + join(__dirname, 'store-tag-invalid-state.html')
		);

		const clicks = page.getByTestId('counter clicks');
		await expect(clicks).toHaveText('0');
		page.getByTestId('counter button').click();
		await expect(clicks).toHaveText('1');
	});
});
