import { mergeStyles } from "@radix-solid/themes/helpers";
import { type ComponentProps, omit } from "solid-js";
import { Flex, Grid, Text } from "@radix-solid/themes";
type RightClickZoneProps = Extract<ComponentProps<typeof Grid>, { asChild?: false }> & {
  title?: string;
};
export const RightClickZone = (p: RightClickZoneProps) => <Grid {...omit(p, "title", "style")} style={mergeStyles({
  "height": "100px",
  "place-items": "center",
  "border": "1px dashed var(--accent-a6)",
  "background-color": "var(--accent-a2)",
  "border-radius": "var(--radius-3)",
  "cursor": "default"
}, p.style)}>
		<Flex direction="column" align="center">
			{p.title && <Text weight="bold" size="2">
					{p.title}
				</Text>}
			<Text color="gray" size={p.title ? "2" : undefined}>
				Right-click here
			</Text>
		</Flex>
	</Grid>;