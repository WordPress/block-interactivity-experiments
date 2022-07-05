const Frontend = ( { blockProps, context } ) => {
	return (
		<div {...blockProps}>
			<p>Child element</p>
			{context?.message}
			{context && (
				<div>
					<b>static context</b>: {context['bhe/content']}
				</div>
			)}
		</div>
	);
};

export default Frontend;
