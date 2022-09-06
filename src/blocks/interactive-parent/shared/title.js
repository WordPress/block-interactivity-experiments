const Title = ({ children, ...props }) => (
	<h2 className="title" {...props}>
		{children}
	</h2>
);

export default Title;
