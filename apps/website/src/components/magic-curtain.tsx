import { createContext, createSignal, flush, omit, onSettled, useContext, type Element } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { NavigationMenu } from '@radix-solid/primitives';
import styles from './magic-curtain.module.css';

type Visibility = 'hidden' | 'animating-out' | 'visible';
interface CurtainItem {
  node: HTMLDivElement;
  visibility: Visibility;
  setVisibility: (value: Visibility) => void;
}
interface CurtainContext {
  items: CurtainItem[];
  setItems: (update: (items: CurtainItem[]) => CurtainItem[]) => void;
  position: { left: number; top: number };
  setPosition: (position: { left: number; top: number }) => void;
  highlighted: string;
  setHighlighted: (value: string) => void;
  hovered: string;
  setHovered: (value: string | ((current: string) => string)) => void;
  focused: string;
  setFocused: (value: string | ((current: string) => string)) => void;
}
const Context = createContext<CurtainContext | null>(null);
function useCurtain() {
  const context = useContext(Context);
  if (!context) throw new Error('MagicCurtain parts require Root.');
  return context;
}
export function Root(props: { children: Element }) {
  const [items, setItems] = createSignal<CurtainItem[]>([]);
  const [position, setPosition] = createSignal({ left: -9999, top: -9999 });
  const [highlighted, setHighlighted] = createSignal('0');
  const [hovered, setHovered] = createSignal('');
  const [focused, setFocused] = createSignal('');
  const [firefox, setFirefox] = createSignal(false);
  const context: CurtainContext = {
    get items() { return items(); }, setItems,
    get position() { return position(); }, setPosition,
    get highlighted() { return highlighted(); }, setHighlighted,
    get hovered() { return hovered(); }, setHovered,
    get focused() { return focused(); }, setFocused,
  };
  onSettled(() => { setFirefox(/firefox/i.test(navigator.userAgent)); });
  return <Context value={context}><div data-is-firefox={String(firefox())} class={styles.MagicCurtainRoot}>{props.children}</div></Context>;
}
export function Item(props: JSX.IntrinsicElements['div'] & { defaultVisibility?: Visibility }) {
  const context = useCurtain();
  const [visibility, setVisibility] = createSignal<Visibility>(props.defaultVisibility ?? 'hidden');
  let node!: HTMLDivElement;
  onSettled(() => {
    const item: CurtainItem = { node, get visibility() { return visibility(); }, setVisibility };
    context.setItems(items => [...items, item].sort((a, b) => a.node.compareDocumentPosition(b.node) & 4 ? -1 : 1));
    return () => context.setItems(items => items.filter(value => value !== item));
  });
  return <div {...omit(props, 'defaultVisibility', 'children', 'ref', 'class')} ref={element => { node = element; if (typeof props.ref === 'function') props.ref(element); }} class={[styles.MagicCurtainItem, props.class]} data-visibility={visibility()} inert={visibility() !== 'visible'} aria-hidden={visibility() !== 'visible' ? 'true' : undefined}>{visibility() === 'hidden' ? null : props.children}</div>;
}
export function Controls(props: { images?: string[] }) {
  const context = useCurtain();
  const [menuValue, setMenuValue] = createSignal('');
  const [offset, setOffset] = createSignal('');
  let wrapper!: HTMLDivElement;
  let queued: CurtainItem | undefined;
  let removeAnimationListener: (() => void) | undefined;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  function deferClear(kind: 'hovered' | 'focused', value: string) {
    const timer = setTimeout(() => {
      timers.delete(timer);
      const setter = kind === 'hovered' ? context.setHovered : context.setFocused;
      setter(current => current === value ? '' : current);
    });
    timers.add(timer);
  }
  function start(item: CurtainItem) {
    if (item.visibility === 'visible') return;
    const outgoing = context.items.find(value => value.visibility === 'visible');
    const finish = (event: AnimationEvent) => {
      if (event.target !== outgoing?.node || ![styles['magic-curtain-fade'], styles['magic-curtain-clip'], styles['magic-curtain-clip-reverse']].includes(event.animationName)) return;
      removeAnimationListener?.();
      removeAnimationListener = undefined;
      outgoing.setVisibility('hidden');
      const next = queued;
      queued = undefined;
      if (next) start(next);
      flush();
    };
    item.setVisibility('visible');
    if (outgoing) {
      outgoing.node.addEventListener('animationend', finish);
      outgoing.node.addEventListener('animationcancel', finish);
      removeAnimationListener = () => {
        outgoing.node.removeEventListener('animationend', finish);
        outgoing.node.removeEventListener('animationcancel', finish);
      };
      outgoing.setVisibility('animating-out');
    }
  }
  function select(item: CurtainItem) {
    if (item.visibility === 'visible') return;
    context.setHighlighted(context.items.indexOf(item).toString());
    if (context.items.some(value => value.visibility === 'animating-out')) queued = item;
    else start(item);
  }
  onSettled(() => {
    const observer = new MutationObserver(records => {
      if (records.some(record => [...record.removedNodes].some(node => node instanceof HTMLElement && node.hasAttribute('data-viewport')))) setOffset('');
    });
    observer.observe(wrapper, { childList: true });
    return () => {
      observer.disconnect();
      removeAnimationListener?.();
      for (const timer of timers) clearTimeout(timer);
    };
  });
  return <NavigationMenu.Root delayDuration={40} skipDelayDuration={40} value={menuValue()} class={styles.MagicCurtainControlsRoot} style={{ position: 'absolute', 'z-index': 1, left: `${context.position.left}px`, top: `${context.position.top}px` }} onValueChange={value => { setMenuValue(value); if (value) setOffset(value); }}>
    <NavigationMenu.List aria-label="Radix Themes Examples" style={{ display: 'flex', 'list-style': 'none', margin: 0, padding: 0, 'z-index': 1, position: 'relative' }}>{context.items.map((item, index) => <NavigationMenu.Item class={styles.MagicCurtainControlsItem} value={index.toString()} onPointerMove={() => context.setHovered(index.toString())} onPointerLeave={() => deferClear('hovered', index.toString())}>
      <NavigationMenu.Trigger data-visually-hidden="" aria-label={`Example ${index + 1}`} data-visibility={item.visibility} class={styles.MagicCurtainControlsTrigger} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) context.setFocused(index.toString()); }} onBlur={() => deferClear('focused', index.toString())} onClick={() => select(item)} onKeyDown={event => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        let next = context.items[index + (event.key === 'ArrowLeft' ? -1 : 1)];
        if (item.visibility === 'hidden' && !context.items.some(value => value.visibility === 'animating-out')) { event.preventDefault(); next = item; }
        if (next) select(next);
      }} />
      <div style={{ display: 'none' }}>{props.images?.[index] && <NavigationMenu.Content forceMount data-active={String(menuValue() === index.toString())} class={styles.MagicCurtainControlsPreviewContent} onPointerMove={() => context.setHovered(index.toString())} onPointerLeave={() => deferClear('hovered', index.toString())} onClick={() => { setMenuValue(''); context.setHovered(''); select(item); }}><img class={styles.MagicCurtainControlsPreviewContentImage} src={props.images[index]} alt={`Example ${index + 1} preview`} /></NavigationMenu.Content>}</div>
    </NavigationMenu.Item>)}</NavigationMenu.List>
    <div ref={element => { wrapper = element; }} class={styles.MagicCurtainControlsPreviewViewportWrapper} style={{ display: offset() ? undefined : 'none', '--magic-curtain-controls-offset-index': offset() || undefined }}><NavigationMenu.Viewport data-viewport="" class={styles.MagicCurtainControlsPreviewViewport} /></div>
  </NavigationMenu.Root>;
}
export function MirrorControls() {
  const context = useCurtain();
  let node!: HTMLDivElement;
  onSettled(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;
    const position = () => {
      clearTimeout(timer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      timer = setTimeout(() => {
        frame = requestAnimationFrame(() => {
          const rect = node.getBoundingClientRect();
          const next = { left: rect.left + scrollX, top: rect.top + scrollY };
          if (next.left !== context.position.left || next.top !== context.position.top) context.setPosition(next);
        });
      }, 200);
    };
    position();
    addEventListener('resize', position);
    return () => { removeEventListener('resize', position); clearTimeout(timer); if (frame !== undefined) cancelAnimationFrame(frame); };
  });
  return <div ref={element => { node = element; }} class={styles.MagicCurtainControlsRoot} aria-hidden="true">{context.items.map((_, index) => <div class={styles.MagicCurtainControlsItem}><div data-focused={String(context.focused === index.toString())} data-highlighted={String(context.hovered === index.toString() || context.highlighted === index.toString())} class={styles.MagicCurtainControlsTrigger} /></div>)}</div>;
}
