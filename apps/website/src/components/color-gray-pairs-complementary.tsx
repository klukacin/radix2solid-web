import { Box, Text, Grid, Flex } from "@radix-solid/themes";
const whiteBgColors = ["bronze", "gold", "brown", "orange", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass"];
const darkBgColors = ["sky", "mint", "lime", "yellow", "amber"];
export function ColorGrayPairsComplementary() {
  return <Box>
			<Text as="p" mb="3">
				Scales designed for white foreground text:
			</Text>

			<Grid align="center" my="5" style={{
      "grid-template-columns": "repeat(5, minmax(0, 1fr))",
      "gap": "2px"
    }}>
				{whiteBgColors.map(color => <Flex align="center" justify="center" style={{
        "height": "65px",
        "background-color": `var(--${color}-10)`
      }}>
						<Text as="p" size="2" style={{
          "color": "white",
          "text-transform": "capitalize"
        }}>
							{color}
						</Text>
					</Flex>)}
			</Grid>

			<Text as="p" mb="3">
				Scales designed for dark foreground text:
			</Text>

			<Grid align="center" my="5" style={{
      "grid-template-columns": "repeat(5, minmax(0, 1fr))",
      "gap": "2px"
    }}>
				{darkBgColors.map(color => <Flex align="center" justify="center" style={{
        "height": "65px",
        "background-color": `var(--${color}-10)`
      }}>
						<Text as="p" size="2" style={{
          "color": `var(--${color}-contrast)`,
          "text-transform": "capitalize"
        }}>
							{color}
						</Text>
					</Flex>)}
			</Grid>
		</Box>;
}