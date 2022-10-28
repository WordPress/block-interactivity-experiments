import fs from 'fs/promises';
import net from 'net';
import Proxy from 'http-mitm-proxy';
import playwright from 'playwright';
import lighthouse from 'lighthouse';

import { domains, top_sites } from './domains.mjs';

const injectionPath = '/?wp_directives=true';
const port = 9999;
const proxy = new Proxy();

let currentHost = '';

proxy.use(Proxy.wildcard);
proxy.use(Proxy.gunzip);

/*
 * Handle incomming connections. Requests that don't point to the current host
 * are tunneled to their respective destiny rather than being processed by the
 * proxy.
 */
proxy.onConnect((req, socket, _head, callback) => {
	const [host, port] = req.url.split(':');

	// Handle requests sent to the current host.
	// TODO: this could not work with subdomains.
	if (host.includes(currentHost)) {
		return callback();
	}

	// Create a tunnel for requests pointing to a different host.
	const conn = net.connect({ port, host, allowHalfOpen: true }, () => {
		conn.on('finish', () => {
			socket.destroy();
		});
		socket.on('close', () => {
			conn.end();
		});
		socket.write('HTTP/1.1 200 OK\r\n\r\n', 'UTF-8', () => {
			conn.pipe(socket);
			socket.pipe(conn);
		});
	});

	// Handle connection errors.
	conn.on('error', (err) => {
		if (err.code !== 'ECONNRESET') {
			console.log(`Unexpected error on PROXY_TO_SERVER_SOCKET`, err);
		}
	});
	socket.on('error', (err) => {
		if (err.code !== 'ECONNRESET') {
			console.log(`Unexpected error on CLIENT_TO_PROXY_SOCKET`, err);
		}
	});
});

/*
 * Return the hydration scripts when requested.
 */
proxy.onRequest(async (ctx, callback) => {
	const request = ctx.clientToProxyRequest;
	const response = ctx.proxyToClientResponse;

	const { url } = request;
	const scriptUrls = ['/build/runtime.js', '/build/vendors.js'];

	if (scriptUrls.includes(url)) {
		const body = await fs.readFile(`.${url}`);
		response.writeHead(200, { 'Content-Type': 'text/javascript' });
		response.end(body);
	} else {
		callback();
	}
});

/*
 * Inject the hydration scripts. Includes a style that changes the background
 * color to make it noticeable that the scripts were injected. The injection
 * only happens when two conditions are fulfilled:
 * - The request host is `currentHost`
 * - The request URL coincides with `injectionPath
 */
proxy.onRequest((ctx, callback) => {
	const request = ctx.clientToProxyRequest;
	const scripts = `
        <script async src="./build/runtime.js"></script>
        <script async src="./build/vendors.js"></script>
        <style>html,body{background:red !important;}</style>
    `;

	if (request.headers.host === currentHost && request.url === injectionPath) {
		ctx.onResponseData((_ctx, chunk, callback) => {
			chunk = Buffer.from(
				chunk.toString().replace(/<\/head>/, `${scripts}</head>`)
			);
			return callback(null, chunk);
		});
	}

	callback();
});

/**
 * Return some performance data from a generated Lighthouse report. Currently it
 * only returns data for TTI and TBT audits.
 *
 * @param {*} report
 * @returns Performance results data.
 */
const getPerformanceData = (report) => {
	const { audits } = report.lhr;
	const ids = ['interactive', 'total-blocking-time'];

	return ids.reduce((acc, id) => {
		const { numericValue, numericUnit } = audits[id];
		if (numericValue !== undefined && numericUnit !== undefined) {
			acc[id] = `${numericValue.toFixed(2)} ${numericUnit}`;
		} else {
			acc[id] = 'no data';
		}
		return acc;
	}, {});
};

(async () => {
	// Init proxy.
	await new Promise((res, rej) => {
		proxy.listen({ port }, (err) => (err ? rej() : res()));
		console.log(`listening on ${port}`);
	});

	// Launch Playwright. The debugging port is required by Lighthouse.
	const browser = await playwright.chromium.launch({
		args: ['--remote-debugging-port=9222'],
		proxy: { server: `http://localhost:${port}` },
		devtools: true, // TODO: remove this later.
	});

	for (const url of [...top_sites, ...domains]) {
		try {
			// Change the host that the proxy will filter.
			currentHost = url;

			console.log(`\n==================================`);
			console.log(`Testing ${url}\n`);

			const reportNormal = await lighthouse(`http://${url}`);
			const reportHydration = await lighthouse(
				`http://${url}${injectionPath}`
			);

			const perfNormal = getPerformanceData(reportNormal);
			const perfHydration = getPerformanceData(reportHydration);

			// Display some obtained data.
			console.log(
				'TTI',
				[perfNormal, perfHydration].map((perf) => perf.interactive)
			);
			console.log(
				'TBT',
				[perfNormal, perfHydration].map(
					(perf) => perf['total-blocking-time']
				)
			);

			// TODO: store results in some kind of database.
		} catch (e) {
			console.log(e);
		}
	}

	// Close everything.
	await browser.close();
	proxy.close();
})();
