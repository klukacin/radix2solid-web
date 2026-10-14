import { Popover } from "@wsagency/radix2solid-primitives";
import "./styles.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger class="PopoverTrigger">More info</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class="PopoverContent" sideOffset={5} aria-label="More info" aria-describedby={undefined}>
				Some more info…
				<Popover.Arrow class="PopoverArrow" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;