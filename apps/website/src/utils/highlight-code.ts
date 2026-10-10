import refractor from 'refractor/core.js';
import javascript from 'refractor/lang/javascript.js';
import jsx from 'refractor/lang/jsx.js';
import typescript from 'refractor/lang/typescript.js';
import tsx from 'refractor/lang/tsx.js';
import bash from 'refractor/lang/bash.js';
import css from 'refractor/lang/css.js';
import diff from 'refractor/lang/diff.js';
import json from 'refractor/lang/json.js';
import { toHtml } from 'hast-util-to-html';
import highlightLine from './rehype-highlight-line.mjs';
import highlightWord from './rehype-highlight-word.mjs';

for (const language of [javascript, jsx, typescript, tsx, bash, css, diff, json]) refractor.register(language);

export function highlightCode(code: string, language = 'text', lines = '0'): string {
  const lineCount = code.split('\n').length;
  const selected = lines.split(',').flatMap(part => {
    if (!part.trim()) return [];
    const range = /^(\d+)(?:-(\d+))?$/.exec(part.trim());
    if (!range) throw new TypeError(`Invalid highlighted line range: ${part}`);
    const start = Number(range[1]);
    const end = Number(range[2] ?? range[1]);
    if (lines === '0') return [];
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || end > lineCount) throw new RangeError(`Highlighted lines ${part} are outside ${lineCount} source lines`);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });
  const nodes = refractor.registered(language) ? refractor.highlight(code, language) : [{ type: 'text' as const, value: code }];
  return toHtml(highlightWord(highlightLine(nodes, selected)));
}
