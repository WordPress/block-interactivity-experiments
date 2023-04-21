import { test, expect } from '../tests';

test.describe('data-wp-effect', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('directives-effect.html');
	});

	test('check that effect runs when it is added', async ({ page }) => {
		const effect = await page.evaluate('window.effect');
		expect(effect).toBe('effect added');
	});

	test('check that effect runs when it is removed', async ({ page }) => {
		await page.getByTestId('toggle').click();
		const effect = await page.evaluate('window.effect');
		expect(effect).toBe('effect removed');
	});

	test('change focus after DOM changes', async ({ page }) => {
		const el = page.getByTestId('input');
		await expect(el).toBeFocused();
		await page.getByTestId('toggle').click();
		await page.getByTestId('toggle').click();
		await expect(el).toBeFocused();
	});
});
