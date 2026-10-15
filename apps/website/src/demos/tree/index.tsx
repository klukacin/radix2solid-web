import { createSignal, For } from "solid-js";
import { Tree } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";

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
  return <div class={styles.Demo}>
    <Tree.Root class={styles.Tree} aria-label="Project explorer" dir={rtl() ? "rtl" : "ltr"}
      value={value()} onValueChange={next => { if (acceptSelection()) setValue(next); }}
      expandedValues={expanded()} onExpandedValuesChange={next => { if (acceptExpansion()) setExpanded(next); }}>
      <Tree.Item class={styles.Item} value="source" textValue="Source" hasChildren onFocus={() => setFocused("source")} onActivate={event => activate(event, "source")}>
        <span class={styles.Row}><Tree.ExpandTrigger class={styles.Toggle} aria-label="Toggle Source">▸</Tree.ExpandTrigger><Tree.ItemText>Source</Tree.ItemText><Tree.ItemIndicator class={styles.Indicator}> •</Tree.ItemIndicator></span>
        <Tree.ItemGroup class={styles.Group}>
          <For each={reversed() ? [...files].reverse() : files}>{file =>
            <Tree.Item class={styles.Item} value={file.value} textValue={file.label} onFocus={event => { event.stopPropagation(); setFocused(file.value); }} onActivate={event => activate(event, file.value)}>
              <span class={styles.Row}><Tree.ItemText>{file.label}</Tree.ItemText><Tree.ItemIndicator class={styles.Indicator}> •</Tree.ItemIndicator></span>
            </Tree.Item>}
          </For>
        </Tree.ItemGroup>
      </Tree.Item>
      <Tree.Item class={styles.Item} value="docs-readme" textValue="Readme" onFocus={() => setFocused("docs-readme")} onActivate={event => activate(event, "docs-readme")}>
        <span class={styles.Row}><Tree.ItemText>Readme</Tree.ItemText><Tree.ItemIndicator class={styles.Indicator}> •</Tree.ItemIndicator></span>
      </Tree.Item>
      <Tree.Item class={styles.Item} value="shared" textValue="Shared (disabled parent)" hasChildren disabled>
        <span class={styles.Row}><Tree.ItemText>Shared (disabled parent)</Tree.ItemText></span>
        <Tree.ItemGroup class={styles.Group}>
          <Tree.Item class={styles.Item} value="shared-guide" textValue="Enabled guide" onFocus={() => setFocused("shared-guide")} onActivate={event => activate(event, "shared-guide")}>
            <span class={styles.Row}><Tree.ItemText>Enabled guide</Tree.ItemText><Tree.ItemIndicator class={styles.Indicator}> •</Tree.ItemIndicator></span>
          </Tree.Item>
        </Tree.ItemGroup>
      </Tree.Item>
      <Tree.Item class={styles.Item} value="protected" textValue="Protected action" onFocus={() => setFocused("protected")} onActivate={event => activate(event, "protected")}>
        <span class={styles.Row}><Tree.ItemText>Protected action</Tree.ItemText></span>
      </Tree.Item>
    </Tree.Root>
    <label><input type="checkbox" checked={acceptExpansion()} onChange={event => setAcceptExpansion(event.currentTarget.checked)} /> Accept expansion proposals</label>
    <label><input type="checkbox" checked={acceptSelection()} onChange={event => setAcceptSelection(event.currentTarget.checked)} /> Accept selection proposals</label>
    <label><input type="checkbox" checked={rtl()} onChange={event => setRtl(event.currentTarget.checked)} /> Right-to-left tree</label>
    <button class={styles.Button} type="button" onClick={() => setReversed(current => !current)}>Reverse source children</button>
    <button class={styles.Button} type="button" onClick={() => setExpanded(current => current.filter(key => key !== "source"))}>Collapse source externally</button>
    <output aria-label="Tree focused key">Focused: {focused()}</output>
    <output aria-label="Tree selected key">Selected: {value() ?? "none"}</output>
    <output aria-label="Tree expanded keys">Expanded: {expanded().join(", ") || "none"}</output>
    <output aria-label="Tree activations">Activations: {count()}</output>
  </div>;
}
