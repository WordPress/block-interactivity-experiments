import { h, options, createContext, cloneElement } from 'preact';
import { useRef, useMemo } from 'preact/hooks';
import { rawStore as store } from './store';

// Main context.
const context = createContext({});

// WordPress Directives.
const directiveMap = {};
const directivePriorities = {};
export const directive = (name, cb, { priority = 10 } = {}) => {
	directiveMap[name] = cb;
	directivePriorities[name] = priority;
};

// Resolve the path to some property of the store object.
const resolve = (path, ctx) => {
	// If path starts with !, remove it and save a flag.
	const hasNegationOperator = path[0] === '!' && !!(path = path.slice(1));
	let current = { ...store, context: ctx };
	path.split('.').forEach((p) => (current = current[p]));
	return hasNegationOperator ? !current : current;
};

// Generate the evaluate function.
const getEvaluate =
	({ ref } = {}) =>
	(path, extraArgs = {}) => {
		const value = resolve(path, extraArgs.context);
		return typeof value === 'function'
			? value({
					ref: ref.current,
					...store,
					...extraArgs,
			  })
			: value;
	};

// Separate directives by priority. The resulting array contains objects
// of directives grouped by same priority, and sorted in ascending order.
const usePriorityLevels = (directives) =>
	useMemo(() => {
		const byPriority = Object.entries(directives).reduce(
			(acc, [name, values]) => {
				const priority = directivePriorities[name];
				if (!acc[priority]) {
					acc[priority] = { [name]: values };
				} else {
					acc[priority][name] = values;
				}

				return acc;
			},
			{}
		);

		return Object.entries(byPriority)
			.sort(([p1], [p2]) => p1 - p2)
			.map(([, obj]) => obj);
	}, [directives]);

// Directive wrapper.
const Directive = ({ type, directives, props: originalProps }) => {
	const ref = useRef(null);
	const element = h(type, { ...originalProps, ref });
	const evaluate = useMemo(() => getEvaluate({ ref }), []);

	// Add wrappers incrementally for each priority level.
	return usePriorityLevels(directives).reduceRight(
		(children, withPriorityN) => (
			<PriorityLevel
				directives={withPriorityN}
				element={element}
				evaluate={evaluate}
				originalProps={originalProps}
			>
				{children}
			</PriorityLevel>
		),
		element
	);
};

// Priority level wrapper.
const PriorityLevel = ({
	directives,
	element,
	evaluate,
	originalProps,
	children,
}) => {
	const props = { ...originalProps, children };
	const directiveArgs = { directives, props, element, context, evaluate };

	for (const d in directives) {
		const wrapper = directiveMap[d]?.(directiveArgs);
		if (wrapper !== undefined) props.children = wrapper;
	}

	// This forces a children re-render so new signal values are applied. Not
	// sure why this is needed, but it is.
	return props.children && cloneElement(props.children);
};

// Preact Options Hook called each time a vnode is created.
const old = options.vnode;
options.vnode = (vnode) => {
	if (vnode.props.__directives) {
		const props = vnode.props;
		const directives = props.__directives;
		delete props.__directives;
		vnode.props = {
			type: vnode.type,
			directives,
			props,
		};
		vnode.type = Directive;
	}

	if (old) old(vnode);
};
