import { createSignal } from "solid-js";
import { Splitter } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";

export default function SplitterDemo() {
  const [size, setSize] = createSignal(180);
  const [proposal, setProposal] = createSignal<number | null>(null);
  const [committed, setCommitted] = createSignal<number | null>(null);
  const [commits, setCommits] = createSignal(0);
  const [acceptResize, setAcceptResize] = createSignal(true);
  const [acceptCollapse, setAcceptCollapse] = createSignal(true);
  const [collapsed, setCollapsed] = createSignal(false);
  const [rtl, setRtl] = createSignal(false);
  return <div class={styles.Demo}>
    <Splitter.Root class={styles.Root} unit="px" size={size()} dir={rtl() ? "rtl" : "ltr"}
      onSizeChange={next => { setProposal(next); if (acceptResize()) setSize(next); }}
      onSizeCommit={next => { setCommitted(next); setCommits(current => current + 1); }}
      collapsed={collapsed()} onCollapsedChange={next => { if (acceptCollapse()) setCollapsed(next); }}>
      <Splitter.Panel class={styles.Panel} side="primary" minSize={100} maxSize={320} collapsible collapsedSize={0} aria-label="Workspace sidebar panel">
        <p>Sidebar · pixels</p>
        <button class={styles.Button} type="button">Sidebar action</button>
      </Splitter.Panel>
      <Splitter.Handle class={styles.Handle} aria-label="Workspace sidebar" />
      <Splitter.Panel class={styles.Panel} side="secondary" minSize={120}>
        <Splitter.Root class={styles.Nested} orientation="vertical" unit="%" defaultSize={55}>
          <Splitter.Panel class={styles.Panel} side="primary" minSize={20}>
            <p>Editor · percent</p><textarea class={styles.Editor} aria-label="Editor notes" defaultValue="Resize either divider. Text remains mounted when the sidebar collapses." />
          </Splitter.Panel>
          <Splitter.Handle class={styles.Handle} aria-label="Editor height" />
          <Splitter.Panel class={styles.Panel} side="secondary" minSize={20}><p>Preview</p></Splitter.Panel>
        </Splitter.Root>
      </Splitter.Panel>
    </Splitter.Root>
    <label><input type="checkbox" checked={acceptResize()} onChange={event => setAcceptResize(event.currentTarget.checked)} /> Accept resize proposals</label>
    <label><input type="checkbox" checked={acceptCollapse()} onChange={event => setAcceptCollapse(event.currentTarget.checked)} /> Accept collapse proposals</label>
    <label><input type="checkbox" checked={rtl()} onChange={event => setRtl(event.currentTarget.checked)} /> Right-to-left layout</label>
    <button class={styles.Button} type="button" onClick={() => setCollapsed(current => !current)}>Toggle sidebar externally</button>
    <output aria-label="Splitter proposed size">Proposed: {proposal() === null ? "none" : `${proposal()}px`}</output>
    <output aria-label="Splitter accepted size">Accepted request: {size()}px</output>
    <output aria-label="Splitter committed size">Last accepted commit: {committed() === null ? "none" : `${committed()}px`}</output>
    <output aria-label="Splitter commit count">Commits: {commits()}</output>
    <output aria-label="Splitter collapsed state">Collapsed: {String(collapsed())}</output>
  </div>;
}
