import wpx from '../src/runtime/wpx';

wpx({
	state: {
		trueValue: () => true,
		falseValue: () => false,
	},
});
