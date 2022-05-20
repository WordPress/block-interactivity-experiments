const Text = ( { blockProps, context } ) => {
	return (
		<div {...blockProps}>
			<p>Child element</p>
			{context?.message}
		</div>
	);
};

export default Text;
