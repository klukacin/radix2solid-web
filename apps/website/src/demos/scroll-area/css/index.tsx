import { ScrollArea } from "@radix-solid/primitives";
import "./styles.css";
const TAGS = Array.from({
  length: 50
}).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
const ScrollAreaDemo = () => <ScrollArea.Root class="ScrollAreaRoot">
		<ScrollArea.Viewport class="ScrollAreaViewport">
			<div style={{
      "padding": "15px 20px"
    }}>
				<div class="Text">Tags</div>
				{TAGS.map(tag => <div class="Tag">
						{tag}
					</div>)}
			</div>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar class="ScrollAreaScrollbar" orientation="vertical">
			<ScrollArea.Thumb class="ScrollAreaThumb" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Scrollbar class="ScrollAreaScrollbar" orientation="horizontal">
			<ScrollArea.Thumb class="ScrollAreaThumb" />
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner class="ScrollAreaCorner" />
	</ScrollArea.Root>;
export default ScrollAreaDemo;