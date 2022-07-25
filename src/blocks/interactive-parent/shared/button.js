const Button = ({ handler, children }) => {
	return <button onClick={handler}>{children}</button>;
};

export default Button;
