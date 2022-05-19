import { getFrontendAttributes } from '../gutenberg-packages/utils';

jest.mock( '@wordpress/blocks', () => {
	return {
		__esModule: true,
		getBlockType: () => ({
			attributes: {
				shouldAppear: { string: true, frontend: true },
				shouldNotAppear: { string: true, frontend: false },
				shouldAlsoNotAppear: { string: true },
			},
		}),
	};
} );

test('getFrontendAttributes', () => {
	const frontendAttributes = getFrontendAttributes( 'test', {
		shouldAppear: 'yes',
		shouldNotAppear: 'no',
		shouldAlsoNotAppear: 'no',
	} );
	expect( frontendAttributes ).toEqual( { shouldAppear: 'yes' } );
});
