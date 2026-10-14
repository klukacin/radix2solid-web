import { ScrollArea } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const TAGS = Array.from({
  length: 50
}).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
const ScrollAreaDemo = () => <ScrollArea.Root class={styles.Root}>
		<ScrollArea.Viewport class={styles.Viewport}>
			<div style={{
      "padding": "15px 20px"
    }}>
				<div class={styles.Text}>Tags</div>
				{TAGS.map(tag => <div class={styles.Tag}>
						{tag}
					</div>)}
			</div>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar class={styles.Scrollbar} orientation="vertical">
			<ScrollArea.Thumb class={styles.Thumb} />
		</ScrollArea.Scrollbar>
		<ScrollArea.Scrollbar class={styles.Scrollbar} orientation="horizontal">
			<ScrollArea.Thumb class={styles.Thumb} />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner class={styles.Corner} />
	</ScrollArea.Root>;
export default ScrollAreaDemo;