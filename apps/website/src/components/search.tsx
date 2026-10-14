import { createContext, createSignal, createUniqueId, onCleanup, onSettled, useContext, type Element } from 'solid-js';
import MiniSearch from 'minisearch';
import { Button, Dialog } from '@wsagency/radix2solid-themes';
import type { SearchRecord } from '../../scripts/build-search-index.js';

let indexPromise: Promise<{ index: MiniSearch<SearchRecord>; records: Map<string, SearchRecord> }> | undefined;
function loadIndex() {
  return indexPromise ??= fetch('/search-index.json').then(async response => {
    if (!response.ok) throw new Error(`Failed to load search index (${response.status})`);
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(record => record && typeof record.objectID === 'string' && typeof record.url === 'string' && record.url.startsWith('/') && !record.url.startsWith('//') && record.hierarchy && Object.values(record.hierarchy).every(value => value === null || typeof value === 'string') && (record.content === null || typeof record.content === 'string'))) throw new Error('Invalid search index.');
    const records = new Map<string, SearchRecord>(data.map(record => [record.objectID, record]));
    const index = new MiniSearch<SearchRecord>({ idField: 'objectID', fields: ['lvl1', 'lvl2', 'lvl3', 'lvl4', 'content'],
      extractField: (record, field) => field === 'objectID' ? record.objectID : field === 'content' ? record.content ?? '' : record.hierarchy[field as keyof SearchRecord['hierarchy']] ?? '',
      searchOptions: { prefix: true, fuzzy: 0.2, combineWith: 'AND', boost: { lvl1: 8, lvl2: 6, lvl3: 4, lvl4: 3, content: 1 } }
    });
    index.addAll(data);
    return { index, records };
  }).catch(error => { indexPromise = undefined; throw error; });
}
const SearchContext = createContext<(() => void) | null>(null);

export function SearchTrigger() {
  const show = useContext(SearchContext);
  if (!show) throw new Error('SearchTrigger requires the website search root.');
  return <Button class="site-search-trigger" color="gray" variant="soft" onClick={show}>Search documentation</Button>;
}

export function Search(props: { children: Element }) {
  const [open, setOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const [results, setResults] = createSignal<SearchRecord[]>([]);
  const [selected, setSelected] = createSignal(-1);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const id = createUniqueId();
  let revision = 0;
  let input: HTMLInputElement | undefined;
  let previousFocus: HTMLElement | undefined;
  const show = () => {
    if (!open()) previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    setOpen(true);
    input?.focus();
  };
  onCleanup(() => { revision++; });
  onSettled(() => {
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const editable = target instanceof HTMLElement && (target.isContentEditable || !!target.closest('input, textarea, select'));
      if ((event.key === '/' && !editable && !event.ctrlKey && !event.metaKey && !event.altKey) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))) {
        event.preventDefault();
        show();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  });
  const search = async (value: string) => {
    const current = ++revision;
    setQuery(value); setError(''); setSelected(-1);
    if (!value.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const { index, records } = await loadIndex();
      if (current !== revision) return;
      const urls = new Set<string>();
      const found: SearchRecord[] = [];
      for (const hit of index.search(value)) {
        const record = records.get(String(hit.id));
        if (record && !urls.has(record.url)) { urls.add(record.url); found.push(record); }
        if (found.length === 12) break;
      }
      setResults(found);
      setSelected(found.length ? 0 : -1);
    } catch (reason) {
      if (current === revision) { setResults([]); setError(reason instanceof Error ? reason.message : 'Search is unavailable.'); }
    } finally { if (current === revision) setLoading(false); }
  };
  const navigate = (record: SearchRecord) => { setOpen(false); window.location.assign(record.url); };
  const keydown = (event: KeyboardEvent) => {
    const count = results().length;
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && count) {
      event.preventDefault();
      const next = event.key === 'ArrowDown' ? (selected() + 1) % count : (selected() <= 0 ? count - 1 : selected() - 1);
      setSelected(next); document.getElementById(`${id}-${next}`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && selected() >= 0 && results()[selected()]) { event.preventDefault(); navigate(results()[selected()]); }
  };
  return <Dialog.Root open={open()} onOpenChange={setOpen}><SearchContext value={show}>
    {props.children}
    <Dialog.Content class="site-modal" maxWidth="640px" onOpenAutoFocus={event => { event.preventDefault(); input?.focus(); }} onCloseAutoFocus={event => { if (previousFocus?.isConnected) { event.preventDefault(); previousFocus.focus(); } }}>
      <Dialog.Title>Search documentation</Dialog.Title><Dialog.Description class="sr-only">Search all documentation. Use arrow keys to select a result and Enter to open it.</Dialog.Description>
      <input ref={node => { input = node; }} aria-label="Search documentation" type="search" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={id} aria-activedescendant={selected() >= 0 ? `${id}-${selected()}` : undefined} value={query()} onInput={event => { void search(event.currentTarget.value); }} onKeyDown={keydown} />
      <div role="status" aria-live="polite">{loading() ? 'Loading search…' : query().trim() && !error() ? `${results().length} results` : 'Type to search documentation'}</div>
      {error() && <div role="alert">{error()} <button type="button" onClick={() => { void search(query()); }}>Retry</button></div>}
      <ul role="listbox" id={id} aria-label="Search results">{results().map((record, index) => <li role="option" id={`${id}-${index}`} aria-selected={selected() === index ? 'true' : 'false'} onMouseMove={() => { setSelected(index); }}>
        <a href={record.url} tabindex="-1" onClick={event => { event.preventDefault(); navigate(record); }}><strong>{Object.values(record.hierarchy).filter(Boolean).slice(1).join(' › ')}</strong>{record.content && <p>{record.content.slice(0, 220)}</p>}</a>
      </li>)}</ul><Dialog.Close>{target => target(Button, { color: 'gray', variant: 'soft', 'aria-label': 'Close search', children: 'Close' })}</Dialog.Close>
    </Dialog.Content>
  </SearchContext></Dialog.Root>;
}
