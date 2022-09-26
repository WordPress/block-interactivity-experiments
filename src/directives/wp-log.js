import { useEffect } from 'preact/hooks';
import { directive } from '../gutenberg-packages/directives';

directive('log', ({ wp: { log } }) => {
	useEffect(() => {
		console.log(log);
	}, [log]);
});
