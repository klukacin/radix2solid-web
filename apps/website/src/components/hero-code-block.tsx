import { createMemo, createSignal, createUniqueId, onSettled } from 'solid-js';
import { Button } from '@wsagency/radix2solid-themes';
import { SourceCode } from './source-code.js';

const solutions = { 'css-modules': 'CSS Modules', css: 'CSS', tailwind: 'Tailwind CSS' } as const;
type Solution = keyof typeof solutions;

export function HeroCodeBlock(props: { folder: string; cssLib?: Solution; sources: Record<string, string> }) {
  const name = props.folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const available = Object.entries(solutions).filter(([solution]) => Object.keys(props.sources).some(path => path === `../demos/${name}/${solution === 'css-modules' ? '' : `${solution}/`}index.tsx`));
  const [solution, setSolution] = createSignal<Solution>(props.cssLib ?? 'css-modules');
  const [file, setFile] = createSignal('index.tsx');
  const [ready, setReady] = createSignal(false);
  const [expanded, setExpanded] = createSignal(false);
  const contentId = createUniqueId();
  let content: HTMLDivElement | undefined;
  const files = createMemo(() => {
    const base = `../demos/${name}/${solution() === 'css-modules' ? '' : `${solution()}/`}`;
    const found: Record<string, string> = {};
    for (const [path, source] of Object.entries(props.sources)) {
      if (!path.startsWith(base) || path.slice(base.length).includes('/')) continue;
      found[path.slice(base.length)] = source;
    }
    if (!found['index.tsx']) throw new Error(`Missing native ${name}/${solution()} demo sources.`);
    return found;
  });
  onSettled(() => {
    if (!props.cssLib) {
      try { const saved = localStorage.getItem('radix-solid-css-lib'); if (available.some(([value]) => value === saved)) setSolution(saved as Solution); } catch { /* Storage is optional. */ }
    }
    setReady(true);
  });
  const change = (value: Solution) => {
    setFile('index.tsx'); setSolution(value);
    try { localStorage.setItem('radix-solid-css-lib', value); } catch { /* Storage is optional. */ }
  };
  return <section class="hero-code" aria-label={`${props.folder} demo source`} data-search-exclude>
    <div class="hero-code-controls"><label>Styling solution <select aria-label="Styling solution" disabled={!ready()} value={solution()} onChange={event => change(event.currentTarget.value as Solution)}>{available.map(([value, title]) => <option value={value}>{title}</option>)}</select></label>
      <label>Source file <select aria-label="Source file" disabled={!ready()} value={file()} onChange={event => { setFile(event.currentTarget.value); setExpanded(true); }}>{Object.keys(files()).map(name => <option value={name}>{name}</option>)}</select></label>
      <a href={`/sandboxes/${name}-${solution()}.tar.gz`} download>Download runnable sandbox</a>
    </div><div ref={element => { content = element; }} id={contentId} tabindex="-1" class="hero-code-preview" data-expanded={expanded()}><SourceCode code={files()[file()] ?? files()['index.tsx']} language={file().endsWith('.css') ? 'css' : 'tsx'} /></div>
    <div class="hero-code-collapse"><Button type="button" size="1" color="gray" variant="soft" highContrast aria-controls={contentId} aria-expanded={expanded() ? 'true' : 'false'} onClick={() => { const next = !expanded(); setExpanded(next); if (next) content?.focus(); }}>{expanded() ? 'Collapse code' : 'Expand code'}</Button></div>
  </section>;
}
