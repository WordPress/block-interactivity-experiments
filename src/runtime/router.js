import { hydrate, render } from 'preact';
import toVdom from './vdom';
import { createRootFragment } from './utils';

// The root to render the vdom (document.body).
let rootFragment;

// The cache of visited and prefetched pages.
export const pages = new Map();

// Helper to remove domain and hash from the URL. We are only interesting in
// caching the path and the query.
const cleanUrl = (url) => {
	const u = new URL(url, 'http://a.bc');
	return u.pathname + u.search;
};

// Fetch a new page and convert it to a static virtual DOM.
const fetchPage = async (url) => {
	const html = await window.fetch(url).then((res) => res.text());
	const dom = new window.DOMParser().parseFromString(html, 'text/html');
	return toVdom(dom.body);
};

// Prefetch a page. We store the promise to avoid triggering a second fetch for
// a page if a fetching has already started.
export const prefetch = (url) => {
	url = cleanUrl(url);
	if (!pages.has(url)) {
		pages.set(url, fetchPage(url));
	}
};

// Navigate to a new page.
export const navigate = async (href) => {
	const url = cleanUrl(href);
	prefetch(url);
	const vdom = await pages.get(url);
	render(vdom, rootFragment);
	window.history.pushState({ wp: { clientNavigation: true } }, '', href);
};

// Listen to the back and forward buttons and restore the page if it's in the
// cache.
window.addEventListener('popstate', async () => {
	const url = cleanUrl(window.location); // Remove hash.
	if (pages.has(url)) {
		const vdom = await pages.get(url);
		render(vdom, rootFragment);
	} else {
		window.location.reload();
	}
});

// Initialize the router with the initial DOM.
export const init = async () => {
	const url = cleanUrl(window.location); // Remove hash.

	// Create the root fragment to hydrate everything.
	rootFragment = createRootFragment(document.documentElement, document.body);

	const vdom = toVdom(document.body);
	pages.set(url, Promise.resolve(vdom));
	hydrate(vdom, rootFragment);
};
