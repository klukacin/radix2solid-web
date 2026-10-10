import { Toggle } from "@radix-solid/primitives";
import { FontItalicIcon } from "@radix-solid/icons";
import styles from "./styles.module.css";
const ToggleDemo = () => <Toggle.Root class={styles.Toggle} aria-label="Toggle italic">
		<FontItalicIcon />
	</Toggle.Root>;
export default ToggleDemo;