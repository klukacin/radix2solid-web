import { Box, Text, Flex } from "@radix-solid/themes";
const pairings = [{
  color: "mauve",
  pairs: ["tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet"]
}, {
  color: "slate",
  pairs: ["iris", "indigo", "blue", "sky", "cyan"]
}, {
  color: "sage",
  pairs: ["mint", "teal", "jade", "green"]
}, {
  color: "olive",
  pairs: ["grass", "lime"]
}, {
  color: "sand",
  pairs: ["yellow", "amber", "orange", "brown"]
}];
export function ColorGrayPairs() {
  return <Box>
			{pairings.map(({
      color,
      pairs
    }) => <Box my="5">
					<Flex flexGrow="1" align="center" justify="center" style={{
        "height": "var(--space-6)",
        "margin-bottom": "2px",
        "background-color": `var(--${color}-4)`
      }}>
						<Text as="p" size="2" style={{
          "color": `var(--${color}-11)`,
          "text-transform": "capitalize"
        }}>
							{color}
						</Text>
					</Flex>
					<Flex style={{
        "gap": "2px"
      }}>
						{pairs.map(pair => <Flex flexGrow="1" width="100%" align="center" justify="center" style={{
          "height": "var(--space-6)",
          "background-color": `var(--${pair}-9)`
        }}>
								<Text as="p" size="2" style={{
            "color": `var(--${pair}-contrast)`,
            "text-transform": "capitalize"
          }}>
									{pair}
								</Text>
							</Flex>)}
					</Flex>
				</Box>)}
		</Box>;
}