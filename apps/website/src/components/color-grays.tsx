import { Text, Grid, Flex } from "@wsagency/radix2solid-themes";
const grayColors = ["gray", "mauve", "slate", "sage", "olive", "sand"];
export function ColorGrays() {
  return <Grid my="5" align="center" style={{
    "grid-template-columns": "repeat(6, minmax(0, 1fr))",
    "gap": "2px"
  }}>
			{grayColors.map(color => <Flex align="center" justify="center" style={{
      "height": "35px",
      "background-color": `var(--${color}-10)`
    }}>
					<Text as="p" size="2" style={{
        "color": "white",
        "text-transform": "capitalize"
      }}>
						{color}
					</Text>
				</Flex>)}
		</Grid>;
}