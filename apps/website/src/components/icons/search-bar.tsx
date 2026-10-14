import { MagnifyingGlassIcon } from '@wsagency/radix2solid-icons';
import { Flex, Separator } from '@wsagency/radix2solid-themes';
import styles from './search-bar.module.css';

export function SearchBar(props: { value: string; onValueChange: (value: string) => void }) {
  let input: HTMLInputElement | undefined;
  return <>
    <Flex align="center" justify="center" gap="2" onClick={() => { input?.focus(); input?.select(); }}>
      <MagnifyingGlassIcon style={{ color: 'var(--gray-a11)', 'margin-right': 'calc(-1 * var(--space-5))' }} />
      <div class={styles.SearchBarInput}>
        <input ref={node => { input = node; }} aria-label="Search icons" autocomplete="off" placeholder="Search" name="icon-search" value={props.value} onInput={event => props.onValueChange(event.currentTarget.value)} />
      </div>
    </Flex>
    <Separator size="4" />
  </>;
}
