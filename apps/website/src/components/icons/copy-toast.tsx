import { createContext, createSignal, onCleanup, useContext, type Element } from 'solid-js';
import { Flex, Text, Theme } from '@radix-solid/themes';
import { Toast } from '@radix-solid/primitives';
import styles from './copy-toast.module.css';

interface CopyToastContextValue { copyIcon: (button: HTMLButtonElement) => Promise<void> }
const CopyToastContext = createContext<CopyToastContextValue>();
export function useCopyToast() {
  const context = useContext(CopyToastContext);
  if (!context) throw new Error('Icon copying requires CopyToastProvider.');
  return context;
}
export function CopyToastProvider(props: { children: Element }) {
  const [open, setOpen] = createSignal(false);
  const [icon, setIcon] = createSignal('');
  const [error, setError] = createSignal('');
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(timer));
  const copyIcon = async (button: HTMLButtonElement) => {
    try {
      const source = button.querySelector('svg');
      if (!source) throw new Error('Icon copy control requires its SVG.');
      const clone = source.cloneNode(true) as SVGSVGElement;
      clone.removeAttribute('_hk');
      for (const node of clone.querySelectorAll('[_hk]')) node.removeAttribute('_hk');
      const comments = document.createNodeIterator(clone, NodeFilter.SHOW_COMMENT);
      let comment: Node | null;
      while ((comment = comments.nextNode())) comment.parentNode?.removeChild(comment);
      const svg = clone.outerHTML;
      await navigator.clipboard.writeText(svg);
      setError(''); setIcon(svg); setOpen(true);
      clearTimeout(timer); timer = setTimeout(() => setOpen(false), 3000);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Clipboard is unavailable.'); }
  };
  return <CopyToastContext value={{ copyIcon }}><Toast.Provider>
    {props.children}
    <Theme class="radix-themes-custom-fonts" asChild>{target => target(Toast.Root, {
      class: styles.Toast, get open() { return open(); }, onOpenChange: setOpen, duration: Infinity,
      children: <Toast.Title asChild>{target => target(Text, {
        size: '2', style: { color: 'var(--gray-1)', display: 'flex', 'align-items': 'center' },
        children: <>SVG copied to clipboard <span aria-hidden="true" innerHTML={icon()} style={{ display: 'inline-flex', 'margin-left': '0.75em', 'vertical-align': 'top', 'justify-content': 'center' }} /></>,
      })}</Toast.Title>,
    })}</Theme>
    <Flex class={styles.ToastViewport} m="5" justify="center" asChild>{target => target(Toast.Viewport, {})}</Flex>
    {error() && <p role="alert">{error()}</p>}
  </Toast.Provider></CopyToastContext>;
}
