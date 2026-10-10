import assert from 'node:assert/strict';
import test from 'node:test';
import { unified } from 'unified';
import parse from 'rehype-parse';
import type { Root, RootContent } from 'hast';
import { highlightCode } from '../src/utils/highlight-code.ts';

const text = (node: Root | RootContent): string => node.type === 'text' ? node.value : 'children' in node ? node.children.map(text).join('') : '';
const elements = (node: Root | RootContent): RootContent[] => 'children' in node ? node.children.flatMap(child => [child, ...elements(child)]) : [];

test('highlighting preserves multiline source, ranges, marked words and escaped markup', () => {
  const source = '/* first\nsecond */\nconst __answer__ = "<script>alert(1)</script>";';
  const tree = unified().use(parse, { fragment: true }).parse(highlightCode(source, 'javascript', '2-3'));
  assert.equal(text(tree), '/* first\nsecond */\nconst answer = "<script>alert(1)</script>";');
  const nodes = elements(tree).filter(node => node.type === 'element');
  assert.deepEqual(nodes.filter(node => node.properties.dataHighlighted === 'true').map(node => Number(node.properties.dataLine)), [2, 3]);
  assert.equal(nodes.some(node => node.tagName === 'script'), false);
  assert.equal(nodes.filter(node => (node.properties.className as string[] | undefined)?.includes('highlight-word')).map(text).join(''), 'answer');
  assert.throws(() => highlightCode(source, 'javascript', 'not-a-range'), TypeError);
});

test('highlighting rejects ranges outside the actual native source', () => {
  for (const lines of ['3', '1-3', '2-1']) {
    assert.throws(() => highlightCode('first\nsecond', 'text', lines), RangeError);
  }
});
