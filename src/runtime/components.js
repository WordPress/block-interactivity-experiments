import { useMemo } from 'preact/hooks';
import { deepSignal } from './deepsignal';
import { component } from './hooks';

export default () => {
	const WpContext = ({ children, data, context: { Provider } }) => {
		const signals = useMemo(() => deepSignal(JSON.parse(data)), []);
		return <Provider value={signals}>{children}</Provider>;
	};
	component('wp-context', WpContext);
};
