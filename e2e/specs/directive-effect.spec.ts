import { test, expect } from '../tests';

test.describe('data-wp-effect', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('directives-effect.html');
	});

	test('check that effect runs', async ({ page }) => {
		const csnPage1 = await page.evaluate('window.effect');
		expect(csnPage1).toBeTruthy();
	});

	// test.skip('check that returned callback runs on node removal');
});
