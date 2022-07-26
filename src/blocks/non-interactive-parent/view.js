const View = ({ attributes, blockProps, children }) => (
	<div {...blockProps}>
		<p className="title">{attributes.title}</p>
		{children}
	</div>
);

export default View;
