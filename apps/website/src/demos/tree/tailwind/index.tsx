import { createSignal, For } from "solid-js";
import { Tree } from "@wsagency/radix2solid-primitives";
import "./styles.css";

const files = [
  { value: "source-readme", label: "Readme" },
  { value: "source-config", label: "Configuration" },
];

export default function TreeDemo() {
  const [value, setValue] = createSignal<string | null>(null);
  const [expanded, setExpanded] = createSignal<readonly string[]>(["shared"]);
  const [acceptExpansion, setAcceptExpansion] = createSignal(true);
  const [acceptSelection, setAcceptSelection] = createSignal(true);
  const [reversed, setReversed] = createSignal(false);
  const [rtl, setRtl] = createSignal(false);
  const [count, setCount] = createSignal(0);
  const [focused, setFocused] = createSignal("none");
  const activate = (event: Event, key: string) => {
    if (key === "protected") event.preventDefault();
    if (!event.defaultPrevented) setCount(current => current + 1);
  };
  return <div class={"grid w-full max-w-md gap-2.5 text-sm text-gray-900"}>
    <Tree.Root class={"rounded-lg border border-gray-400 p-2"} aria-label="Project explorer" dir={rtl() ? "rtl" : "ltr"}
      value={value()} onValueChange={next => { if (acceptSelection()) setValue(next); }}
      expandedValues={expanded()} onExpandedValuesChange={next => { if (acceptExpansion()) setExpanded(next); }}>
      <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value="source" textValue="Source" hasChildren onFocus={() => setFocused("source")} onActivate={event => activate(event, "source")}>
        <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ExpandTrigger class={"h-7 w-7 cursor-pointer rounded border-0 bg-transparent"} aria-label="Toggle Source">▸</Tree.ExpandTrigger><Tree.ItemText>Source</Tree.ItemText><Tree.ItemIndicator class={"ms-auto"}> •</Tree.ItemIndicator></span>
        <Tree.ItemGroup class={"ps-5"}>
          <For each={reversed() ? [...files].reverse() : files}>{file =>
            <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value={file.value} textValue={file.label} onFocus={event => { event.stopPropagation(); setFocused(file.value); }} onActivate={event => activate(event, file.value)}>
              <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ItemText>{file.label}</Tree.ItemText><Tree.ItemIndicator class={"ms-auto"}> •</Tree.ItemIndicator></span>
            </Tree.Item>}
          </For>
        </Tree.ItemGroup>
      </Tree.Item>
      <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value="docs-readme" textValue="Readme" onFocus={() => setFocused("docs-readme")} onActivate={event => activate(event, "docs-readme")}>
        <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ItemText>Readme</Tree.ItemText><Tree.ItemIndicator class={"ms-auto"}> •</Tree.ItemIndicator></span>
      </Tree.Item>
      <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value="shared" textValue="Shared (disabled parent)" hasChildren disabled>
        <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ItemText>Shared (disabled parent)</Tree.ItemText></span>
        <Tree.ItemGroup class={"ps-5"}>
          <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value="shared-guide" textValue="Enabled guide" onFocus={() => setFocused("shared-guide")} onActivate={event => activate(event, "shared-guide")}>
            <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ItemText>Enabled guide</Tree.ItemText><Tree.ItemIndicator class={"ms-auto"}> •</Tree.ItemIndicator></span>
          </Tree.Item>
        </Tree.ItemGroup>
      </Tree.Item>
      <Tree.Item class={"outline-none [&:focus-visible>.tree-row]:outline [&:focus-visible>.tree-row]:outline-2 [&:focus-visible>.tree-row]:outline-violet-600 [&[aria-selected=true]>.tree-row]:bg-violet-100 [&[aria-selected=true]>.tree-row]:font-bold [&[aria-disabled=true]>.tree-row]:text-gray-500"} value="protected" textValue="Protected action" onFocus={() => setFocused("protected")} onActivate={event => activate(event, "protected")}>
        <span class={"tree-row flex min-h-9 items-center gap-1.5 rounded px-2"}><Tree.ItemText>Protected action</Tree.ItemText></span>
      </Tree.Item>
    </Tree.Root>
    <label><input type="checkbox" checked={acceptExpansion()} onChange={event => setAcceptExpansion(event.currentTarget.checked)} /> Accept expansion proposals</label>
    <label><input type="checkbox" checked={acceptSelection()} onChange={event => setAcceptSelection(event.currentTarget.checked)} /> Accept selection proposals</label>
    <label><input type="checkbox" checked={rtl()} onChange={event => setRtl(event.currentTarget.checked)} /> Right-to-left tree</label>
    <button class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} type="button" onClick={() => setReversed(current => !current)}>Reverse source children</button>
    <button class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} type="button" onClick={() => setExpanded(current => current.filter(key => key !== "source"))}>Collapse source externally</button>
    <output aria-label="Tree focused key">Focused: {focused()}</output>
    <output aria-label="Tree selected key">Selected: {value() ?? "none"}</output>
    <output aria-label="Tree expanded keys">Expanded: {expanded().join(", ") || "none"}</output>
    <output aria-label="Tree activations">Activations: {count()}</output>
  </div>;
}
