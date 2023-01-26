import { join } from 'path';
import { test, expect, Locator } from '@playwright/test';

const parseContent = async (loc: Locator) =>
	JSON.parse((await loc.textContent()) || '');

test.describe('wp-context', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('file://' + join(__dirname, 'directives-context.html'));
	});

	test('properties can be inherited', async ({ page }) => {
		const context = page.getByTestId('child context');
		const prop1ParentButton = page.getByTestId('parent prop1');
		const prop4ParentButton = page.getByTestId('parent obj.prop4');

		// Properties from parent should be inheried.
		{
			const {
				prop1,
				obj: { prop4 },
			} = await parseContent(context);

			expect(prop1).toBe('parent');
			expect(prop4).toBe('parent');
		}

		// Changes in parent context should be reflected.
		await prop1ParentButton.click();
		await prop4ParentButton.click();

		{
			const {
				prop1,
				obj: { prop4 },
			} = await parseContent(context);

			expect(prop1).toBe('modifiedFromParent');
			expect(prop4).toBe('modifiedFromParent');
		}
	});

	test('inherited properties can be modified', async ({ page }) => {
		const parentContext = page.getByTestId('parent context');
		const childContext = page.getByTestId('child context');
		const prop1ChildButton = page.getByTestId('child prop1');
		const prop4ChildButton = page.getByTestId('child obj.prop4');

		// Properties from parent should be inheried.
		{
			const {
				prop1,
				obj: { prop4 },
			} = await parseContent(childContext);

			expect(prop1).toBe('parent');
			expect(prop4).toBe('parent');
		}

		// Changes in child context should be reflected in parent.
		await prop1ChildButton.click();
		await prop4ChildButton.click();

		{
			const {
				prop1,
				obj: { prop4 },
			} = await parseContent(parentContext);

			expect(prop1).toBe('modifiedFromChild');
			expect(prop4).toBe('modifiedFromChild');
		}
	});

	test('properties can be shadowed', async ({ page }) => {
		const parentContext = page.getByTestId('parent context');
		const childContext = page.getByTestId('child context');
		const prop1Button = page.getByTestId('child prop2');
		const prop4Button = page.getByTestId('child obj.prop5');

		// Shadowed properties should NOT be inheried from parent.
		{
			const {
				prop2,
				obj: { prop5 },
			} = await parseContent(childContext);

			expect(prop2).toBe('child');
			expect(prop5).toBe('child');
		}

		// Shadowed properties should NOT have changed in parent.
		{
			const {
				prop2,
				obj: { prop5 },
			} = await parseContent(parentContext);

			expect(prop2).toBe('parent');
			expect(prop5).toBe('parent');
		}

		// Changes in shadowed context should NOT affect parent.
		await prop1Button.click();
		await prop4Button.click();

		{
			const {
				prop2,
				obj: { prop5 },
			} = await parseContent(childContext);

			expect(prop2).toBe('modifiedFromChild');
			expect(prop5).toBe('modifiedFromChild');
		}

		{
			const {
				prop2,
				obj: { prop5 },
			} = await parseContent(parentContext);

			expect(prop2).toBe('parent');
			expect(prop5).toBe('parent');
		}
	});

	test('array properties are shadowed', async ({ page }) => {
		const parentContext = page.getByTestId('parent context');
		const childContext = page.getByTestId('child context');

		{
			const { array } = await parseContent(parentContext);
			expect(array).toMatchObject([1, 2, 3]);
		}

		{
			const { array } = await parseContent(childContext);
			expect(array).toMatchObject([4, 5, 6]);
		}
	});
});
