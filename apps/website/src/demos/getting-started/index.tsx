import { Popover } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger class={styles.Trigger}>More info</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class={styles.Content} sideOffset={5} aria-label="More info" aria-describedby={undefined}>
				Some more info…
				<Popover.Arrow class={styles.Arrow} />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;