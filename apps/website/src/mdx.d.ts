declare module '*.mdx' {
  import type { Component } from 'solid-js';
  const Document: Component<{ components: Record<string, unknown> }>;
  export default Document;
  export const frontmatter: { metaTitle: string; metaDescription?: string; [key: string]: unknown };
}

declare module '*rehype-highlight-line.mjs' {
  import type { RootContent } from 'hast';
  export default function highlightLine(nodes: RootContent[], lines: number[]): RootContent[];
}
declare module '*rehype-highlight-word.mjs' {
  import type { RootContent } from 'hast';
  export default function highlightWord(nodes: RootContent[]): RootContent[];
}
