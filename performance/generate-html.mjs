import { faker } from '@faker-js/faker';
import { format } from 'prettier';
import { writeFileSync } from 'fs';

const createDivs = (maxDepth) => {
	let div = '';

	for (let i = 0; i < maxDepth; i++) {
		div += `<div id="${faker.lorem.word(10)}" class="${faker.lorem.word(
			10
		)}"><h2>${faker.lorem.word(10)}</h2>
		<p>${faker.lorem.paragraph(10)}</p>
		<p>${faker.lorem.paragraph(20)}</p>
		${i % 5 === 0 ? `<img src="${faker.image.nature()}">` : ''}`;
	}

	for (let i = 0; i < maxDepth; i++) {
		div += `</div>`;
	}
	return div;
};

let html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Performance Test</title>
		<script defer src="../build/vendors.js"></script>
		<script defer src="../build/runtime.js"></script>
  </head>
  <body>`;

for (let i = 0; i < 100; i++) {
	html += createDivs(10);
}

const end = `
  </body>
</html>
`;

html += end;

writeFileSync('performance/test.html', format(html, { parser: 'html' }));
