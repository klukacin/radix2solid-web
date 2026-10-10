import { createSignal, onCleanup, omit, type ComponentProps } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Box, IconButton, ScrollArea, Theme } from '@radix-solid/themes';
import { CheckIcon, CopyIcon } from '@radix-solid/icons';
import { highlightCode } from '../utils/highlight-code.js';
import styles from './code-block.module.css';
import '../syntax-highlighting.css';

type BoxProps = Extract<ComponentProps<typeof Box>, { asChild?: false }>;
const Root = (props: BoxProps) => <Box {...props} class={[styles.CodeBlockRoot, props.class]} />;
const Header = (props: BoxProps) => <Box {...props} class={[styles.CodeBlockHeader, props.class]} />;
const Content = (props: BoxProps) => <Box {...props} class={[styles.CodeBlockContent, props.class]} data-code-block-content />;
const Pre = (props: JSX.IntrinsicElements['pre'] & { overflow?: 'scroll' | 'hidden' }) => {
  const pre = <pre {...omit(props, 'overflow')} tabindex={props.tabindex ?? 0} class={[styles.CodeBlockPre, props.class]} />;
  return props.overflow === 'hidden' ? pre : <ScrollArea>{pre}</ScrollArea>;
};
const Code = (props: Omit<JSX.IntrinsicElements['code'], 'children' | 'innerHTML'> & { children: string; language?: string; lines?: string; invertLineHighlight?: boolean }) =>
  <code {...omit(props, 'language', 'lines', 'invertLineHighlight', 'children')} class={[styles.CodeBlockCode, `language-${props.language ?? 'text'}`, props.class]} data-invert-line-highlight={props.invertLineHighlight ?? false} innerHTML={highlightCode(props.children, props.language, props.lines)} />;
const LivePreview = (props: BoxProps & { scroll?: boolean }) => <Theme class="radix-themes-default-fonts" data-md-exclude><Box {...omit(props, 'scroll')} class={[styles.CodeBlockLivePreview, props.class]}><ScrollArea><div data-scroll={props.scroll ?? false} class={styles.CodeBlockLivePreviewInner}>{props.children}</div></ScrollArea></Box></Theme>;
function CopyButton(props: Extract<ComponentProps<typeof IconButton>, { asChild?: false }>) {
  const [copied, setCopied] = createSignal(false);
  const [error, setError] = createSignal('');
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));
  const copy: JSX.EventHandler<HTMLButtonElement, MouseEvent> = async event => {
    const code = event.currentTarget.closest('[data-code-block-content]')?.querySelector('code')?.textContent;
    try {
      if (code === undefined || code === null) throw new Error('Copy control requires its code block.');
      await navigator.clipboard.writeText(code);
      setError(''); setCopied(true);
      clearTimeout(timer); timer = setTimeout(() => setCopied(false), 1500);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Clipboard is unavailable.'); }
  };
  return <><IconButton {...props} aria-label="Copy code to clipboard" color="gray" variant="soft" class={[styles.CodeBlockCopyButton, props.class]} onClick={copy}>{copied() ? <CheckIcon /> : <CopyIcon />}</IconButton>{error() && <p role="alert">{error()}</p>}</>;
}
export const CodeBlock = { Root, Header, Content, Pre, Code, CopyButton, LivePreview };
