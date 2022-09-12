const View = ({ attributes, blockProps, children }) => (
	<div {...blockProps}>
		<h4 className="title">{attributes.title}</h4>
		{children}
	</div>
);

export default View;
