import { test, expect } from '../tests';

test.describe('wp-text', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('directives-text.html');
	});

	test('show proper text reading from state', async ({ page }) => {
		await page.pause();
		const el = page.getByTestId('show state text');
		await expect(el).toHaveText("Text 1");
		page.getByTestId('toggle state text').click();
		await expect(el).toHaveText("Text 2");
		page.getByTestId('toggle state text').click();
		await expect(el).toHaveText("Text 1");
	});

	test('show proper text reading from context', async ({ page }) => {
		await page.pause();
		const el = page.getByTestId('show context text');
		await expect(el).toHaveText("Text 1");
		page.getByTestId('toggle context text').click();
		await expect(el).toHaveText("Text 2");
		page.getByTestId('toggle context text').click();
		await expect(el).toHaveText("Text 1");
	});
});
