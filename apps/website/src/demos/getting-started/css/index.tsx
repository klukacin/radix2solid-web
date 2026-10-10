import { Popover } from "@radix-solid/primitives";
import "./styles.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger class="PopoverTrigger">More info</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class="PopoverContent" sideOffset={5}>
				Some more info…
				<Popover.Arrow class="PopoverArrow" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;