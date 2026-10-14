import { Toolbar } from "@wsagency/radix2solid-primitives";
import { StrikethroughIcon, TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, FontBoldIcon, FontItalicIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const ToolbarDemo = () => <Toolbar.Root class={styles.Root} aria-label="Formatting options">
		<Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
			<Toolbar.ToggleItem class={styles.ToggleItem} value="bold" aria-label="Bold">
				<FontBoldIcon />
			</Toolbar.ToggleItem>
			<Toolbar.ToggleItem class={styles.ToggleItem} value="italic" aria-label="Italic">
				<FontItalicIcon />
			</Toolbar.ToggleItem>
			<Toolbar.ToggleItem class={styles.ToggleItem} value="strikethrough" aria-label="Strike through">
				<StrikethroughIcon />
			</Toolbar.ToggleItem>
		</Toolbar.ToggleGroup>
		<Toolbar.Separator class={styles.Separator} />
		<Toolbar.ToggleGroup type="single" defaultValue="center" aria-label="Text alignment">
			<Toolbar.ToggleItem class={styles.ToggleItem} value="left" aria-label="Left aligned">
				<TextAlignLeftIcon />
			</Toolbar.ToggleItem>
			<Toolbar.ToggleItem class={styles.ToggleItem} value="center" aria-label="Center aligned">
				<TextAlignCenterIcon />
			</Toolbar.ToggleItem>
			<Toolbar.ToggleItem class={styles.ToggleItem} value="right" aria-label="Right aligned">
				<TextAlignRightIcon />
			</Toolbar.ToggleItem>
		</Toolbar.ToggleGroup>
		<Toolbar.Separator class={styles.Separator} />
		<Toolbar.Link class={styles.Link} href="#" target="_blank" style={{
    "margin-right": "10px"
  }}>
			Edited 2 hours ago
		</Toolbar.Link>
		<Toolbar.Button class={styles.Button} style={{
    "margin-left": "auto"
  }}>
			Share
		</Toolbar.Button>
	</Toolbar.Root>;
export default ToolbarDemo;