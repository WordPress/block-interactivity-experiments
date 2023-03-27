import { test, expect } from '../tests';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('csn-page-1.html');
	});

	test('it should navigate in the client', async ({ page }) => {
		const csnPage1 = await page.evaluate('window.csn');
		expect(csnPage1).toBeTruthy();
		await page.getByTestId('csn-next-page').click();
		const csnPage2 = await page.evaluate('window.csn');
		expect(csnPage2).toBeTruthy();
	});

	test('it should load update content after navigation', async ({ page }) => {
		const title = page.getByTestId('csn-heading-page-1');
		await expect(title).toHaveText(/Client-side navigation Page 1/);
		await page.getByTestId('csn-next-page').click();
		const newTitle = page.getByTestId('csn-heading-page-2');
		await expect(newTitle).toHaveText(/Client-side navigation Page 2/);
	});

	test('it should remove old content after navigation', async ({ page }) => {
		const button = page.getByTestId('csn-next-page');
		await expect(button).toBeVisible();
		await button.click();
		await expect(button).not.toBeVisible();
	});

	test('it should apply new styles after navigation', async ({ page }) => {
		const title = page.getByTestId('csn-heading-page-1');
		await expect(title).toHaveCSS('color', 'rgb(255, 0, 0)');
		await page.getByTestId('csn-next-page').click();
		const newTitle = page.getByTestId('csn-heading-page-2');
		await expect(newTitle).toHaveCSS('color', 'rgb(0, 0, 255)');
	});

	test('it should remove old styles after navigation', async ({ page }) => {
		const subheading = page.getByTestId('csn-subheading');
		await expect(subheading).toHaveCSS('color', 'rgb(0, 255, 0)');
		await page.getByTestId('csn-next-page').click();
		await expect(subheading).not.toHaveCSS('color', 'rgb(0, 255, 0)');
	});

	test('it should apply new scripts after navigation', async ({ page }) => {
		await page.getByTestId('csn-next-page').click();
		const el = page.getByTestId('show when newValue is true');
		await expect(el).toBeVisible();
		await page.getByTestId('toggle newValue').click();
		await expect(el).toBeHidden();
	});

	test('it should replace current page in session history when using `replace` option', async ({
		page,
	}) => {
		await page.getByTestId('csn-next-page').click();
		await page.getByTestId('replace with page 3').click();
		const newTitle = page.getByTestId('csn-heading-page-3');
		await expect(newTitle).toHaveText(/Client-side navigation Page 3/);
		await page.goBack();
		const prevTitle = page.getByTestId('csn-heading-page-1');
		await expect(prevTitle).toHaveText(/Client-side navigation Page 1/);
	});
});
