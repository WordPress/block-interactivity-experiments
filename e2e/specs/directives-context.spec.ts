import { Locator } from '@playwright/test';
import { test, expect } from '../tests';

const parseContent = async (loc: Locator) =>
	JSON.parse((await loc.textContent()) || '');

test.describe('data-wp-context', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('directives-context.html');
	});

	test('is correctly initialized', async ({ page }) => {
		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		expect(parentContext).toMatchObject({
			prop1: 'parent',
			prop2: 'parent',
			obj: { prop4: 'parent', prop5: 'parent' },
			array: [1, 2, 3],
		});
	});

	test('is correctly extended', async ({ page }) => {
		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(childContext).toMatchObject({
			prop1: 'parent',
			prop2: 'child',
			prop3: 'child',
			obj: { prop4: 'parent', prop5: 'child', prop6: 'child' },
			array: [4, 5, 6],
		});
	});

	test('changes in inherited properties are reflected (child)', async ({
		page,
	}) => {
		await page.getByTestId('child prop1').click();
		await page.getByTestId('child obj.prop4').click();

		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(childContext.prop1).toBe('modifiedFromChild');
		expect(childContext.obj.prop4).toBe('modifiedFromChild');

		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		expect(parentContext.prop1).toBe('modifiedFromChild');
		expect(parentContext.obj.prop4).toBe('modifiedFromChild');
	});

	test('changes in inherited properties are reflected (parent)', async ({
		page,
	}) => {
		await page.getByTestId('parent prop1').click();
		await page.getByTestId('parent obj.prop4').click();

		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(childContext.prop1).toBe('modifiedFromParent');
		expect(childContext.obj.prop4).toBe('modifiedFromParent');

		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		expect(parentContext.prop1).toBe('modifiedFromParent');
		expect(parentContext.obj.prop4).toBe('modifiedFromParent');
	});

	test('changes in shadowed properties do not leak (child)', async ({
		page,
	}) => {
		await page.getByTestId('child prop2').click();
		await page.getByTestId('child obj.prop5').click();

		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(childContext.prop2).toBe('modifiedFromChild');
		expect(childContext.obj.prop5).toBe('modifiedFromChild');

		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		expect(parentContext.prop2).toBe('parent');
		expect(parentContext.obj.prop5).toBe('parent');
	});

	test('changes in shadowed properties do not leak (parent)', async ({
		page,
	}) => {
		await page.getByTestId('parent prop2').click();
		await page.getByTestId('parent obj.prop5').click();

		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(childContext.prop2).toBe('child');
		expect(childContext.obj.prop5).toBe('child');

		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		expect(parentContext.prop2).toBe('modifiedFromParent');
		expect(parentContext.obj.prop5).toBe('modifiedFromParent');
	});

	test('Array properties are shadowed', async ({ page }) => {
		const parentContext = await parseContent(
			page.getByTestId('parent context')
		);

		const childContext = await parseContent(
			page.getByTestId('child context')
		);

		expect(parentContext.array).toMatchObject([1, 2, 3]);
		expect(childContext.array).toMatchObject([4, 5, 6]);
	});

	test('can be accessed in other directives on the same element', async ({
		page,
	}) => {
		await page.pause();
		const element = page.getByTestId('context & other directives');
		await expect(element).toHaveText('Text 1');
		await expect(element).toHaveAttribute('value', 'Text 1');
		await element.click();
		await expect(element).toHaveText('Text 2');
		await expect(element).toHaveAttribute('value', 'Text 2');
		await element.click();
		await expect(element).toHaveText('Text 1');
		await expect(element).toHaveAttribute('value', 'Text 1');
	});
});
