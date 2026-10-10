import { ColorsMobileMenu } from '../components/colors-mobile-menu';
import { ColorsHeader } from "../components/colors-header";
import { transposeProgressionStart } from "../colors/generate-radix-colors";
import { Section, Container, Heading, Box, Flex, Text } from "@radix-solid/themes";
export default function Page() {
  return <>
			<ColorsHeader ghost /><ColorsMobileMenu />
			<Section px={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }} size={{
      initial: "2",
      md: "3"
    }}>
				<Container position="relative">
					<Heading align="center" mb="5">
						Internal test page
					</Heading>
					<Flex direction="column" align="stretch" width="100%" maxWidth="1000px" mx="auto" my="8" gap="8">
						<Box>
							<Text size="1" as="div" mb="3">
								Range 10–50
							</Text>
							<NumericalScale numbers={[10, 15, 20, 25, 30, 35, 40, 45, 50]} />
						</Box>

						<Box>
							<Text size="1" as="div" mb="3">
								Start transposed to 0 with linear easing
							</Text>
							<NumericalScale numbers={transposeProgressionStart(0, [10, 15, 20, 25, 30, 35, 40, 45, 50], [0, 0, 0, 0])} />
						</Box>

						<Box>
							<Text size="1" as="div" mb="3">
								Start transposed to 0 with cubic ease-in
							</Text>
							<NumericalScale numbers={transposeProgressionStart(0, [10, 15, 20, 25, 30, 35, 40, 45, 50], [0.55, 0.055, 0.675, 0.19])} />
						</Box>

						<Box>
							<Text size="1" as="div" mb="3">
								Start transposed to 0 with exponential ease-in
							</Text>
							<NumericalScale numbers={transposeProgressionStart(0, [10, 15, 20, 25, 30, 35, 40, 45, 50], [0.95, 0.05, 0.795, 0.035])} />
						</Box>

						<Box>
							<Text size="1" as="div" mb="3">
								Start transposed to 20 with exponential ease-in
							</Text>
							<NumericalScale numbers={transposeProgressionStart(20, [10, 15, 20, 25, 30, 35, 40, 45, 50], [0.95, 0.05, 0.795, 0.035])} />
						</Box>

						<Box>
							<Text size="1" as="div" mb="3">
								Start transposed to 20 with quadratic ease-in
							</Text>
							<NumericalScale numbers={transposeProgressionStart(20, [10, 15, 20, 25, 30, 35, 40, 45, 50], [0.55, 0.085, 0.68, 0.53])} />
						</Box>
					</Flex>
				</Container>
			</Section>
		</>;
}
interface NumericalScaleProps {
  numbers: number[];
}
function NumericalScale(p: NumericalScaleProps) {
  return <Flex position="relative" width="100%" height="8px" style={{
    "border-bottom": "1px solid var(--red-9)"
  }}>
			{p.numbers.map((number, i) => <Box data-number={number} height="16px" position="absolute" left={number + "%"} style={{
      "border-left": `1px solid ${i === 0 ? "var(--yellow-11)" : "var(--red-9)"}`
    }} />)}
		</Flex>;
}