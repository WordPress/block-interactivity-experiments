// This script can be copy-pasted into the console of the browser
// to see if any mutations that are not removal of comments are happening on the page.

(() => {
	// node_modules/preact/dist/preact.module.js
	var n;
	var l;
	var u;
	var i;
	var t;
	var o;
	var r;
	var f = {};
	var e = [];
	var c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	function s(n2, l2) {
		for (var u2 in l2) n2[u2] = l2[u2];
		return n2;
	}
	function a(n2) {
		var l2 = n2.parentNode;
		l2 && l2.removeChild(n2);
	}
	function h(l2, u2, i2) {
		var t2,
			o2,
			r2,
			f2 = {};
		for (r2 in u2)
			'key' == r2
				? (t2 = u2[r2])
				: 'ref' == r2
				? (o2 = u2[r2])
				: (f2[r2] = u2[r2]);
		if (
			(arguments.length > 2 &&
				(f2.children =
					arguments.length > 3 ? n.call(arguments, 2) : i2),
			'function' == typeof l2 && null != l2.defaultProps)
		)
			for (r2 in l2.defaultProps)
				void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
		return v(l2, f2, t2, o2, null);
	}
	function v(n2, i2, t2, o2, r2) {
		var f2 = {
			type: n2,
			props: i2,
			key: t2,
			ref: o2,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__d: void 0,
			__c: null,
			__h: null,
			constructor: void 0,
			__v: null == r2 ? ++u : r2,
		};
		return null == r2 && null != l.vnode && l.vnode(f2), f2;
	}
	function p(n2) {
		return n2.children;
	}
	function d(n2, l2) {
		(this.props = n2), (this.context = l2);
	}
	function _(n2, l2) {
		if (null == l2)
			return n2.__ ? _(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
		for (var u2; l2 < n2.__k.length; l2++)
			if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
		return 'function' == typeof n2.type ? _(n2) : null;
	}
	function k(n2) {
		var l2, u2;
		if (null != (n2 = n2.__) && null != n2.__c) {
			for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
				if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
					n2.__e = n2.__c.base = u2.__e;
					break;
				}
			return k(n2);
		}
	}
	function b(n2) {
		((!n2.__d && (n2.__d = true) && t.push(n2) && !g.__r++) ||
			o !== l.debounceRendering) &&
			((o = l.debounceRendering) || setTimeout)(g);
	}
	function g() {
		for (var n2; (g.__r = t.length); )
			(n2 = t.sort(function (n3, l2) {
				return n3.__v.__b - l2.__v.__b;
			})),
				(t = []),
				n2.some(function (n3) {
					var l2, u2, i2, t2, o2, r2;
					n3.__d &&
						((o2 = (t2 = (l2 = n3).__v).__e),
						(r2 = l2.__P) &&
							((u2 = []),
							((i2 = s({}, t2)).__v = t2.__v + 1),
							j(
								r2,
								t2,
								i2,
								l2.__n,
								void 0 !== r2.ownerSVGElement,
								null != t2.__h ? [o2] : null,
								u2,
								null == o2 ? _(t2) : o2,
								t2.__h
							),
							z(u2, t2),
							t2.__e != o2 && k(t2)));
				});
	}
	function w(n2, l2, u2, i2, t2, o2, r2, c2, s2, a2) {
		var h2,
			y,
			d2,
			k2,
			b2,
			g2,
			w2,
			x = (i2 && i2.__k) || e,
			C2 = x.length;
		for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
			if (
				null !=
				(k2 = u2.__k[h2] =
					null == (k2 = l2[h2]) || 'boolean' == typeof k2
						? null
						: 'string' == typeof k2 ||
						  'number' == typeof k2 ||
						  'bigint' == typeof k2
						? v(null, k2, null, null, k2)
						: Array.isArray(k2)
						? v(p, { children: k2 }, null, null, null)
						: k2.__b > 0
						? v(
								k2.type,
								k2.props,
								k2.key,
								k2.ref ? k2.ref : null,
								k2.__v
						  )
						: k2)
			) {
				if (
					((k2.__ = u2),
					(k2.__b = u2.__b + 1),
					null === (d2 = x[h2]) ||
						(d2 && k2.key == d2.key && k2.type === d2.type))
				)
					x[h2] = void 0;
				else
					for (y = 0; y < C2; y++) {
						if (
							(d2 = x[y]) &&
							k2.key == d2.key &&
							k2.type === d2.type
						) {
							x[y] = void 0;
							break;
						}
						d2 = null;
					}
				j(n2, k2, (d2 = d2 || f), t2, o2, r2, c2, s2, a2),
					(b2 = k2.__e),
					(y = k2.ref) &&
						d2.ref != y &&
						(w2 || (w2 = []),
						d2.ref && w2.push(d2.ref, null, k2),
						w2.push(y, k2.__c || b2, k2)),
					null != b2
						? (null == g2 && (g2 = b2),
						  'function' == typeof k2.type && k2.__k === d2.__k
								? (k2.__d = s2 = m(k2, s2, n2))
								: (s2 = A(n2, k2, d2, x, b2, s2)),
						  'function' == typeof u2.type && (u2.__d = s2))
						: s2 &&
						  d2.__e == s2 &&
						  s2.parentNode != n2 &&
						  (s2 = _(d2));
			}
		for (u2.__e = g2, h2 = C2; h2--; ) null != x[h2] && N(x[h2], x[h2]);
		if (w2)
			for (h2 = 0; h2 < w2.length; h2++) M(w2[h2], w2[++h2], w2[++h2]);
	}
	function m(n2, l2, u2) {
		for (var i2, t2 = n2.__k, o2 = 0; t2 && o2 < t2.length; o2++)
			(i2 = t2[o2]) &&
				((i2.__ = n2),
				(l2 =
					'function' == typeof i2.type
						? m(i2, l2, u2)
						: A(u2, i2, i2, t2, i2.__e, l2)));
		return l2;
	}
	function A(n2, l2, u2, i2, t2, o2) {
		var r2, f2, e2;
		if (void 0 !== l2.__d) (r2 = l2.__d), (l2.__d = void 0);
		else if (null == u2 || t2 != o2 || null == t2.parentNode)
			n: if (null == o2 || o2.parentNode !== n2)
				n2.appendChild(t2), (r2 = null);
			else {
				for (
					f2 = o2, e2 = 0;
					(f2 = f2.nextSibling) && e2 < i2.length;
					e2 += 2
				)
					if (f2 == t2) break n;
				n2.insertBefore(t2, o2), (r2 = o2);
			}
		return void 0 !== r2 ? r2 : t2.nextSibling;
	}
	function C(n2, l2, u2, i2, t2) {
		var o2;
		for (o2 in u2)
			'children' === o2 ||
				'key' === o2 ||
				o2 in l2 ||
				H(n2, o2, null, u2[o2], i2);
		for (o2 in l2)
			(t2 && 'function' != typeof l2[o2]) ||
				'children' === o2 ||
				'key' === o2 ||
				'value' === o2 ||
				'checked' === o2 ||
				u2[o2] === l2[o2] ||
				H(n2, o2, l2[o2], u2[o2], i2);
	}
	function $(n2, l2, u2) {
		'-' === l2[0]
			? n2.setProperty(l2, u2)
			: (n2[l2] =
					null == u2
						? ''
						: 'number' != typeof u2 || c.test(l2)
						? u2
						: u2 + 'px');
	}
	function H(n2, l2, u2, i2, t2) {
		var o2;
		n: if ('style' === l2)
			if ('string' == typeof u2) n2.style.cssText = u2;
			else {
				if (('string' == typeof i2 && (n2.style.cssText = i2 = ''), i2))
					for (l2 in i2) (u2 && l2 in u2) || $(n2.style, l2, '');
				if (u2)
					for (l2 in u2)
						(i2 && u2[l2] === i2[l2]) || $(n2.style, l2, u2[l2]);
			}
		else if ('o' === l2[0] && 'n' === l2[1])
			(o2 = l2 !== (l2 = l2.replace(/Capture$/, ''))),
				(l2 =
					l2.toLowerCase() in n2
						? l2.toLowerCase().slice(2)
						: l2.slice(2)),
				n2.l || (n2.l = {}),
				(n2.l[l2 + o2] = u2),
				u2
					? i2 || n2.addEventListener(l2, o2 ? T : I, o2)
					: n2.removeEventListener(l2, o2 ? T : I, o2);
		else if ('dangerouslySetInnerHTML' !== l2) {
			if (t2) l2 = l2.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
			else if (
				'href' !== l2 &&
				'list' !== l2 &&
				'form' !== l2 &&
				'tabIndex' !== l2 &&
				'download' !== l2 &&
				l2 in n2
			)
				try {
					n2[l2] = null == u2 ? '' : u2;
					break n;
				} catch (n3) {}
			'function' == typeof u2 ||
				(null == u2 || (false === u2 && -1 == l2.indexOf('-'))
					? n2.removeAttribute(l2)
					: n2.setAttribute(l2, u2));
		}
	}
	function I(n2) {
		this.l[n2.type + false](l.event ? l.event(n2) : n2);
	}
	function T(n2) {
		this.l[n2.type + true](l.event ? l.event(n2) : n2);
	}
	function j(n2, u2, i2, t2, o2, r2, f2, e2, c2) {
		var a2,
			h2,
			v2,
			y,
			_2,
			k2,
			b2,
			g2,
			m2,
			x,
			A2,
			C2,
			$2,
			H2 = u2.type;
		if (void 0 !== u2.constructor) return null;
		null != i2.__h &&
			((c2 = i2.__h),
			(e2 = u2.__e = i2.__e),
			(u2.__h = null),
			(r2 = [e2])),
			(a2 = l.__b) && a2(u2);
		try {
			n: if ('function' == typeof H2) {
				(g2 = u2.props),
					(m2 = (a2 = H2.contextType) && t2[a2.__c]),
					(x = a2 ? (m2 ? m2.props.value : a2.__) : t2),
					i2.__c
						? (b2 = (h2 = u2.__c = i2.__c).__ = h2.__E)
						: ('prototype' in H2 && H2.prototype.render
								? (u2.__c = h2 = new H2(g2, x))
								: ((u2.__c = h2 = new d(g2, x)),
								  (h2.constructor = H2),
								  (h2.render = O)),
						  m2 && m2.sub(h2),
						  (h2.props = g2),
						  h2.state || (h2.state = {}),
						  (h2.context = x),
						  (h2.__n = t2),
						  (v2 = h2.__d = true),
						  (h2.__h = []),
						  (h2._sb = [])),
					null == h2.__s && (h2.__s = h2.state),
					null != H2.getDerivedStateFromProps &&
						(h2.__s == h2.state && (h2.__s = s({}, h2.__s)),
						s(h2.__s, H2.getDerivedStateFromProps(g2, h2.__s))),
					(y = h2.props),
					(_2 = h2.state);
				for (a2 = 0; a2 < h2._sb.length; a2++)
					h2.__h.push(h2._sb[a2]), (h2._sb = []);
				if (v2)
					null == H2.getDerivedStateFromProps &&
						null != h2.componentWillMount &&
						h2.componentWillMount(),
						null != h2.componentDidMount &&
							h2.__h.push(h2.componentDidMount);
				else {
					if (
						(null == H2.getDerivedStateFromProps &&
							g2 !== y &&
							null != h2.componentWillReceiveProps &&
							h2.componentWillReceiveProps(g2, x),
						(!h2.__e &&
							null != h2.shouldComponentUpdate &&
							false ===
								h2.shouldComponentUpdate(g2, h2.__s, x)) ||
							u2.__v === i2.__v)
					) {
						(h2.props = g2),
							(h2.state = h2.__s),
							u2.__v !== i2.__v && (h2.__d = false),
							(h2.__v = u2),
							(u2.__e = i2.__e),
							(u2.__k = i2.__k),
							u2.__k.forEach(function (n3) {
								n3 && (n3.__ = u2);
							}),
							h2.__h.length && f2.push(h2);
						break n;
					}
					null != h2.componentWillUpdate &&
						h2.componentWillUpdate(g2, h2.__s, x),
						null != h2.componentDidUpdate &&
							h2.__h.push(function () {
								h2.componentDidUpdate(y, _2, k2);
							});
				}
				if (
					((h2.context = x),
					(h2.props = g2),
					(h2.__v = u2),
					(h2.__P = n2),
					(A2 = l.__r),
					(C2 = 0),
					'prototype' in H2 && H2.prototype.render)
				)
					(h2.state = h2.__s),
						(h2.__d = false),
						A2 && A2(u2),
						(a2 = h2.render(h2.props, h2.state, h2.context));
				else
					do {
						(h2.__d = false),
							A2 && A2(u2),
							(a2 = h2.render(h2.props, h2.state, h2.context)),
							(h2.state = h2.__s);
					} while (h2.__d && ++C2 < 25);
				(h2.state = h2.__s),
					null != h2.getChildContext &&
						(t2 = s(s({}, t2), h2.getChildContext())),
					v2 ||
						null == h2.getSnapshotBeforeUpdate ||
						(k2 = h2.getSnapshotBeforeUpdate(y, _2)),
					($2 =
						null != a2 && a2.type === p && null == a2.key
							? a2.props.children
							: a2),
					w(
						n2,
						Array.isArray($2) ? $2 : [$2],
						u2,
						i2,
						t2,
						o2,
						r2,
						f2,
						e2,
						c2
					),
					(h2.base = u2.__e),
					(u2.__h = null),
					h2.__h.length && f2.push(h2),
					b2 && (h2.__E = h2.__ = null),
					(h2.__e = false);
			} else
				null == r2 && u2.__v === i2.__v
					? ((u2.__k = i2.__k), (u2.__e = i2.__e))
					: (u2.__e = L(i2.__e, u2, i2, t2, o2, r2, f2, c2));
			(a2 = l.diffed) && a2(u2);
		} catch (n3) {
			(u2.__v = null),
				(c2 || null != r2) &&
					((u2.__e = e2),
					(u2.__h = !!c2),
					(r2[r2.indexOf(e2)] = null)),
				l.__e(n3, u2, i2);
		}
	}
	function z(n2, u2) {
		l.__c && l.__c(u2, n2),
			n2.some(function (u3) {
				try {
					(n2 = u3.__h),
						(u3.__h = []),
						n2.some(function (n3) {
							n3.call(u3);
						});
				} catch (n3) {
					l.__e(n3, u3.__v);
				}
			});
	}
	function L(l2, u2, i2, t2, o2, r2, e2, c2) {
		var s2,
			h2,
			v2,
			y = i2.props,
			p2 = u2.props,
			d2 = u2.type,
			k2 = 0;
		if (('svg' === d2 && (o2 = true), null != r2)) {
			for (; k2 < r2.length; k2++)
				if (
					(s2 = r2[k2]) &&
					'setAttribute' in s2 == !!d2 &&
					(d2 ? s2.localName === d2 : 3 === s2.nodeType)
				) {
					(l2 = s2), (r2[k2] = null);
					break;
				}
		}
		if (null == l2) {
			if (null === d2) return document.createTextNode(p2);
			(l2 = o2
				? document.createElementNS('http://www.w3.org/2000/svg', d2)
				: document.createElement(d2, p2.is && p2)),
				(r2 = null),
				(c2 = false);
		}
		if (null === d2) y === p2 || (c2 && l2.data === p2) || (l2.data = p2);
		else {
			if (
				((r2 = r2 && n.call(l2.childNodes)),
				(h2 = (y = i2.props || f).dangerouslySetInnerHTML),
				(v2 = p2.dangerouslySetInnerHTML),
				!c2)
			) {
				if (null != r2)
					for (y = {}, k2 = 0; k2 < l2.attributes.length; k2++)
						y[l2.attributes[k2].name] = l2.attributes[k2].value;
				(v2 || h2) &&
					((v2 &&
						((h2 && v2.__html == h2.__html) ||
							v2.__html === l2.innerHTML)) ||
						(l2.innerHTML = (v2 && v2.__html) || ''));
			}
			if ((C(l2, p2, y, o2, c2), v2)) u2.__k = [];
			else if (
				((k2 = u2.props.children),
				w(
					l2,
					Array.isArray(k2) ? k2 : [k2],
					u2,
					i2,
					t2,
					o2 && 'foreignObject' !== d2,
					r2,
					e2,
					r2 ? r2[0] : i2.__k && _(i2, 0),
					c2
				),
				null != r2)
			)
				for (k2 = r2.length; k2--; ) null != r2[k2] && a(r2[k2]);
			c2 ||
				('value' in p2 &&
					void 0 !== (k2 = p2.value) &&
					(k2 !== l2.value ||
						('progress' === d2 && !k2) ||
						('option' === d2 && k2 !== y.value)) &&
					H(l2, 'value', k2, y.value, false),
				'checked' in p2 &&
					void 0 !== (k2 = p2.checked) &&
					k2 !== l2.checked &&
					H(l2, 'checked', k2, y.checked, false));
		}
		return l2;
	}
	function M(n2, u2, i2) {
		try {
			'function' == typeof n2 ? n2(u2) : (n2.current = u2);
		} catch (n3) {
			l.__e(n3, i2);
		}
	}
	function N(n2, u2, i2) {
		var t2, o2;
		if (
			(l.unmount && l.unmount(n2),
			(t2 = n2.ref) &&
				((t2.current && t2.current !== n2.__e) || M(t2, null, u2)),
			null != (t2 = n2.__c))
		) {
			if (t2.componentWillUnmount)
				try {
					t2.componentWillUnmount();
				} catch (n3) {
					l.__e(n3, u2);
				}
			(t2.base = t2.__P = null), (n2.__c = void 0);
		}
		if ((t2 = n2.__k))
			for (o2 = 0; o2 < t2.length; o2++)
				t2[o2] && N(t2[o2], u2, i2 || 'function' != typeof n2.type);
		i2 || null == n2.__e || a(n2.__e), (n2.__ = n2.__e = n2.__d = void 0);
	}
	function O(n2, l2, u2) {
		return this.constructor(n2, u2);
	}
	function P(u2, i2, t2) {
		var o2, r2, e2;
		l.__ && l.__(u2, i2),
			(r2 = (o2 = 'function' == typeof t2)
				? null
				: (t2 && t2.__k) || i2.__k),
			(e2 = []),
			j(
				i2,
				(u2 = ((!o2 && t2) || i2).__k = h(p, null, [u2])),
				r2 || f,
				f,
				void 0 !== i2.ownerSVGElement,
				!o2 && t2
					? [t2]
					: r2
					? null
					: i2.firstChild
					? n.call(i2.childNodes)
					: null,
				e2,
				!o2 && t2 ? t2 : r2 ? r2.__e : i2.firstChild,
				o2
			),
			z(e2, u2);
	}
	function S(n2, l2) {
		P(n2, l2, S);
	}
	(n = e.slice),
		(l = {
			__e: function (n2, l2, u2, i2) {
				for (var t2, o2, r2; (l2 = l2.__); )
					if ((t2 = l2.__c) && !t2.__)
						try {
							if (
								((o2 = t2.constructor) &&
									null != o2.getDerivedStateFromError &&
									(t2.setState(
										o2.getDerivedStateFromError(n2)
									),
									(r2 = t2.__d)),
								null != t2.componentDidCatch &&
									(t2.componentDidCatch(n2, i2 || {}),
									(r2 = t2.__d)),
								r2)
							)
								return (t2.__E = t2);
						} catch (l3) {
							n2 = l3;
						}
				throw n2;
			},
		}),
		(u = 0),
		(i = function (n2) {
			return null != n2 && void 0 === n2.constructor;
		}),
		(d.prototype.setState = function (n2, l2) {
			var u2;
			(u2 =
				null != this.__s && this.__s !== this.state
					? this.__s
					: (this.__s = s({}, this.state))),
				'function' == typeof n2 && (n2 = n2(s({}, u2), this.props)),
				n2 && s(u2, n2),
				null != n2 && this.__v && (l2 && this._sb.push(l2), b(this));
		}),
		(d.prototype.forceUpdate = function (n2) {
			this.__v && ((this.__e = true), n2 && this.__h.push(n2), b(this));
		}),
		(d.prototype.render = p),
		(t = []),
		(g.__r = 0),
		(r = 0);

	// src/runtime/vdom.js
	function toVdom(node) {
		const props = {};
		const { attributes, childNodes } = node;
		const wpDirectives = {};
		let hasWpDirectives = false;
		if (node.nodeType === 3) return node.data;
		if (node.nodeType === 4) {
			node.replaceWith(new Text(node.nodeValue));
			return node.nodeValue;
		}
		for (let i2 = 0; i2 < attributes.length; i2++) {
			const n = attributes[i2].name;
			if (n[0] === 'w' && n[1] === 'p' && n[2] === '-' && n[3]) {
				hasWpDirectives = true;
				let val = attributes[i2].value;
				try {
					val = JSON.parse(val);
				} catch (e2) {}
				const [, prefix, suffix] = /wp-([^:]+):?(.*)$/.exec(n);
				wpDirectives[prefix] = wpDirectives[prefix] || {};
				wpDirectives[prefix][suffix || 'default'] = val;
			} else {
				props[n] = attributes[i2].value;
			}
		}
		if (hasWpDirectives) props.wp = wpDirectives;
		const children = [];
		for (let i2 = 0; i2 < childNodes.length; i2++) {
			const child = childNodes[i2];
			if (child.nodeType === 8) {
				child.remove();
				i2--;
			} else {
				children.push(toVdom(child));
			}
		}
		return h(node.localName, props, children);
	}

	// src/runtime/utils.js
	var createRootFragment = (parent, replaceNode) => {
		replaceNode = [].concat(replaceNode);
		const s2 = replaceNode[replaceNode.length - 1].nextSibling;
		function insert(c2, r2) {
			parent.insertBefore(c2, r2 || s2);
		}
		return (parent.__k = {
			nodeType: 1,
			parentNode: parent,
			firstChild: replaceNode[0],
			childNodes: replaceNode,
			insertBefore: insert,
			appendChild: insert,
			removeChild(c2) {
				parent.removeChild(c2);
			},
		});
	};
	var knownSymbols = new Set(
		Object.getOwnPropertyNames(Symbol)
			.map((key) => Symbol[key])
			.filter((value) => typeof value === 'symbol')
	);

	// benchmark/hydrationScript.js
	function runHydration() {
		rootFragment = createRootFragment(
			document.documentElement,
			document.body
		);
		const body = toVdom(document.body);
		S(body, rootFragment);
	}
	window.__runHydration = runHydration;
})();

/**
 * Takes a Mutation and returns the string representation of the node
 * @param {MutationRecord} mutation
 */
function mutationToString(mutation) {
	var tmpNode = document.createElement('div');
	tmpNode.appendChild(mutation.target.cloneNode(true));
	var str = tmpNode.innerHTML.slice(0, 70);
	tmpNode = mutation = null; // prevent memory leaks in IE
	return str;
}

/**
 * Takes a DOM Node and returns the string representation of the node
 */
function nodeToString(node) {
	if (node === null) return null;
	var tmpNode = document.createElement('div');
	tmpNode.appendChild(node.cloneNode(true));
	var str = tmpNode.innerHTML.slice(0, 70);
	tmpNode = node = null; // prevent memory leaks in IE
	return str;
}

/**
 * Takes a Mutation and console logs the string representation of the node
 * @param {MutationRecord[]} mutations
 */
function processMutations(mutations) {
	for (const mutation of mutations) {
		if (
			Array.from(mutation?.removedNodes || []).some(
				(node) => node?.nodeName !== '#comment'
			)
		) {
			console.log(mutation);
		}
	}
}

const observer = new MutationObserver(processMutations);
observer.observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true,
});

window.__runHydration();

// Process pending mutations
let mutations = observer.takeRecords();
observer.disconnect();
processMutations(mutations);
