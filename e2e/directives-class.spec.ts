import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('wp-class', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'directives-class.html'));
	});

	test('remove class if callback returns falsy value', async ({ page }) => {
		const el = page.getByTestId(
			'remove class if callback returns falsy value'
		);
		await expect(el).toHaveClass('bar');
		page.getByTestId('toggle falseValue').click();
		await expect(el).toHaveClass('foo bar');
		page.getByTestId('toggle falseValue').click();
		await expect(el).toHaveClass('bar');
	});

	test('add class if callback returns truthy value', async ({ page }) => {
		const el = page.getByTestId(
			'add class if callback returns truthy value'
		);
		await expect(el).toHaveClass('foo bar');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('foo');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('foo bar');
	});

	test('handles multiple classes and callbacks', async ({ page }) => {
		const el = page.getByTestId('handles multiple classes and callbacks');
		await expect(el).toHaveClass('bar baz');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('bar baz');
		page.getByTestId('toggle falseValue').click();
		await expect(el).toHaveClass('foo bar baz');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('foo');
	});

	test('can toggle class in the middle', async ({ page }) => {
		const el = page.getByTestId('can toggle class in the middle');
		await expect(el).toHaveClass('foo bar baz');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('foo baz');
		page.getByTestId('toggle trueValue').click();
		await expect(el).toHaveClass('foo bar baz');
	});

	test('can use context values', async ({ page }) => {
		const el = page.getByTestId('can use context values');
		await expect(el).toHaveClass('');
		page.getByTestId('toggle context false value').click();
		await expect(el).toHaveClass('foo');
		page.getByTestId('toggle context false value').click();
		await expect(el).toHaveClass('');
	});
});
