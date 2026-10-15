import { createSignal } from "solid-js";
import { Combobox } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";

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
  return <form ref={form} class={styles.Demo} aria-label="Destination booking"
    onReset={event => { if (preventReset()) event.preventDefault(); }}
    onSubmit={event => {
      event.preventDefault();
      setSubmitted(String(new FormData(event.currentTarget).get("destination") ?? "No successful field"));
      setSubmissions(count => count + 1);
    }}>
    <Combobox.Root items={destinations.filter(item => keepParis() || item.value !== "paris")}
      value={value()} onValueChange={next => { if (accept()) setValue(next); }}
      query={query()} onQueryChange={setQuery} name="destination" required>
      <div class={styles.Controls}>
        <Combobox.Input class={styles.Input} aria-label="Destination" placeholder="Choose a destination" />
        <Combobox.Trigger class={styles.Button} aria-label="Show destinations">Show</Combobox.Trigger>
        <Combobox.Clear class={styles.Button} aria-label="Clear destination">Clear</Combobox.Clear>
      </div>
      <Combobox.Portal>
        <Combobox.Content class={styles.Content} sideOffset={5}>
          <Combobox.List aria-label="Destinations">
            <Combobox.Group>
              <Combobox.Label class={styles.Label}>Europe</Combobox.Label>
              {destinations.filter(item => keepParis() || item.value !== "paris").map(item =>
                <Combobox.Item class={styles.Item} value={item.value}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator> ✓</Combobox.ItemIndicator>
                </Combobox.Item>)}
            </Combobox.Group>
            <Combobox.Empty class={styles.Label}>No destinations match.</Combobox.Empty>
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
    <div class={styles.Controls}>
      <button class={styles.Button} type="submit">Book destination</button>
      <button class={styles.Button} type="button" onClick={() => form.requestSubmit()}>Request booking</button>
      <button class={styles.Button} type="reset">Reset destination</button>
    </div>
    <label><input type="checkbox" checked={accept()} onChange={event => setAccept(event.currentTarget.checked)} /> Accept value proposals</label>
    <label><input type="checkbox" checked={keepParis()} onChange={event => setKeepParis(event.currentTarget.checked)} /> Keep Paris in data</label>
    <label><input type="checkbox" checked={preventReset()} onChange={event => setPreventReset(event.currentTarget.checked)} /> Prevent reset</label>
    <div role="status" aria-label="Accepted destination">Key: {value() ?? "none"}</div>
    <div role="status" aria-label="Destination query">Query: {query() || "empty"}</div>
    <div role="status" aria-label="Submitted destination">Submitted: {submitted()}; count: {submissions()}</div>
  </form>;
}
