import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('toVdom', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'tovdom.html'));
	});

	test('it should delete comments', async ({ page }) => {
		const el = page.getByTestId('it should delete comments');
		const c = await el.innerHTML();
		await expect(el.innerHTML()).toContain('##1##');
		await expect(el.innerHTML()).toContain('##2##');
	});
});
