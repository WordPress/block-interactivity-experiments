const View = ({ attributes, blockProps, children }) => (
	<div {...blockProps}>
		<h4
			wp-log="the header of non-interactive-parent was rendered"
			className="title"
		>
			{attributes.title}
		</h4>
		{children}
	</div>
);

export default View;
