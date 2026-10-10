import { glob, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { convertHtmlToMarkdown } from './html-to-markdown.ts';

const output = resolve(import.meta.dirname, '../out');
let count = 0;
for await (const file of glob('**/*.html', { cwd: output })) {
  if (file === '404.html') continue;
  const html = await readFile(resolve(output, file), 'utf8');
  await writeFile(resolve(output, file.replace(/\.html$/, '.md')), await convertHtmlToMarkdown(html));
  count++;
}
console.log(`Wrote ${count} Markdown twins from rendered native pages.`);
