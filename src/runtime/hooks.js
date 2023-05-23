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
				if (!acc[priority]) acc[priority] = {};
				acc[priority][name] = values;

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

	// Add wrappers recursively for each priority level.
	const byPriorityLevel = usePriorityLevels(directives);
	return (
		<RecursivePriorityLevel
			directives={byPriorityLevel}
			element={element}
			evaluate={evaluate}
			originalProps={originalProps}
		/>
	);
};

// Priority level wrapper.
const RecursivePriorityLevel = ({
	directives: [directives, ...rest],
	element,
	evaluate,
	originalProps,
}) => {
	// This element needs to be a fresh copy so we are not modifying an already
	// rendered element. This prevents an error with changes in
	// `element.props.children` not being reflected in `element.__k`.
	element = cloneElement(element);

	// Recursively render the wrapper for the next priority level.
	//
	// Note that, even though we're effectively calling `createElement` here,
	// the element will not be rendered just yet. In fact, the render function
	// of `RecursivePriorityLevel` will be delayed until the current render
	// function has finished. That ensures directives in the current priorty
	// level have run (and thus modified `element`) before the next level.
	const children =
		rest.length > 0 ? (
			<RecursivePriorityLevel
				directives={rest}
				element={element}
				evaluate={evaluate}
				originalProps={originalProps}
			/>
		) : (
			element
		);

	const props = { ...originalProps, children };
	const directiveArgs = { directives, props, element, context, evaluate };

	for (const d in directives) {
		const wrapper = directiveMap[d]?.(directiveArgs);
		if (wrapper !== undefined) props.children = wrapper;
	}

	return props.children;
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
