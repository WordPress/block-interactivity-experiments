import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType as gutenbergRegisterBlockType } from '@wordpress/blocks';

const Wrapper =
	(Comp) =>
	({ attributes }) =>
		(
			<>
				{/* Block Context is not available during save
				https://wordpress.slack.com/archives/C02QB2JS7/p1649347999484329 */}
				<Comp
					blockProps={useBlockProps.save()}
					attributes={attributes}
					context={{}}
				>
					<gutenberg-inner-blocks {...useInnerBlocksProps.save()} />
				</Comp>
			</>
		);

export const registerBlockType = (name, { frontend, edit, ...rest }) => {
	gutenbergRegisterBlockType(name, {
		edit,
		save: Wrapper(frontend),
		...rest,
	});
};
