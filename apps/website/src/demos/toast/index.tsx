import { createSignal, onSettled } from "solid-js";
import { Toast } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const ToastDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [eventDateRef, setEventDateRef] = createSignal(new Date());
  let timerRef = 0;
  onSettled(() => () => clearTimeout(timerRef));
  return <Toast.Provider swipeDirection="right">
			<button class={`${styles.Button} large violet`} onClick={() => {
      setOpen(false);
      window.clearTimeout(timerRef);
      timerRef = window.setTimeout(() => {
        setEventDateRef(oneWeekAway(new Date()));
        setOpen(true);
      }, 100);
    }}>
				Add to calendar
			</button>

			<Toast.Root class={styles.Root} open={open()} onOpenChange={setOpen}>
				<Toast.Title class={styles.Title}>Scheduled: Catch up</Toast.Title>
				<Toast.Description asChild>{target => target("time", {
          "class": styles.Description,
          "datetime": eventDateRef().toISOString(),
          children: <>
						{prettyDate(eventDateRef())}
					</>
        })}</Toast.Description>
				<Toast.Action class={styles.Action} asChild altText="Goto schedule to undo">{target => target("button", {
          "class": `${styles.Button} small green`,
          children: <>Undo</>
        })}</Toast.Action>
			</Toast.Root>
			<Toast.Viewport class={styles.Viewport} />
		</Toast.Provider>;
};
function oneWeekAway(date: Date) {
  const now = new Date(date);
  const inOneWeek = now.setDate(now.getDate() + 7);
  return new Date(inOneWeek);
}
function prettyDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}
export default ToastDemo;