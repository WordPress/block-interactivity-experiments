const Frontend = ( { blockProps, context } ) => {
	return (
		<div {...blockProps}>
			{context && (
				<>
					<div>
						<b>context from the interactive parent</b>: {context?.message}
					</div>
					<div>
						<b>context from non-interactive parent</b>: {context['bhe/content']}
					</div>
				</>
			)}
		</div>
	);
};

export default Frontend;
