import { useContext, useMemo, useEffect } from 'preact/hooks';
import { useSignalEffect } from '@preact/signals';
import { deepSignal, peek } from 'deepsignal';
import { directive } from './hooks';

// Until useSignalEffects is fixed:
// https://github.com/preactjs/signals/issues/228
const raf = window.requestAnimationFrame;
const tick = () => new Promise((r) => raf(() => raf(r)));

const isObject = (item) =>
	item && typeof item === 'object' && !Array.isArray(item);

const mergeDeepSignals = (target, source) => {
	for (const k in source) {
		if (typeof peek(target, k) === 'undefined') {
			target[`$${k}`] = source[`$${k}`];
		} else if (isObject(peek(target, k)) && isObject(peek(source, k))) {
			mergeDeepSignals(target[`$${k}`].peek(), source[`$${k}`].peek());
		}
	}
};

export default () => {
	// data-wp-context
	directive(
		'context',
		({
			directives: {
				context: { default: context },
			},
			props: { children },
			context: inherited,
		}) => {
			const { Provider } = inherited;
			const inheritedValue = useContext(inherited);
			const value = useMemo(() => {
				const localValue = deepSignal(context);
				mergeDeepSignals(localValue, inheritedValue);
				return localValue;
			}, [context, inheritedValue]);

			return <Provider value={value}>{children}</Provider>;
		}
	);

	// data-wp-effect.[name]
	directive('effect', ({ directives: { effect }, context, evaluate }) => {
		const contextValue = useContext(context);
		Object.values(effect).forEach((path) => {
			useSignalEffect(() => {
				evaluate(path, { context: contextValue });
			});
		});
	});

	// data-wp-on.[event]
	directive('on', ({ directives: { on }, element, evaluate, context }) => {
		const contextValue = useContext(context);
		Object.entries(on).forEach(([name, path]) => {
			element.props[`on${name}`] = (event) => {
				evaluate(path, { event, context: contextValue });
			};
		});
	});

	// data-wp-class.[classname]
	directive(
		'class',
		({ directives: { class: className }, element, evaluate, context }) => {
			const contextValue = useContext(context);
			Object.keys(className)
				.filter((n) => n !== 'default')
				.forEach((name) => {
					const result = evaluate(className[name], {
						className: name,
						context: contextValue,
					});
					const currentClass = element.props.class || '';
					const classFinder = new RegExp(
						`(^|\\s)${name}(\\s|$)`,
						'g'
					);
					if (!result)
						element.props.class = currentClass
							.replace(classFinder, ' ')
							.trim();
					else if (!classFinder.test(currentClass))
						element.props.class = currentClass
							? `${currentClass} ${name}`
							: name;

					useEffect(() => {
						// This seems necessary because Preact doesn't change the class names
						// on the hydration, so we have to do it manually. It doesn't need
						// deps because it only needs to do it the first time.
						if (!result) {
							element.ref.current.classList.remove(name);
						} else {
							element.ref.current.classList.add(name);
						}
					}, []);
				});
		}
	);

	// data-wp-bind.[attribute]
	directive(
		'bind',
		({ directives: { bind }, element, context, evaluate }) => {
			const contextValue = useContext(context);
			Object.entries(bind)
				.filter((n) => n !== 'default')
				.forEach(([attribute, path]) => {
					const result = evaluate(path, {
						context: contextValue,
					});
					element.props[attribute] = result;

					useEffect(() => {
						// This seems necessary because Preact doesn't change the attributes
						// on the hydration, so we have to do it manually. It doesn't need
						// deps because it only needs to do it the first time.
						result === false
							? element.ref.current.removeAttribute(attribute)
							: element.ref.current.setAttribute(
									attribute,
									result === true ? '' : result
							  );
					}, []);
				});
		}
	);

	// data-wp-show
	directive(
		'show',
		({
			directives: {
				show: { default: show },
			},
			element,
			evaluate,
			context,
		}) => {
			const contextValue = useContext(context);
			if (!evaluate(show, { context: contextValue }))
				element.props.children = (
					<template>{element.props.children}</template>
				);
		}
	);

	// data-wp-ignore
	directive(
		'ignore',
		({
			element: {
				type: Type,
				props: { innerHTML, ...rest },
			},
		}) => {
			// Preserve the initial inner HTML.
			const cached = useMemo(() => innerHTML, []);
			return (
				<Type dangerouslySetInnerHTML={{ __html: cached }} {...rest} />
			);
		}
	);

	// data-wp-text
	directive(
		'text',
		({
			directives: {
				text: { default: text },
			},
			element,
			evaluate,
			context,
		}) => {
			const contextValue = useContext(context);
			element.props.children = evaluate(text, { context: contextValue });
		}
	);
};
