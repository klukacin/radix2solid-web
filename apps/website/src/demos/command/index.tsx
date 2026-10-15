import { createSignal } from "solid-js";
import { Command, Dialog } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";

const actions = [
  { value: "note", label: "Create note" },
  { value: "protected", label: "Protected action" },
  { value: "details", label: "Open details" },
  { value: "unavailable", label: "Unavailable action", disabled: true },
];

export default function CommandDemo() {
  const [inlineSearch, setInlineSearch] = createSignal("");
  const [search, setSearch] = createSignal("");
  const [open, setOpen] = createSignal(false);
  const [details, setDetails] = createSignal(false);
  const [acceptClose, setAcceptClose] = createSignal(true);
  const [count, setCount] = createSignal(0);
  const [submissions, setSubmissions] = createSignal(0);
  const [lastAction, setLastAction] = createSignal("none");
  let input!: HTMLInputElement;
  let closeDetails!: HTMLButtonElement;
  let transferFocus = false;
  const select = (event: Event, value: string, inPalette: boolean) => {
    if (value === "protected") event.preventDefault();
    if (event.defaultPrevented) return;
    if (inPalette && acceptClose()) setOpen(false);
    setCount(current => current + 1);
    setLastAction(value);
    if (value === "details") {
      transferFocus = inPalette;
      setDetails(true);
    }
  };
  return <div class={styles.Demo}>
    <form onSubmit={event => { event.preventDefault(); setSubmissions(current => current + 1); }}>
      <Command.Root search={inlineSearch()} onSearchChange={setInlineSearch}>
        <Command.Input class={styles.Input} aria-label="Inline actions" placeholder="Search actions" />
        <Command.List class={styles.List} aria-label="Inline action results">
          <Command.Group>
            <Command.Label class={styles.Label}>Actions</Command.Label>
            {actions.filter(action => action.label.toLowerCase().includes(inlineSearch().trim().toLowerCase())).map(action =>
              <Command.Item class={styles.Item} value={action.value} textValue={action.label} disabled={action.disabled}
                onSelect={event => select(event, action.value, false)}>{action.label}</Command.Item>)}
          </Command.Group>
          <Command.Empty class={styles.Label}>No matching actions.</Command.Empty>
        </Command.List>
      </Command.Root>
    </form>
    <Dialog.Root open={open()} onOpenChange={next => {
      if (next) { setSearch(""); transferFocus = false; }
      if (next || acceptClose()) setOpen(next);
    }}>
      <Dialog.Trigger asChild>{target => target("button", { type: "button", class: styles.Button, children: "Open command palette" })}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={styles.Overlay} />
        <Dialog.Content class={styles.Content}
          onOpenAutoFocus={event => { event.preventDefault(); input.focus(); }}
          onCloseAutoFocus={event => { if (transferFocus) event.preventDefault(); }}>
          <Dialog.Title>Command palette</Dialog.Title>
          <Dialog.Description>Search actions. Protected action cancels before any side effect.</Dialog.Description>
          <Command.Root search={search()} onSearchChange={setSearch}>
            <Command.Input ref={input} class={styles.Input} aria-label="Palette actions" placeholder="Search actions" />
            <Command.List class={styles.List} aria-label="Palette action results">
              {actions.filter(action => action.label.toLowerCase().includes(search().trim().toLowerCase())).map(action =>
                <Command.Item class={styles.Item} value={action.value} textValue={action.label} disabled={action.disabled}
                  onSelect={event => select(event, action.value, true)}>{action.label}</Command.Item>)}
              <Command.Empty class={styles.Label}>No matching actions.</Command.Empty>
            </Command.List>
          </Command.Root>
          <Dialog.Close class={styles.Button}>Close palette</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <Dialog.Root open={details()} onOpenChange={setDetails}>
      <Dialog.Portal>
        <Dialog.Overlay class={styles.Overlay} />
        <Dialog.Content class={styles.Content} onOpenAutoFocus={event => { event.preventDefault(); closeDetails.focus(); }}>
          <Dialog.Title>Action details</Dialog.Title>
          <Dialog.Description>The action opened another modal without the palette stealing focus back.</Dialog.Description>
          <Dialog.Close ref={closeDetails} class={styles.Button}>Close action details</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <label><input type="checkbox" checked={acceptClose()} onChange={event => setAcceptClose(event.currentTarget.checked)} /> Accept palette close proposals</label>
    <output aria-label="Command action count">Actions: {count()}</output>
    <output aria-label="Command last action">Last action: {lastAction()}</output>
    <output aria-label="Command search">Inline query: {inlineSearch() || "empty"}; palette query: {search() || "empty"}</output>
    <output aria-label="Command form submissions">Form submissions: {submissions()}</output>
  </div>;
}
