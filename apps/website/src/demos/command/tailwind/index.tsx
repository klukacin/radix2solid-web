import { createSignal } from "solid-js";
import { Command, Dialog } from "@wsagency/radix2solid-primitives";
import "./styles.css";

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
  return <div class={"grid w-full max-w-md gap-3 text-sm text-gray-900"}>
    <form onSubmit={event => { event.preventDefault(); setSubmissions(current => current + 1); }}>
      <Command.Root search={inlineSearch()} onSearchChange={setInlineSearch}>
        <Command.Input class={"box-border w-full rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} aria-label="Inline actions" placeholder="Search actions" />
        <Command.List class={"max-h-60 overflow-auto p-1.5"} aria-label="Inline action results">
          <Command.Group>
            <Command.Label class={"px-3 py-1.5 text-gray-600"}>Actions</Command.Label>
            {actions.filter(action => action.label.toLowerCase().includes(inlineSearch().trim().toLowerCase())).map(action =>
              <Command.Item class={"cursor-default rounded px-3 py-2 aria-selected:bg-violet-100 aria-selected:outline aria-selected:outline-1 aria-selected:outline-violet-600 data-[disabled]:opacity-50"} value={action.value} textValue={action.label} disabled={action.disabled}
                onSelect={event => select(event, action.value, false)}>{action.label}</Command.Item>)}
          </Command.Group>
          <Command.Empty class={"px-3 py-1.5 text-gray-600"}>No matching actions.</Command.Empty>
        </Command.List>
      </Command.Root>
    </form>
    <Dialog.Root open={open()} onOpenChange={next => {
      if (next) { setSearch(""); transferFocus = false; }
      if (next || acceptClose()) setOpen(next);
    }}>
      <Dialog.Trigger asChild>{target => target("button", { type: "button", class: "rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600", children: "Open command palette" })}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class={"fixed inset-0 z-[60] bg-black/50"} />
        <Dialog.Content class={"fixed left-1/2 top-1/2 z-[61] max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"}
          onOpenAutoFocus={event => { event.preventDefault(); input.focus(); }}
          onCloseAutoFocus={event => { if (transferFocus) event.preventDefault(); }}>
          <Dialog.Title>Command palette</Dialog.Title>
          <Dialog.Description>Search actions. Protected action cancels before any side effect.</Dialog.Description>
          <Command.Root search={search()} onSearchChange={setSearch}>
            <Command.Input ref={input} class={"box-border w-full rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"} aria-label="Palette actions" placeholder="Search actions" />
            <Command.List class={"max-h-60 overflow-auto p-1.5"} aria-label="Palette action results">
              {actions.filter(action => action.label.toLowerCase().includes(search().trim().toLowerCase())).map(action =>
                <Command.Item class={"cursor-default rounded px-3 py-2 aria-selected:bg-violet-100 aria-selected:outline aria-selected:outline-1 aria-selected:outline-violet-600 data-[disabled]:opacity-50"} value={action.value} textValue={action.label} disabled={action.disabled}
                  onSelect={event => select(event, action.value, true)}>{action.label}</Command.Item>)}
              <Command.Empty class={"px-3 py-1.5 text-gray-600"}>No matching actions.</Command.Empty>
            </Command.List>
          </Command.Root>
          <Dialog.Close class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"}>Close palette</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <Dialog.Root open={details()} onOpenChange={setDetails}>
      <Dialog.Portal>
        <Dialog.Overlay class={"fixed inset-0 z-[60] bg-black/50"} />
        <Dialog.Content class={"fixed left-1/2 top-1/2 z-[61] max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl"} onOpenAutoFocus={event => { event.preventDefault(); closeDetails.focus(); }}>
          <Dialog.Title>Action details</Dialog.Title>
          <Dialog.Description>The action opened another modal without the palette stealing focus back.</Dialog.Description>
          <Dialog.Close ref={closeDetails} class={"rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"}>Close action details</Dialog.Close>
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
