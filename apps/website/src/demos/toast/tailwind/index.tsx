import { createSignal, onSettled } from "solid-js";
import { Toast } from "@wsagency/radix2solid-primitives";
const ToastDemo = () => {
  const [open, setOpen] = createSignal(false);
  const [eventDateRef, setEventDateRef] = createSignal(new Date());
  let timerRef = 0;
  onSettled(() => () => clearTimeout(timerRef));
  return <Toast.Provider swipeDirection="right">
			<button class="inline-flex h-[35px] items-center justify-center rounded bg-white px-[15px] text-[15px] font-medium leading-[35px] text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black" onClick={() => {
      setOpen(false);
      window.clearTimeout(timerRef);
      timerRef = window.setTimeout(() => {
        setEventDateRef(oneWeekAway(new Date()));
        setOpen(true);
      }, 100);
    }}>
				Add to calendar
			</button>

			<Toast.Root class="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]" open={open()} onOpenChange={setOpen}>
				<Toast.Title class="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
					Scheduled: Catch up
				</Toast.Title>
				<Toast.Description asChild>{target => target("time", {
          "class": "m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]",
          "datetime": eventDateRef().toISOString(),
          children: <>
						{prettyDate(eventDateRef())}
					</>
        })}</Toast.Description>
				<Toast.Action class="[grid-area:_action]" asChild altText="Goto schedule to undo">{target => target("button", {
          "class": "inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8",
          children: <>
						Undo
					</>
        })}</Toast.Action>
			</Toast.Root>
			<Toast.Viewport class="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
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