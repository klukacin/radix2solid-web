import { Toggle } from "@radix-solid/primitives";
import { FontItalicIcon } from "@radix-solid/icons";
import "./styles.css";
const ToggleDemo = () => <Toggle.Root class="Toggle" aria-label="Toggle italic">
		<FontItalicIcon />
	</Toggle.Root>;
export default ToggleDemo;