import { ToggleGroup } from "@wsagency/radix2solid-primitives";
import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from "@wsagency/radix2solid-icons";
const toggleGroupItemClasses = "flex size-[35px] items-center justify-center bg-white leading-4 text-mauve11 first:rounded-l last:rounded-r hover:bg-violet3 focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none data-[state=on]:bg-violet6 data-[state=on]:text-violet12";
const ToggleGroupDemo = () => <ToggleGroup.Root class="inline-flex space-x-px rounded bg-mauve6 shadow-[0_2px_10px] shadow-blackA4" type="single" defaultValue="center" aria-label="Text alignment">
		<ToggleGroup.Item class={toggleGroupItemClasses} value="left" aria-label="Left aligned">
			<TextAlignLeftIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class={toggleGroupItemClasses} value="center" aria-label="Center aligned">
			<TextAlignCenterIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class={toggleGroupItemClasses} value="right" aria-label="Right aligned">
			<TextAlignRightIcon />
		</ToggleGroup.Item>
	</ToggleGroup.Root>;
export default ToggleGroupDemo;