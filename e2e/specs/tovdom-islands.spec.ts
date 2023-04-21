import { test, expect } from '../tests';

test.describe('toVdom - isands', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('tovdom-islands.html');
	});

	test('directives that are not inside islands should not be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId('not inside an island');
		await expect(el).toBeVisible();
	});

	test('directives that are inside islands should be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId('inside an island');
		await expect(el).toBeHidden();
	});

	test('directives that are inside inner blocks of isolated islands should not be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId(
			'inside an inner block of an isolated island'
		);
		await expect(el).toBeVisible();
	});

	// TODO: Implement this test once we have data-wp-init:
	// https://github.com/WordPress/block-interactivity-experiments/pull/220#discussion_r1171417552
	test.skip('directives inside islands should not be hydrated twice', async ({
		page,
	}) => {
		const el = page.getByTestId('island inside another island');
		const templates = el.locator('template');
		expect(await templates.count()).toEqual(1);
	});

	test('islands inside inner blocks of isolated islands should be hydrated', async ({
		page,
	}) => {
		const el = page.getByTestId(
			'island inside inner block of isolated island'
		);
		await expect(el).toBeHidden();
	});
});
