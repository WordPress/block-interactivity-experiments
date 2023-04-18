import { test, expect } from '../tests';

test.describe('toVdom', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('tovdom.html');
	});

	test('it should delete comments', async ({ page }) => {
		const el = page.getByTestId('it should delete comments');
		const c = await el.innerHTML();
		expect(c).not.toContain('##1##');
		expect(c).not.toContain('##2##');
		const el2 = page.getByTestId(
			'it should keep this node between comments'
		);
		await expect(el2).toBeVisible();
	});

	test('it should delete processing instructions', async ({ page }) => {
		const el = page.getByTestId('it should delete processing instructions');
		const c = await el.innerHTML();
		expect(c).not.toContain('##1##');
		expect(c).not.toContain('##2##');
		const el2 = page.getByTestId(
			'it should keep this node between processing instructions'
		);
		await expect(el2).toBeVisible();
	});
});
