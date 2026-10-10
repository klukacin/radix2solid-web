import { createContext, createSignal, onCleanup, onSettled, omit, useContext, type Element } from 'solid-js';
import { dynamic, type JSX, type ValidComponent } from '@solidjs/web';
import { composeRefs } from '@radix-solid/primitives/internal';

interface CarouselContextValue {
  list?: HTMLDivElement;
  nextDisabled: boolean;
  prevDisabled: boolean;
  navigate(direction: 1 | -1): void;
}
const CarouselContext = createContext<CarouselContextValue>();
function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error('Carousel parts require Carousel.');
  return context;
}
export function Carousel(props: { children: Element }) {
  const [nextDisabled, setNextDisabled] = createSignal(false);
  const [prevDisabled, setPrevDisabled] = createSignal(true);
  let timer: number | undefined;
  let navigationUpdateDelay = 100;
  const updateNavigation = () => {
    const list = context.list;
    if (!list) return;
    setPrevDisabled(list.scrollLeft <= 0);
    setNextDisabled(list.scrollWidth - list.scrollLeft - list.clientWidth <= 1);
    navigationUpdateDelay = 100;
  };
  const scheduleUpdate = () => {
    clearTimeout(timer);
    timer = window.setTimeout(updateNavigation, navigationUpdateDelay);
  };
  const context: CarouselContextValue = {
    get nextDisabled() { return nextDisabled(); },
    get prevDisabled() { return prevDisabled(); },
    navigate(direction) {
      const list = context.list;
      if (!list) return;
      const slides = [...list.querySelectorAll<HTMLElement>('[data-slide-intersection-ratio]')];
      if (direction === 1) slides.reverse();
      const slide = slides.find(node => Number(node.dataset.slideIntersectionRatio) > 0);
      if (!slide) return;
      const width = slide.clientWidth;
      const count = width * 2.5 < document.documentElement.offsetWidth ? 2 : 1;
      const start = direction === 1 ? Math.floor(list.scrollLeft / width) : Math.ceil(list.scrollLeft / width);
      const position = (start + direction * count) * width;
      list.scrollTo({ left: position, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      setPrevDisabled(position <= 0);
      setNextDisabled(list.scrollWidth - position - list.clientWidth <= 1);
      navigationUpdateDelay = 500;
      scheduleUpdate();
    },
  };
  onSettled(() => {
    const list = context.list;
    if (!list) return;
    updateNavigation();
    list.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    onCleanup(() => {
      clearTimeout(timer);
      list.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    });
  });
  return <CarouselContext value={context}><div>{props.children}</div></CarouselContext>;
}
export function CarouselSlideList(props: JSX.IntrinsicElements['div']) {
  const context = useCarousel();
  const [dragging, setDragging] = createSignal(false);
  let list: HTMLDivElement | undefined;
  let start: { x: number; scroll: number } | undefined;
  let dragged = false;
  const move = (event: MouseEvent) => {
    if (!start || !list) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) > 4) { dragged = true; setDragging(true); }
    if (dragged) list.scrollLeft = start.scroll - distance;
  };
  const stop = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
    start = undefined;
    setDragging(false);
  };
  onSettled(() => {
    const element = list;
    if (!element) return;
    const begin = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.target instanceof HTMLInputElement) return;
      dragged = false;
      start = { x: event.clientX, scroll: element.scrollLeft };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stop);
    };
    const suppressDraggedClick = (event: MouseEvent) => {
      if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; }
    };
    element.addEventListener('mousedown', begin, true);
    element.addEventListener('click', suppressDraggedClick, true);
    onCleanup(() => {
      stop();
      element.removeEventListener('mousedown', begin, true);
      element.removeEventListener('click', suppressDraggedClick, true);
    });
  });
  return <div {...omit(props, 'ref')} ref={composeRefs(props.ref, element => { list = element; context.list = element; })}
    data-state={dragging() ? 'dragging' : undefined} />;
}
export function CarouselSlide(props: JSX.IntrinsicElements['div']) {
  const context = useCarousel();
  const [ratio, setRatio] = createSignal(0);
  let slide: HTMLDivElement | undefined;
  onSettled(() => {
    const observer = new IntersectionObserver(([entry]) => setRatio(entry.intersectionRatio), { root: context.list, threshold: [0, 0.5, 1] });
    if (slide) observer.observe(slide);
    onCleanup(() => observer.disconnect());
  });
  return <div {...omit(props, 'ref')} ref={composeRefs(props.ref, element => { slide = element; })} data-slide-intersection-ratio={String(ratio())} />;
}
type ArrowProps = JSX.IntrinsicElements['button'] & { as?: ValidComponent };
export function CarouselNext(props: ArrowProps) {
  const context = useCarousel();
  const Button = dynamic(() => props.as ?? 'button');
  return <Button {...omit(props, 'as')} onClick={() => context.navigate(1)} disabled={context.nextDisabled} />;
}
export function CarouselPrevious(props: ArrowProps) {
  const context = useCarousel();
  const Button = dynamic(() => props.as ?? 'button');
  return <Button {...omit(props, 'as')} onClick={() => context.navigate(-1)} disabled={context.prevDisabled} />;
}
