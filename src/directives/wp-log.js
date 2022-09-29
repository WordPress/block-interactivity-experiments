import { useEffect } from 'preact/hooks';
import { directive } from '../gutenberg-packages/directives';

directive('log', ({ log }) => {
	useEffect(() => {
		console.log(log);
	}, [log]);
});
