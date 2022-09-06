const View = ({ blockProps, context }) => {
	const theme = 'cool theme';
	const counter = 0;

	return (
		<div {...blockProps}>
			<p>
				Block Context from interactive parent - "bhe/interactive-title":{' '}
				{context['bhe/interactive-title']}
			</p>
			<p>
				Block Context from non-interactive parent -
				"bhe/non-interactive-title":{' '}
				{context['bhe/non-interactive-title']}
			</p>
			<div className="animation"></div>
			<p>React Context - "counter": {counter}</p>
			<p>React Context - "theme": {theme}</p>
		</div>
	);
};

export default View;
