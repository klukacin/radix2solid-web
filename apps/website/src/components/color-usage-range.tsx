import { omit, type ComponentProps } from "solid-js";
import { Flex, Text, Box } from "@radix-solid/themes";
export const ColorUsageRange = (p: Exclude<ComponentProps<typeof Flex>, {
  asChild: true;
}>) => <Flex direction="column" mb="2" {...omit(p, "children")}>
		<Text align="center" size="1" mb="3" color="gray">
			{p.children}
		</Text>
		<Box style={{
    "height": "1px",
    "background-image": "linear-gradient(to right, transparent, var(--gray-a8) 30%, var(--gray-a8) 70%, transparent)"
  }} />
	</Flex>;