import { resolve } from 'node:path';
import { glob, readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

const documentComponents = new Map<string, string>();
for await (const file of glob('src/components/*.tsx', { cwd: import.meta.dirname })) {
  const source = resolve(import.meta.dirname, file);
  const content = await readFile(source, 'utf8');
  for (const match of content.matchAll(/export\s+(?:function|const)\s+([A-Z]\w*)/g)) documentComponents.set(match[1]!, source);
}
function nativeDocumentImports() {
  return (tree: any) => {
    const names = new Set<string>();
    const imported = new Set<string>(tree.children.filter((node: any) => node.type === 'mdxjsEsm').flatMap((node: any) =>
      node.data?.estree?.body?.filter((statement: any) => statement.type === 'ImportDeclaration').flatMap((statement: any) => statement.specifiers.map((specifier: any) => specifier.local.name)) ?? []));
    const visit = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if (typeof node.name === 'string') {
        const name = node.name.split('.')[0];
        if (documentComponents.has(name) || /^[A-Z]\w*Demo$/.test(name)) names.add(name);
      }
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') visit(value);
      }
    };
    visit(tree);
    for (const name of names) {
      if (imported.has(name)) continue;
      const namedSource = documentComponents.get(name);
      const folder = name.replace(/Demo$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const source = namedSource ?? resolve(import.meta.dirname, `src/demos/${folder}/index.tsx`);
      tree.children.unshift({ type: 'mdxjsEsm', value: `import ${namedSource ? `{ ${name} }` : name} from ${JSON.stringify(source)};`,
        data: { estree: { type: 'Program', sourceType: 'module', body: [{ type: 'ImportDeclaration', source: { type: 'Literal', value: source },
          specifiers: [{ type: namedSource ? 'ImportSpecifier' : 'ImportDefaultSpecifier', ...(namedSource ? { imported: { type: 'Identifier', name } } : {}), local: { type: 'Identifier', name } }] }] } } });
    }
  };
}
function heroSources() {
  return async (tree: any) => {
    const nodes: any[] = [];
    const visit = (node: any) => {
      if (node.name === 'HeroCodeBlock') nodes.push(node);
      node.children?.forEach(visit);
    };
    visit(tree);
    for (const node of nodes) {
      const folder = node.attributes.find((attribute: any) => attribute.name === 'folder')?.value;
      if (typeof folder !== 'string') throw new Error('HeroCodeBlock requires its local demo folder.');
      const name = folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const properties = [];
      for await (const file of glob('**/*.{tsx,css,cjs}', { cwd: resolve(import.meta.dirname, `src/demos/${name}`) })) {
        properties.push({ type: 'Property', kind: 'init', method: false, shorthand: false, computed: false,
          key: { type: 'Literal', value: `../demos/${name}/${file}` },
          value: { type: 'Literal', value: await readFile(resolve(import.meta.dirname, `src/demos/${name}/${file}`), 'utf8') } });
      }
      if (!properties.length) throw new Error(`Missing native sources for ${folder}.`);
      node.attributes.push({ type: 'mdxJsxAttribute', name: 'sources', value: { type: 'mdxJsxAttributeValueExpression', value: '',
        data: { estree: { type: 'Program', sourceType: 'module', body: [{ type: 'ExpressionStatement', expression: { type: 'ObjectExpression', properties } }] } } } });
    }
  };
}
function documentTitle(options: { title: string }) {
  return (tree: any) => {
    if (!tree.children.some((node: any) => node.type === 'heading' && node.depth === 1)) {
      tree.children.unshift({ type: 'heading', depth: 1, children: [{ type: 'text', value: options.title }] });
    }
  };
}

function sourceCode() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child: any) => {
        if (child.type !== 'code') { visit(child); return [child]; }
        const code = { type: 'mdxJsxFlowElement', name: 'SourceCode', attributes: [
          { type: 'mdxJsxAttribute', name: 'code', value: child.value },
          { type: 'mdxJsxAttribute', name: 'language', value: child.lang ?? 'text' },
          { type: 'mdxJsxAttribute', name: 'meta', value: child.meta ?? '' }
        ], children: [] };
        if (!/\blive="?true"?\b/.test(child.meta ?? '')) return [code];
        const source = child.value.replace(/__(.*?)__/gs, '$1').trim().replace(/;$/, '');
        const live = unified().use(remarkParse).use(remarkMdx).parse(`<LiveExample>{${source}}</LiveExample>`);
        return [...live.children, code];
      });
    };
    visit(tree);
  };
}

function nativeIntrinsics() {
  return (tree: any) => {
    // JSX stored in MDX data must stay lazy until its visible native owner renders it.
    const defer = (value: any) => value?.type === 'JSXElement' || value?.type === 'JSXFragment'
      ? { type: 'ArrowFunctionExpression', expression: true, async: false, generator: false, params: [], body: value }
      : value;
    const jsxName = (name: any): string => name.type === 'JSXIdentifier' ? name.name : `${jsxName(name.object)}.${jsxName(name.property)}`;
    const targetName = (name: any): any => name.type === 'JSXIdentifier'
      ? /^[a-z]/.test(name.name) ? { type: 'Literal', value: name.name } : { type: 'Identifier', name: name.name }
      : { type: 'MemberExpression', computed: false, optional: false, object: targetName(name.object), property: { type: 'Identifier', name: name.property.name } };
    const slots = new Set(['Dialog.Trigger', 'Dialog.Close', 'AlertDialog.Trigger', 'AlertDialog.Cancel', 'AlertDialog.Action', 'Popover.Trigger', 'Popover.Close', 'HoverCard.Trigger', 'DropdownMenu.Trigger', 'ContextMenu.Trigger', 'Tooltip', 'Reset']);
    const imports = new Set(tree.body.filter((node: any) => node.type === 'ImportDeclaration').flatMap((node: any) => node.specifiers.map((specifier: any) => specifier.local.name)));
    const componentTarget = (node: any): any => {
      if (node.type === 'Identifier' && /^[A-Z]/.test(node.name) && !imports.has(node.name)) return { type: 'MemberExpression', computed: false, optional: false, object: { type: 'Identifier', name: '_components' }, property: node };
      if (node.type === 'MemberExpression') node.object = componentTarget(node.object);
      return node;
    };
    const unitless = new Set(['animationIterationCount', 'aspectRatio', 'columnCount', 'fillOpacity', 'flex', 'flexGrow', 'flexShrink', 'fontWeight', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'strokeOpacity', 'strokeWidth', 'tabSize', 'widows', 'zIndex', 'zoom']);
    const spelling: Record<string, string> = { className: 'class', htmlFor: 'for', tabIndex: 'tabindex', strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', fillRule: 'fill-rule', clipRule: 'clip-rule', fillOpacity: 'fill-opacity' };
    const nativeStyle = (style: any) => {
      if (style?.type !== 'ObjectExpression') return;
      for (const property of style.properties) {
        if (property.type !== 'Property' || property.computed) continue;
        const name = property.key.name ?? property.key.value;
        if (typeof name !== 'string' || name.startsWith('--')) continue;
        const number = property.value.type === 'Literal' && typeof property.value.value === 'number' ? property.value.value
          : property.value.type === 'UnaryExpression' && property.value.operator === '-' && typeof property.value.argument?.value === 'number' ? -property.value.argument.value : undefined;
        if (number !== undefined && !unitless.has(name.replace(/-([a-z])/g, (_match: string, letter: string) => letter.toUpperCase()))) property.value = { type: 'Literal', value: `${number}px` };
        property.key = { type: 'Literal', value: name.replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`).replace(/^ms-/, '-ms-') };
      }
    };
    const visit = (node: any) => {
      if (!node || typeof node !== 'object') return;
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') visit(value);
      }
      if (node.type === 'JSXAttribute') {
        if (spelling[node.name?.name]) node.name.name = spelling[node.name.name];
        if (node.name?.name === 'style') nativeStyle(node.value?.expression);
      }
      if (node.type === 'Property' && (node.key.name ?? node.key.value) === 'style') nativeStyle(node.value);
      if (node.type === 'CallExpression' && node.callee?.name === 'target' && node.arguments.length) node.arguments[0] = componentTarget(node.arguments[0]);
      if (node.type === 'JSXElement') {
        const name = jsxName(node.openingElement.name).replace(/^_components\./, '');
        const composed = node.openingElement.attributes.some((attribute: any) => attribute.name?.name === 'asChild' && (!attribute.value || attribute.value.expression?.value !== false));
        if (composed || slots.has(name)) {
          const children = node.children.filter((child: any) => child.type !== 'JSXText' || child.value.trim());
          if (children.length === 1 && children[0].type === 'JSXElement') {
            const child = children[0];
            const properties = child.openingElement.attributes.map((attribute: any) => attribute.type === 'JSXSpreadAttribute'
              ? { type: 'SpreadElement', argument: attribute.argument }
              : { type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: { type: 'Literal', value: attribute.name.name },
                value: !attribute.value ? { type: 'Literal', value: true } : attribute.value.type === 'JSXExpressionContainer' ? attribute.value.expression : attribute.value });
            const childContent = child.children.filter((content: any) => content.type !== 'JSXText' || content.value.trim());
            if (childContent.length) properties.push({ type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: { type: 'Identifier', name: 'children' },
              value: childContent.length === 1 && childContent[0].type === 'JSXExpressionContainer'
                ? childContent[0].expression
                : { type: 'ArrowFunctionExpression', expression: true, async: false, generator: false, params: [], body: { type: 'JSXFragment', openingFragment: { type: 'JSXOpeningFragment' }, closingFragment: { type: 'JSXClosingFragment' }, children: child.children } } });
            node.children = [{ type: 'JSXExpressionContainer', expression: {
              type: 'ArrowFunctionExpression', expression: true, async: false, generator: false, params: [{ type: 'Identifier', name: 'target' }],
              body: { type: 'CallExpression', optional: false, callee: { type: 'Identifier', name: 'target' }, arguments: [componentTarget(targetName(child.openingElement.name)), { type: 'ObjectExpression', properties }] }
            } }];
          }
        }
      }
      if (node.type === 'VariableDeclarator' && node.id?.name === '_components' && node.init?.type === 'ObjectExpression') {
        for (const property of node.init.properties) {
          if (property.type !== 'Property' || property.value?.type !== 'Literal' || typeof property.value.value !== 'string') continue;
          const name = property.value.value;
          property.value = {
            type: 'ArrowFunctionExpression', expression: true, async: false, generator: false,
            params: [{ type: 'Identifier', name: 'props' }],
            body: {
              type: 'JSXElement', children: [], closingElement: null,
              openingElement: { type: 'JSXOpeningElement', name: { type: 'JSXIdentifier', name }, selfClosing: true,
                attributes: [{ type: 'JSXSpreadAttribute', argument: { type: 'Identifier', name: 'props' } }] }
            }
          };
        }
      }
      if (node.type === 'Property') node.value = defer(node.value);
      if (node.type === 'ArrayExpression') node.elements = node.elements.map(defer);
    };
    visit(tree);
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [{
    name: 'trusted-native-mdx', enforce: 'pre',
    async transform(source, id) {
      if (id.endsWith('.mdx?frontmatter')) return { code: `export default ${JSON.stringify(matter(source).data)};`, map: null };
      if (!id.endsWith('.mdx')) return;
      const { content, data } = matter(source);
      const result = await compile(content, { jsx: true, jsxImportSource: '@solidjs/web', remarkPlugins: [[documentTitle, { title: data.metaTitle }], remarkGfm, sourceCode, heroSources, nativeDocumentImports], rehypePlugins: [rehypeSlug], recmaPlugins: [nativeIntrinsics] });
      return { code: `${result.value}\nexport const frontmatter = ${JSON.stringify(data)};`, map: null };
    }
  }, solid({ ssr: true, extensions: ['.mdx'] })],
  resolve: { dedupe: ['solid-js', '@solidjs/web', '@solidjs/signals'] },
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist/client', manifest: !isSsrBuild,
    ssr: isSsrBuild ? 'src/entry-server.tsx' : false,
    rolldownOptions: {
      input: resolve(import.meta.dirname, isSsrBuild ? 'src/entry-server.tsx' : 'src/entry-client.tsx'),
      output: isSsrBuild ? undefined : { codeSplitting: { groups: [{
        name: 'border-icons', test: /\/packages\/icons\/dist\/client\/Border[^/]*Icon\.js$/, includeDependenciesRecursively: false
      }] } }
    }
  }
}));
