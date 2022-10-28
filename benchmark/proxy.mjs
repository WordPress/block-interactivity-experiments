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
	// TODO: make this work with subdomains.
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
		if (err.errno !== 'ECONNRESET') {
			console.log(`Unexpected error on PROXY_TO_SERVER_SOCKET`, err);
		}
	});
	socket.on('error', (err) => {
		if (err.errno !== 'ECONNRESET') {
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
 * color to make it noticeable that the scripts were injected.
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

const getPerformanceData = (report) => {
	const { audits } = report.lhr;
	const ids = ['interactive', 'total-blocking-time'];

	return ids.reduce((acc, id) => {
		acc[id] = audits[id];
		return acc;
	}, {});
};

(async () => {
	// Init proxy.
	await new Promise((res, rej) => {
		proxy.listen({ port }, (err) => (err ? rej() : res()));
		console.log(`listening on ${port}`);
	});

	await playwright.chromium.launch({
		args: ['--remote-debugging-port=9222'],
		proxy: { server: `http://localhost:${port}` },
		devtools: true,
	});

	for (const wordpressPage of ['wordpress.org']) {
		try {
			// Change the host that the proxy will filter.
			currentHost = wordpressPage;

			console.log(`\n==================================`);
			console.log(`Testing ${wordpressPage}\n`);

			const report = await lighthouse(`http://www.${wordpressPage}`);

			const reportInjection = await lighthouse(
				`http://www.${wordpressPage}${injectionPath}`
			);

			console.log(
				getPerformanceData(report),
				getPerformanceData(reportInjection)
			);
		} catch (e) {
			console.log(e);
		}
	}
})();
