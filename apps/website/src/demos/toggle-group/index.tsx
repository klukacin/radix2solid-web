import { ToggleGroup } from "@radix-solid/primitives";
import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from "@radix-solid/icons";
import styles from "./styles.module.css";
const ToggleGroupDemo = () => <ToggleGroup.Root class={styles.Group} type="single" defaultValue="center" aria-label="Text alignment">
		<ToggleGroup.Item class={styles.Item} value="left" aria-label="Left aligned">
			<TextAlignLeftIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class={styles.Item} value="center" aria-label="Center aligned">
			<TextAlignCenterIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item class={styles.Item} value="right" aria-label="Right aligned">
			<TextAlignRightIcon />
		</ToggleGroup.Item>
	</ToggleGroup.Root>;
export default ToggleGroupDemo;