import fs from 'fs/promises';
import net from 'net';
import Proxy from 'http-mitm-proxy';

const proxy = new Proxy();

// Hosts that should be processed.
const hosts = new Set();

// Scripts that should be included in processed sites.
const toInject = ['/build/hydrationScriptForTesting.js'];

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
	if (hosts.has(host)) {
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
		if (err.code === 'ENOTFOUND') {
			conn.end();
			socket.destroy();
		} else if (err.code !== 'ECONNRESET') {
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

	if (toInject.includes(url)) {
		try {
			const body = await fs.readFile(`.${url}`);
			response.writeHead(200, { 'Content-Type': 'text/javascript' });
			response.end(body);
		} catch (e) {
			console.error(e.toString());
			response.writeHead(404, 'Not found');
			response.end('');
		}
	} else {
		callback();
	}
});

/*
 * Inject the hydration scripts. Includes a style that changes the background
 * color to make it noticeable that the scripts were injected. The injection
 * only happens when two conditions are fulfilled:
 * - The request host exists in `hosts`
 * - The request URL coincides with `injectionPath
 */
proxy.onRequest((ctx, callback) => {
	const request = ctx.clientToProxyRequest;
	const scripts = toInject
		.map((s) => `<script async src=".${s}"></script>`)
		.join('\n');

	if (hosts.has(request.headers.host) && request.url === '/') {
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
 * Init the proxy and start listening to incomming connections. It returns a
 * Promise that resolves once the proxy is ready.
 *
 * @param {*}      options
 * @param {number} options.port Proxy port.
 */
export const init = async ({ port = 9999 } = {}) => {
	await new Promise((res, rej) => {
		proxy.listen({ port }, (err) => (err ? rej() : res()));
		console.log(`Proxy listening on ${port}`);
	});
};

/**
 * Stop the proxy server.
 */
export const close = () => {
	proxy.close();
};

/**
 * Add a host to the list of hosts that should be processed.
 *
 * @param {string} host
 */
export const addHost = (host) => {
	hosts.add(host);
};

/**
 * Remove a host from the proxy hosts.
 *
 * @param {string} host
 * @returns A boolean telling whether the host has been deleted.
 */
export const removeHost = (host) => hosts.delete(host);
