import { test, expect } from '../tests';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('csn-page-1.html');
	});

	test('it should load update content after navigation', async ({
		page,
	}) => {
        const title = page.getByTestId('csn-heading-page-1');
        await expect(title).toHaveText(/Client-side navigation Page 1/);
        await page.getByTestId('csn-next-page').click();
        const newTitle = page.getByTestId('csn-heading-page-2');
        await expect(newTitle).toHaveText(/Client-side navigation Page 2/);
	});

	test('it should remove old content after navigation', async ({
		page,
	}) => {
        const button = page.getByTestId('csn-next-page');
        await expect(button).toBeVisible();
        await button.click();
        await expect(button).not.toBeVisible();
	});

	test('it should apply new styles after navigation', async ({
		page,
	}) => {
        const title = page.getByTestId('csn-heading-page-1');
        await expect(title).toHaveCSS('color', 'rgb(255, 0, 0)');
        await page.getByTestId('csn-next-page').click();
        const newTitle = page.getByTestId('csn-heading-page-2');
        await expect(newTitle).toHaveCSS('color', 'rgb(0, 0, 255)');
	});
});