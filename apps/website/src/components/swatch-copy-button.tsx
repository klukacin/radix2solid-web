import { createSignal, onCleanup, type Element } from 'solid-js';
import { Button, Tooltip } from '@radix-solid/themes';

export function SwatchCopyButton(props: { children: Element }) {
  let button: HTMLButtonElement | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const [open, setOpen] = createSignal(false);
  const [message, setMessage] = createSignal('Click to copy');
  onCleanup(() => clearTimeout(timer));
  return <><Tooltip disableHoverableContent content={message()} open={open()}
    onOpenChange={value => {
      clearTimeout(timer);
      setOpen(value);
      if (!value) timer = setTimeout(() => setMessage('Click to copy'), 1000);
    }}
    onPointerDownOutside={event => { if (button?.contains(event.target as Node)) event.preventDefault(); }}>
    {target => target(Button, {
      variant: 'ghost', highContrast: true, size: '2', ref: element => { button = element; },
      style: { 'user-select': 'auto' },
      onClick: async event => {
        event.preventDefault();
        const value = button?.textContent;
        if (!value) return;
        clearTimeout(timer);
        try { await navigator.clipboard.writeText(value); setMessage('Copied'); }
        catch { setMessage('Copy failed'); }
        setOpen(true);
      },
      get children() { return props.children; },
    })}
  </Tooltip><span class="sr-only" role="status">{message() === 'Click to copy' ? '' : message()}</span></>;
}
