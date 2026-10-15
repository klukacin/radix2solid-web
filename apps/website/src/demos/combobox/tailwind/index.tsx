import { createSignal } from "solid-js";
import { Combobox } from "@wsagency/radix2solid-primitives";
import "./styles.css";

const destinations = [
  { value: "paris", label: "Paris" },
  { value: "prague", label: "Prague" },
  { value: "porto", label: "Porto", disabled: true },
];

export default function ComboboxDemo() {
  const [value, setValue] = createSignal<string | null>(null);
  const [query, setQuery] = createSignal("");
  const [accept, setAccept] = createSignal(true);
  const [keepParis, setKeepParis] = createSignal(true);
  const [preventReset, setPreventReset] = createSignal(false);
  const [submitted, setSubmitted] = createSignal("Not submitted");
  const [submissions, setSubmissions] = createSignal(0);
  let form!: HTMLFormElement;
  return <form ref={form} class="grid gap-3 w-full max-w-md text-sm text-gray-900" aria-label="Destination booking"
    onReset={event => { if (preventReset()) event.preventDefault(); }}
    onSubmit={event => {
      event.preventDefault();
      setSubmitted(String(new FormData(event.currentTarget).get("destination") ?? "No successful field"));
      setSubmissions(count => count + 1);
    }}>
    <Combobox.Root items={destinations.filter(item => keepParis() || item.value !== "paris")}
      value={value()} onValueChange={next => { if (accept()) setValue(next); }}
      query={query()} onQueryChange={setQuery} name="destination" required>
      <div class="flex flex-wrap gap-2">
        <Combobox.Input class="min-w-0 flex-1 rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 aria-[invalid=true]:border-red-600" aria-label="Destination" placeholder="Choose a destination" />
        <Combobox.Trigger class="rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" aria-label="Show destinations">Show</Combobox.Trigger>
        <Combobox.Clear class="rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" aria-label="Clear destination">Clear</Combobox.Clear>
      </div>
      <Combobox.Portal>
        <Combobox.Content class="z-50 min-w-60 max-h-64 overflow-auto rounded-lg border border-gray-400 bg-white p-1.5 text-gray-900 shadow-xl" sideOffset={5}>
          <Combobox.List aria-label="Destinations">
            <Combobox.Group>
              <Combobox.Label class="px-3 py-1.5 text-gray-600">Europe</Combobox.Label>
              {destinations.filter(item => keepParis() || item.value !== "paris").map(item =>
                <Combobox.Item class="cursor-default rounded px-3 py-2 aria-selected:bg-violet-100 aria-selected:outline aria-selected:outline-1 aria-selected:outline-violet-600 data-[disabled]:opacity-50 data-[state=checked]:font-bold" value={item.value}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator> ✓</Combobox.ItemIndicator>
                </Combobox.Item>)}
            </Combobox.Group>
            <Combobox.Empty class="px-3 py-1.5 text-gray-600">No destinations match.</Combobox.Empty>
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
    <div class="flex flex-wrap gap-2">
      <button class="rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" type="submit">Book destination</button>
      <button class="rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" type="button" onClick={() => form.requestSubmit()}>Request booking</button>
      <button class="rounded border border-gray-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" type="reset">Reset destination</button>
    </div>
    <label><input type="checkbox" checked={accept()} onChange={event => setAccept(event.currentTarget.checked)} /> Accept value proposals</label>
    <label><input type="checkbox" checked={keepParis()} onChange={event => setKeepParis(event.currentTarget.checked)} /> Keep Paris in data</label>
    <label><input type="checkbox" checked={preventReset()} onChange={event => setPreventReset(event.currentTarget.checked)} /> Prevent reset</label>
    <div role="status" aria-label="Accepted destination">Key: {value() ?? "none"}</div>
    <div role="status" aria-label="Destination query">Query: {query() || "empty"}</div>
    <div role="status" aria-label="Submitted destination">Submitted: {submitted()}; count: {submissions()}</div>
  </form>;
}
