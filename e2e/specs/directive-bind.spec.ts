import { test, expect } from '../tests';

test.describe('data-wp-bind', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('directive-bind.html');
	});

	test('add missing href at hydration', async ({ page }) => {
		const el = page.getByTestId('add missing href at hydration');
		await expect(el).toHaveAttribute('href', '/some-url');
	});

	test('change href at hydration', async ({ page }) => {
		const el = page.getByTestId('change href at hydration');
		await expect(el).toHaveAttribute('href', '/some-url');
	});

	test('update missing href at hydration', async ({ page }) => {
		const el = page.getByTestId('add missing href at hydration');
		await expect(el).toHaveAttribute('href', '/some-url');
		page.getByTestId('toggle').click();
		await expect(el).toHaveAttribute('href', '/some-other-url');
	});

	test('add missing checked at hydration', async ({ page }) => {
		const el = page.getByTestId('add missing checked at hydration');
		await expect(el).toHaveAttribute('checked', '');
	});

	test('remove existing checked at hydration', async ({ page }) => {
		const el = page.getByTestId('remove existing checked at hydration');
		await expect(el).not.toHaveAttribute('checked', '');
	});

	test('update existing checked', async ({ page }) => {
		const el = page.getByTestId('add missing checked at hydration');
		const el2 = page.getByTestId('remove existing checked at hydration');
		let checked = await el.evaluate(
			(element: HTMLInputElement) => element.checked
		);
		let checked2 = await el2.evaluate(
			(element: HTMLInputElement) => element.checked
		);
		expect(checked).toBe(true);
		expect(checked2).toBe(false);
		await page.getByTestId('toggle').click();
		checked = await el.evaluate(
			(element: HTMLInputElement) => element.checked
		);
		checked2 = await el2.evaluate(
			(element: HTMLInputElement) => element.checked
		);
		expect(checked).toBe(false);
		expect(checked2).toBe(true);
	});
});
