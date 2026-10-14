import { Toggle } from "@wsagency/radix2solid-primitives";
import { FontItalicIcon } from "@wsagency/radix2solid-icons";
import "./styles.css";
const ToggleDemo = () => <Toggle.Root class="Toggle" aria-label="Toggle italic">
		<FontItalicIcon />
	</Toggle.Root>;
export default ToggleDemo;