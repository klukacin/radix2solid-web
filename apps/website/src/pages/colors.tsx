import { ColorsMobileMenu } from '../components/colors-mobile-menu';
import { Box, Text, Grid, Heading, Container, Section, Separator, Flex, ScrollArea, Button } from "@wsagency/radix2solid-themes";
import { Footer } from "../components/footer";
import { ColorsHeader } from "../components/colors-header";
import { ColorsMarketingButton } from "../components/colors-marketing-button";
import { SerifHeading } from "../components/serif-heading";
import { DesktopIcon, EyeOpenIcon, Half2Icon, InputIcon, MoonIcon, TransparencyGridIcon } from "@wsagency/radix2solid-icons";
import { Swatch } from "../components/swatch";
import { ColorUsageRange } from "../components/color-usage-range";
import { ColorStepLabel } from "../components/color-step-label";
import styles from "./colors.module.css";
export default function ColorsHome() {
  return <>
			<style innerHTML={`
            :is(.dark, .dark-theme) :is(body, .radix-themes) {
              --color-background: #0b0b0b;
              --color-panel-solid: var(--gray-1);
            }
          `} />
			<Box style={{
      "position": "absolute",
      "left": 0 as const,
      "right": 0 as const,
      "height": "480px",
      "opacity": 0.6,
      "background": "linear-gradient(to bottom, var(--crimson-4), var(--amber-2), transparent)"
    }} />
			<ColorsHeader ghost /><ColorsMobileMenu />
			<Box mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }} position="relative">
				<Section size={{
        initial: "2",
        md: "4"
      }}>
					<Container>
						<SerifHeading mb="3" style={{
            "max-width": "720px"
          }}>
							A gorgeous, accessible color system for user interfaces
						</SerifHeading>

						<Box style={{
            "max-width": "500px"
          }}>
							<Text size="5" as="p" mb="6" color="gray">
								Comprehensive color system for designing beautiful, accessible websites and apps.
							</Text>
						</Box>

						<Flex gap="4">
							<ColorsMarketingButton asChild size={{
              initial: "3",
              xs: "4"
            }}>{target => target("a", {
                "href": "/colors/docs/overview/installation",
                children: <>
									Go to docs
									<svg width="14" height="14" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentcolor" style={{
                    "opacity": 1,
                    "margin-right": "-3px"
                  }}>
										<path d="M6.39205 11.6023L5.36932 10.5909L8.92045 7.03977H0V5.5625H8.92045L5.36932 2.01705L6.39205 1L11.6932 6.30114L6.39205 11.6023Z" />
									</svg>
								</>
              })}</ColorsMarketingButton>

							<Button highContrast variant="soft" color="gray" size={{
              initial: "3",
              xs: "4"
            }} asChild>{target => target("a", {
                "href": "/colors/custom",
                children: <>Custom palette</>
              })}</Button>
						</Flex>
					</Container>
				</Section>
			</Box>

			<ScrollArea mb="-4">
				<Box mx={{
        initial: "5",
        xs: "6",
        sm: "7",
        md: "9"
      }} mb="4">
					<Container style={{
          "white-space": "nowrap",
          "min-width": "880px"
        }}>
						<div class={styles.ColorsHomeGrid}>
							<Box />
							<ColorUsageRange gridColumn="2 / 4">Backgrounds</ColorUsageRange>
							<ColorUsageRange gridColumn="4 / 7">Interactive components</ColorUsageRange>
							<ColorUsageRange gridColumn="7 / 10">Borders and separators</ColorUsageRange>
							<ColorUsageRange gridColumn="10 / 12">Solid colors</ColorUsageRange>
							<ColorUsageRange gridColumn="12 / 14">Accessible text</ColorUsageRange>

							<Box />
							<ColorStepLabel>1</ColorStepLabel>
							<ColorStepLabel>2</ColorStepLabel>
							<ColorStepLabel>3</ColorStepLabel>
							<ColorStepLabel>4</ColorStepLabel>
							<ColorStepLabel>5</ColorStepLabel>
							<ColorStepLabel>6</ColorStepLabel>
							<ColorStepLabel>7</ColorStepLabel>
							<ColorStepLabel>8</ColorStepLabel>
							<ColorStepLabel>9</ColorStepLabel>
							<ColorStepLabel>10</ColorStepLabel>
							<ColorStepLabel>11</ColorStepLabel>
							<ColorStepLabel>12</ColorStepLabel>

							{(["gray", "mauve", "slate", "sage", "olive", "sand", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "bronze", "gold", "brown", "orange", "amber", "yellow", "lime", "mint", "sky"] as const).map(scale => <>
									<Text color="gray" size="2">
										{scale.charAt(0).toUpperCase() + scale.slice(1)}
									</Text>
									{Array.from({
                length: 12
              }, (_, i) => i + 1).map(step => <Swatch scale={scale} step={step.toString() as "1"} />)}
								</>)}
						</div>

						<Box height="32px" />

						<div class={styles.ColorsHomeGrid}>
							<Box />
							<ColorUsageRange gridColumn="2 / -1">
								Shadows, highlights, and overlays
							</ColorUsageRange>

							<Box />
							{Array.from({
              length: 12
            }, (_, i) => i + 1).map(step => <ColorStepLabel>{step}</ColorStepLabel>)}

							{(["black", "white"] as const).map(scale => <>
									<Text color="gray" size="2">
										{scale.charAt(0).toUpperCase() + scale.slice(1)}
									</Text>
									{Array.from({
                length: 12
              }, (_, i) => i + 1).map(step => <Swatch scale={scale} step={step.toString() as "1"} />)}
								</>)}
						</div>
					</Container>
				</Box>
			</ScrollArea>

			<Box mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Section size={{
        initial: "2",
        md: "4"
      }}>
					<Container>
						<Grid columns={{
            sm: "3"
          }} gap={{
            initial: "7",
            sm: "6",
            md: "9"
          }}>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<EyeOpenIcon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									Accessibility made easy
								</Heading>
								<Text as="p" size="3">
									Text colors are guaranteed to pass target contrast ratios against the
									corresponding background colors.
								</Text>
							</Box>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<MoonIcon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									Automatic dark mode
								</Heading>
								<Text as="p" size="3">
									Switching to dark theme is as simple as applying a class to a container. Dark mode
									Just Works™.
								</Text>
							</Box>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<TransparencyGridIcon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									Transparent variants
								</Heading>
								<Text as="p" size="3">
									Each scale has a matching alpha color variant, which is handy for UI components
									that need to blend into colored backgrounds.
								</Text>
							</Box>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<Half2Icon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									APCA text contrast
								</Heading>
								<Text as="p" size="3">
									Contrast targets are based on the modern APCA contrast algorithm, which accurately
									predicts how human vision perceives text.
								</Text>
							</Box>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<DesktopIcon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									P3 color gamut support
								</Heading>
								<Text as="p" size="3">
									Accounts for the blending differences in the wide gamut color spaces and enables
									the brightest yellows and reds possible.
								</Text>
							</Box>
							<Box style={{
              "max-width": "540px"
            }}>
								<Flex mb="3">
									<InputIcon width="30" height="30" />
								</Flex>
								<Heading size="4" as="h3" mb="2">
									Designed for user interfaces
								</Heading>
								<Text as="p" size="3">
									Each step is designed with a specific use case in mind, such as backgrounds, hover
									states, borders, overlays, or text.
								</Text>
							</Box>
						</Grid>
					</Container>
				</Section>
			</Box>

			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Separator size="2" />
				<Section size={{
        initial: "2",
        md: "4"
      }} pb="0">
					<Footer />
				</Section>
			</Container>
		</>;
}