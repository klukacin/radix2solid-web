import { createSignal, onSettled, onCleanup } from "solid-js";
import { Toast } from "@radix-solid/primitives";
import "./styles.css";
const ToastDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [eventDateRef, setEventDateRef] = createSignal(new Date());
  let timerRef = 0;
  onSettled(() => {
    onCleanup(() => clearTimeout(timerRef));
  });
  return <Toast.Provider swipeDirection="right">
			<button class="Button large violet" onClick={() => {
      setOpen(false);
      window.clearTimeout(timerRef);
      timerRef = window.setTimeout(() => {
        setEventDateRef(oneWeekAway(new Date()));
        setOpen(true);
      }, 100);
    }}>
				Add to calendar
			</button>

			<Toast.Root class="ToastRoot" open={open()} onOpenChange={setOpen}>
				<Toast.Title class="ToastTitle">Scheduled: Catch up</Toast.Title>
				<Toast.Description asChild>{target => target("time", {
          "class": "ToastDescription",
          "datetime": eventDateRef().toISOString(),
          children: <>
						{prettyDate(eventDateRef())}
					</>
        })}</Toast.Description>
				<Toast.Action class="ToastAction" asChild altText="Goto schedule to undo">{target => target("button", {
          "class": "Button small green",
          children: <>Undo</>
        })}</Toast.Action>
			</Toast.Root>
			<Toast.Viewport class="ToastViewport" />
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