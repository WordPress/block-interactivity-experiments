import { useEffect } from 'preact/hooks';
import { directive } from '../gutenberg-packages/directives';

directive('log', ({ wpBlock: { log } }) => {
	useEffect(() => {
		console.log(log);
	}, [log]);
});
