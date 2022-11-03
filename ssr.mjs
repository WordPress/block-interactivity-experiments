import { transform, html } from 'ultrahtml';
import { readFile, writeFile } from 'fs/promises';

const file = '/blocks/tabs/render.php';

const propsToArray = (props) => {
	let result = '[';
	Object.entries(props).forEach(([key, value]) => {
		result += `["${key}", "${value}"]`;
	});
	result += ']';
	return result;
};

const start = async () => {
	const php = await readFile('./src' + file, {
		encoding: 'utf8',
	});
	const output = await transform(php, {
		components: {
			'wp-show': (props, children) =>
				html`<?php wpx_show_open_tag(${propsToArray(props)}); ?>
					${children}
					<?php wpx_show_close_tag(${propsToArray(props)}); ?>`,
		},
	});
	await writeFile('./build' + file, output);
	console.log('done!');
};

start();
