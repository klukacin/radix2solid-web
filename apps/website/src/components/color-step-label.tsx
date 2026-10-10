import { omit, type ComponentProps } from "solid-js";
import { Flex, Text } from "@radix-solid/themes";
export const ColorStepLabel = (p: Exclude<ComponentProps<typeof Flex>, {
  asChild: true;
}>) => <Flex justify="center" mb="3" {...omit(p, "children")}>
		<Text size="1" color="gray">
			{p.children}
		</Text>
	</Flex>;