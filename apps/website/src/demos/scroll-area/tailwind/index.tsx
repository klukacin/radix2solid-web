import { ScrollArea } from "@radix-solid/primitives";
const TAGS = Array.from({
  length: 50
}).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
const ScrollAreaDemo = () => <ScrollArea.Root class="h-[225px] w-[200px] overflow-hidden rounded bg-white shadow-[0_2px_10px] shadow-blackA4">
		<ScrollArea.Viewport class="size-full rounded">
			<div class="px-5 py-[15px]">
				<div class="text-[15px] font-medium leading-[18px] text-violet11">
					Tags
				</div>
				{TAGS.map(tag => <div class="mt-2.5 border-t border-t-mauve6 pt-2.5 text-[13px] leading-[18px] text-mauve12">
						{tag}
					</div>)}
			</div>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar class="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col" orientation="vertical">
			<ScrollArea.Thumb class="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Scrollbar class="flex touch-none select-none bg-blackA3 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col" orientation="horizontal">
			<ScrollArea.Thumb class="relative flex-1 rounded-[10px] bg-mauve10 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner class="bg-blackA5" />
	</ScrollArea.Root>;
export default ScrollAreaDemo;