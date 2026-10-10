import { createSignal, onSettled, omit, type ComponentProps } from 'solid-js';
import { TabNav } from '@radix-solid/themes';

type Props = ComponentProps<typeof TabNav.Root> & { items?: string[] };
export function TabNavDemo(props: Props) {
  const [query, setQuery] = createSignal('');
  onSettled(() => { setQuery(location.search); });
  const items = () => props.items ?? ['Account', 'Documents'];
  const selected = () => new URLSearchParams(query()).get('tab-nav') ?? items()[0]!.toLowerCase();
  const href = (item: string) => {
    const params = new URLSearchParams(query());
    params.set('tab-nav', item.toLowerCase());
    return `?${params}`;
  };
  return <TabNav.Root {...omit(props, 'items')}>{items().map(item => <TabNav.Link href={href(item)} active={selected() === item.toLowerCase()}>{item}</TabNav.Link>)}</TabNav.Root>;
}
