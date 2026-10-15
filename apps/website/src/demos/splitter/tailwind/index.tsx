import { createSignal } from "solid-js";
import { Splitter } from "@wsagency/radix2solid-primitives";
import "./styles.css";

export default function SplitterDemo() {
  const [size, setSize] = createSignal(180);
  const [proposal, setProposal] = createSignal<number | null>(null);
  const [committed, setCommitted] = createSignal<number | null>(null);
  const [commits, setCommits] = createSignal(0);
  const [acceptResize, setAcceptResize] = createSignal(true);
  const [acceptCollapse, setAcceptCollapse] = createSignal(true);
  const [collapsed, setCollapsed] = createSignal(false);
  const [rtl, setRtl] = createSignal(false);
  return <div class={"grid w-full max-w-3xl gap-2.5 text-sm text-gray-900"}>
    <Splitter.Root class={"h-80 w-full rounded-lg border border-gray-400"} unit="px" size={size()} dir={rtl() ? "rtl" : "ltr"}
      onSizeChange={next => { setProposal(next); if (acceptResize()) setSize(next); }}
      onSizeCommit={next => { setCommitted(next); setCommits(current => current + 1); }}
      collapsed={collapsed()} onCollapsedChange={next => { if (acceptCollapse()) setCollapsed(next); }}>
      <Splitter.Panel class={"box-border overflow-auto bg-gray-50 [&>p]:m-3 [&>button]:m-3"} side="primary" minSize={100} maxSize={320} collapsible collapsedSize={0} aria-label="Workspace sidebar panel">
        <p>Sidebar · pixels</p>
        <button class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} type="button">Sidebar action</button>
      </Splitter.Panel>
      <Splitter.Handle class={"relative w-6 min-w-6 shrink-0 cursor-col-resize touch-none bg-gray-200 after:absolute after:inset-2.5 after:rounded after:bg-gray-500 after:content-[''] aria-[orientation=horizontal]:h-6 aria-[orientation=horizontal]:min-h-6 aria-[orientation=horizontal]:w-auto aria-[orientation=horizontal]:min-w-0 aria-[orientation=horizontal]:cursor-row-resize focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600 aria-disabled:cursor-default aria-disabled:opacity-50 forced-colors:border forced-colors:border-[ButtonText] forced-colors:after:bg-[ButtonText]"} aria-label="Workspace sidebar" />
      <Splitter.Panel class={"box-border overflow-auto bg-gray-50 [&>p]:m-3 [&>button]:m-3"} side="secondary" minSize={120}>
        <Splitter.Root class={"h-full min-h-0 w-full"} orientation="vertical" unit="%" defaultSize={55}>
          <Splitter.Panel class={"box-border overflow-auto bg-gray-50 [&>p]:m-3 [&>button]:m-3"} side="primary" minSize={20}>
            <p>Editor · percent</p><textarea class={"mx-3 mb-3 box-border min-h-12 w-[calc(100%-24px)] resize-none border border-gray-400 bg-white"} aria-label="Editor notes" defaultValue="Resize either divider. Text remains mounted when the sidebar collapses." />
          </Splitter.Panel>
          <Splitter.Handle class={"relative w-6 min-w-6 shrink-0 cursor-col-resize touch-none bg-gray-200 after:absolute after:inset-2.5 after:rounded after:bg-gray-500 after:content-[''] aria-[orientation=horizontal]:h-6 aria-[orientation=horizontal]:min-h-6 aria-[orientation=horizontal]:w-auto aria-[orientation=horizontal]:min-w-0 aria-[orientation=horizontal]:cursor-row-resize focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600 aria-disabled:cursor-default aria-disabled:opacity-50 forced-colors:border forced-colors:border-[ButtonText] forced-colors:after:bg-[ButtonText]"} aria-label="Editor height" />
          <Splitter.Panel class={"box-border overflow-auto bg-gray-50 [&>p]:m-3 [&>button]:m-3"} side="secondary" minSize={20}><p>Preview</p></Splitter.Panel>
        </Splitter.Root>
      </Splitter.Panel>
    </Splitter.Root>
    <label><input type="checkbox" checked={acceptResize()} onChange={event => setAcceptResize(event.currentTarget.checked)} /> Accept resize proposals</label>
    <label><input type="checkbox" checked={acceptCollapse()} onChange={event => setAcceptCollapse(event.currentTarget.checked)} /> Accept collapse proposals</label>
    <label><input type="checkbox" checked={rtl()} onChange={event => setRtl(event.currentTarget.checked)} /> Right-to-left layout</label>
    <button class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} type="button" onClick={() => setCollapsed(current => !current)}>Toggle sidebar externally</button>
    <output aria-label="Splitter proposed size">Proposed: {proposal() === null ? "none" : `${proposal()}px`}</output>
    <output aria-label="Splitter accepted size">Accepted request: {size()}px</output>
    <output aria-label="Splitter committed size">Last accepted commit: {committed() === null ? "none" : `${committed()}px`}</output>
    <output aria-label="Splitter commit count">Commits: {commits()}</output>
    <output aria-label="Splitter collapsed state">Collapsed: {String(collapsed())}</output>
  </div>;
}
