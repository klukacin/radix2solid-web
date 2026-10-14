import { Toggle } from "@wsagency/radix2solid-primitives";
import { FontItalicIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const ToggleDemo = () => <Toggle.Root class={styles.Toggle} aria-label="Toggle italic">
		<FontItalicIcon />
	</Toggle.Root>;
export default ToggleDemo;