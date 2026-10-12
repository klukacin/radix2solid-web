import { createMemo, omit, onSettled, type Element } from 'solid-js';
import type { JSX } from '@solidjs/web';
import * as Themes from '@radix-solid/themes';
import { ExternalLinkIcon, InfoCircledIcon, Link2Icon } from '@radix-solid/icons';
import { ArrowRightIcon, BookmarkIcon, ExclamationTriangleIcon, CopyIcon, MagnifyingGlassIcon, ChatBubbleIcon, Share2Icon, Link1Icon, SunIcon, MoonIcon, DotsHorizontalIcon, PlusIcon, EyeOpenIcon, EyeClosedIcon, GearIcon, DividerHorizontalIcon, CheckIcon, Cross1Icon, ChevronDownIcon, ChevronUpIcon, TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, CubeIcon } from '@radix-solid/icons';
import { ThemesPropsTable } from './themes-props-table.js';
import { SourceCode } from './source-code.js';
import { HeroCodeBlock } from './hero-code-block.js';
import { CodeBlock } from './code-block.js';
import { HeroQuote } from './hero-quote.js';

const Icons = { InfoCircledIcon, ArrowRightIcon, BookmarkIcon, ExclamationTriangleIcon, CopyIcon, MagnifyingGlassIcon, ChatBubbleIcon, Share2Icon, Link1Icon, SunIcon, MoonIcon, DotsHorizontalIcon, PlusIcon, EyeOpenIcon, EyeClosedIcon, GearIcon, DividerHorizontalIcon, CheckIcon, Cross1Icon, ChevronDownIcon, ChevronUpIcon, TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, CubeIcon };
type PropDef = { name: string; required?: boolean; default?: string | boolean; type?: string; typeSimple?: string; description?: JSX.Element | (() => JSX.Element) };
const renderDescription = (value: Element | (() => Element)) => typeof value === 'function' ? value() : value;
export function PropsTable(props: { data: PropDef[]; propHeaderFixedWidth?: boolean }) {
  return <Themes.Table.Root variant="surface" my="5"><Themes.Table.Header><Themes.Table.Row>
    <Themes.Table.ColumnHeaderCell style={{ width: props.propHeaderFixedWidth === false ? 'auto' : '37%' }}>Prop</Themes.Table.ColumnHeaderCell>
    <Themes.Table.ColumnHeaderCell>Type</Themes.Table.ColumnHeaderCell><Themes.Table.ColumnHeaderCell>Default</Themes.Table.ColumnHeaderCell>
  </Themes.Table.Row></Themes.Table.Header><Themes.Table.Body>{props.data.map(row => <Themes.Table.Row>
    <Themes.Table.RowHeaderCell><Themes.Code>{row.name}{row.required ? '*' : ''}</Themes.Code>{row.description && <Themes.Popover.Root>
      <Themes.Popover.Trigger>{target => target(Themes.IconButton, { variant: 'ghost', size: '1', color: 'gray', 'aria-label': `Description of ${row.name}`, children: <InfoCircledIcon /> })}</Themes.Popover.Trigger>
      <Themes.Popover.Content side="top" aria-label={`Description of ${row.name}`} style={{ 'max-width': '350px' }}><Themes.Text as="div" size="2">{renderDescription(row.description)}</Themes.Text></Themes.Popover.Content>
    </Themes.Popover.Root>}<span class="sr-only" inert aria-hidden="true">{renderDescription(row.description)}</span></Themes.Table.RowHeaderCell>
    <Themes.Table.Cell><Themes.Code color="gray">{row.typeSimple || row.type}</Themes.Code>{row.typeSimple && row.type && <Themes.Popover.Root>
      <Themes.Popover.Trigger>{target => target(Themes.IconButton, { variant: 'ghost', size: '1', color: 'gray', 'aria-label': `Full type of ${row.name}`, children: <InfoCircledIcon /> })}</Themes.Popover.Trigger>
      <Themes.Popover.Content aria-label={`Full type of ${row.name}`}><pre>{row.type}</pre></Themes.Popover.Content>
    </Themes.Popover.Root>}</Themes.Table.Cell>
    <Themes.Table.Cell>{row.default === undefined ? <span aria-label="No default value">—</span> : <Themes.Code color="gray">{String(row.default)}</Themes.Code>}</Themes.Table.Cell>
  </Themes.Table.Row>)}</Themes.Table.Body></Themes.Table.Root>;
}

function HeadingLink(props: JSX.HTMLAttributes<HTMLHeadingElement> & { level: 'h2' | 'h3' }) {
  return <Themes.Heading {...omit(props, 'level')} as={props.level} size={props.level === 'h2' ? '6' : '4'} mt={props.level === 'h2' ? '8' : '7'} mb={props.level === 'h2' ? '3' : '2'} data-heading>
    <a class="heading-anchor" href={`#${props.id}`}>{props.children}<Link2Icon aria-hidden="true" /></a>
  </Themes.Heading>;
}

const passwordManagerIgnoreAttributes = ['data-1p-ignore', 'data-lpignore', 'data-protonpass-ignore', 'data-bwignore'];
function HeroContainer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  let root: HTMLDivElement | undefined;
  onSettled(() => {
    if (!root) return;
    const ignorePasswordManagers = (input: HTMLInputElement) => {
      for (const attribute of passwordManagerIgnoreAttributes) {
        if (input.getAttribute(attribute) !== 'true') input.setAttribute(attribute, 'true');
      }
    };
    for (const input of root.querySelectorAll('input')) ignorePasswordManagers(input);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.target instanceof HTMLInputElement) ignorePasswordManagers(record.target);
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node instanceof HTMLInputElement) ignorePasswordManagers(node);
          else for (const input of node.querySelectorAll('input')) ignorePasswordManagers(input);
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  });
  return <Themes.Theme appearance="light" asChild data-search-exclude data-md-exclude>{target => target(Themes.Flex, { ...props, ref: (element: HTMLDivElement) => { root = element; }, class: ['hero-demo', props.class], position: 'relative', align: 'start', justify: 'center', role: 'presentation' })}</Themes.Theme>;
}
export const components = {
  ...Themes, ...Icons,
  PropsTable, ThemesPropsTable, SourceCode, HeroCodeBlock, HeroContainer, HeroQuote, CodeBlock,
  LiveExample: (props: { children?: Element | (() => Element) }) => <div class="live-example" data-search-exclude data-md-exclude><Themes.Theme>{renderDescription(props.children)}</Themes.Theme></div>,
  h1: (props: JSX.HTMLAttributes<HTMLHeadingElement>) => <Themes.Heading as="h1" size="8" mb="2" {...props} />,
  h2: (props: JSX.HTMLAttributes<HTMLHeadingElement>) => <HeadingLink {...props} level="h2" />,
  h3: (props: JSX.HTMLAttributes<HTMLHeadingElement>) => <HeadingLink {...props} level="h3" />,
  h4: (props: JSX.HTMLAttributes<HTMLHeadingElement>) => <Themes.Heading as="h4" size="4" mt="6" mb="3" {...props} />,
  p: (props: JSX.HTMLAttributes<HTMLParagraphElement>) => <Themes.Text as="p" size="3" mb="4" {...props} />,
  a: (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Own the memo here: SSR and DOM read attribute getters in a different order.
    const linkProps = createMemo(() => {
      const external = typeof props.href === 'string' && props.href.startsWith('http');
      return { external, target: external ? '_blank' : props.target, rel: external ? 'noopener noreferrer' : props.rel };
    });
    return <Themes.Link {...props} underline="always" class={['document-link', props.class]} target={linkProps().target} rel={linkProps().rel}>{props.children}{linkProps().external && <ExternalLinkIcon aria-hidden="true" />}</Themes.Link>;
  },
  hr: (props: JSX.HTMLAttributes<HTMLDivElement>) => <div {...props} class={['document-rule', props.class]}><Themes.Separator size="2" my="8" /></div>,
  ul: (props: JSX.HTMLAttributes<HTMLUListElement>) => <ul {...props} class={['document-list', props.class]} />,
  ol: (props: JSX.HTMLAttributes<HTMLOListElement>) => <ol {...props} class={['document-ordered-list', props.class]} />,
  li: (props: JSX.HTMLAttributes<HTMLLIElement>) => <li {...props} class={['document-list-item', props.class]} />,
  em: Themes.Em,
  strong: Themes.Strong,
  img: (props: JSX.ImgHTMLAttributes<HTMLImageElement>) => <Themes.Box my="6"><img {...props} alt={props.alt} class={['document-image', props.class]} /></Themes.Box>,
  blockquote: Themes.Blockquote,
  pre: (props: JSX.HTMLAttributes<HTMLPreElement>) => <CodeBlock.Root my="5"><CodeBlock.Content><CodeBlock.Pre {...props} /><CodeBlock.CopyButton /></CodeBlock.Content></CodeBlock.Root>,
  code: (props: JSX.HTMLAttributes<HTMLElement>) => typeof props.class === 'string' && props.class.startsWith('language-') ? <code {...props} /> : <Themes.Code {...props} class={['document-inline-code', props.class]} />,
  Description: (props: { children?: Element }) => <div class="document-description">{props.children}</div>,
  Note: (props: JSX.HTMLAttributes<HTMLElement>) => <Themes.Box my="2"><aside {...props} class={['document-note', props.class]} /></Themes.Box>,
  ThemesLinkCard: (props: { title: string; desc: string; href: string }) => <Themes.Card asChild>{target => target('a', { href: props.href, children: <><Themes.Heading size="4" mb="2">{props.title}</Themes.Heading><Themes.Text as="p" color="gray" size="2">{props.desc}</Themes.Text></> })}</Themes.Card>,
  Highlights: (props: { features: (Element | (() => Element))[] }) => <section class="document-highlights" aria-label="Features"><Themes.Heading as="h2" size="4" mb="4" id="features">Features</Themes.Heading><ul>{props.features.map(feature => feature != null && <li><span class="feature-check" data-md-exclude><CheckIcon aria-hidden="true" /></span><Themes.Text as="p" size="3">{renderDescription(feature)}</Themes.Text></li>)}</ul></section>,
  DataAttributesTable: (props: { data: { attribute: string; values: string | string[] }[] }) => <Themes.Table.Root variant="surface" my="5"><Themes.Table.Header><Themes.Table.Row><Themes.Table.ColumnHeaderCell style={{ width: '37%' }}>Data attribute</Themes.Table.ColumnHeaderCell><Themes.Table.ColumnHeaderCell>Values</Themes.Table.ColumnHeaderCell></Themes.Table.Row></Themes.Table.Header><Themes.Table.Body>{props.data.map(row => <Themes.Table.Row><Themes.Table.RowHeaderCell><Themes.Code size="2">{row.attribute}</Themes.Code></Themes.Table.RowHeaderCell><Themes.Table.Cell>{Array.isArray(row.values) ? <Themes.Code size="2" color="gray">{row.values.map(value => `"${value}"`).join(' | ')}</Themes.Code> : <Themes.Text as="p" size="2">{row.values}</Themes.Text>}</Themes.Table.Cell></Themes.Table.Row>)}</Themes.Table.Body></Themes.Table.Root>,
  KeyboardTable: (props: { data: { keys: (Element | (() => Element))[]; description: Element | (() => Element) }[] }) => <Themes.Table.Root variant="surface" my="5"><Themes.Table.Header><Themes.Table.Row><Themes.Table.ColumnHeaderCell style={{ width: '37%' }}>Key</Themes.Table.ColumnHeaderCell><Themes.Table.ColumnHeaderCell>Description</Themes.Table.ColumnHeaderCell></Themes.Table.Row></Themes.Table.Header><Themes.Table.Body>{props.data.map(row => <Themes.Table.Row><Themes.Table.Cell><Themes.Flex gap="2">{row.keys.map(key => <Themes.Kbd>{renderDescription(key)}</Themes.Kbd>)}</Themes.Flex></Themes.Table.Cell><Themes.Table.Cell>{renderDescription(row.description)}</Themes.Table.Cell></Themes.Table.Row>)}</Themes.Table.Body></Themes.Table.Root>
};
