import { Popover } from "@radix-solid/primitives";
import styles from "./styles.module.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger class={styles.Trigger}>More info</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class={styles.Content} sideOffset={5}>
				Some more info…
				<Popover.Arrow class={styles.Arrow} />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;