import { ColorsHeader } from "../components/colors-header";
import { ColorsMobileMenu } from "../components/colors-mobile-menu";
import { ArrowLeftIcon } from "@wsagency/radix2solid-icons";
import { Box, Container, Flex, Grid, Heading, Link, Section, Text, Theme } from "@wsagency/radix2solid-themes";
import { ColorUsageRange } from "../components/color-usage-range";
import { ColorStepLabel } from "../components/color-step-label";
import { ColorThemeProvider } from "../colors/color-theme-provider";
import { AccentColorField, BackgroundColorField, ColorStyles, CopyButton, GrayColorField, Preview, RootTheme, Swatch, ThemeSwitcher } from "../colors/page-client";
// Statically exported: the saved (cookie) and shared (URL) palette are restored
// on the client by ColorThemeProvider.
export default function CustomColorsPage() {
  return <ColorThemeProvider>
			<ColorStyles />
			<RootTheme class="radix-themes-custom-fonts">
				
				<Box style={{
        "position": "absolute",
        "left": 0 as const,
        "right": 0 as const,
        "height": "480px",
        "opacity": 0.6,
        "background": "linear-gradient(to bottom, var(--accent-4), transparent)"
      }} />

				<ColorsHeader ghost />
				<ColorsMobileMenu />

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
						<Flex direction="column" align="center" mb="7">
							<Flex asChild align="center" gap="1" mb="3">{target => target(Link, {
                "asChild": true,
                "size": "2",
                "color": "gray",
                "ml": "-2",
                children: target => target("a", {
                  "href": "/colors",
                  children: <>
										<ArrowLeftIcon />
										Radix Colors
									</>
                })
              })}</Flex>
							<Heading as="h1" align="center" size="8">
								Create a custom palette
							</Heading>

							<ThemeSwitcher style={{
              "background-color": "transparent"
            }} mt="5" />
						</Flex>

						<Box mb="9" id="palette">
							<Grid columns={{
              initial: "1fr",
              sm: "180px 180px 180px auto"
            }} maxWidth={{
              initial: "400px",
              sm: "none"
            }} mx="auto" gap="4" justify="center" align="end">
								<Flex direction="column">
									<Flex mb="1">
										<Text as="label" for="accent" size="1" color="gray">
											Accent
										</Text>
									</Flex>
									<AccentColorField id="accent" />
								</Flex>

								<Flex direction="column">
									<Flex justify="between" mb="1">
										<Text as="label" for="gray" size="1" color="gray">
											Gray
										</Text>
									</Flex>
									<GrayColorField id="gray" />
								</Flex>

								<Flex direction="column">
									<Flex mb="1">
										<Text as="label" for="bg" size="1" color="gray">
											Background
										</Text>
									</Flex>
									<BackgroundColorField id="bg" />
								</Flex>

								<Flex gap="3" align={{
                sm: "center"
              }} direction={{
                initial: "column",
                sm: "row"
              }} mt={{
                initial: "2",
                sm: "0"
              }}>
									<CopyButton />
								</Flex>
							</Grid>
							<Text as="p" size="2" color="gray" align="center" mt="4">
								Copied and downloaded CSS is global, not scoped to one Theme. To use it as a Radix Themes accent beside the built-in ones, see{" "}
								<Link href="/themes/docs/theme/color#custom-accent" underline="always">Custom accent</Link>.
							</Text>
						</Box>

						<Grid mb="9" flow={{
            initial: "column",
            sm: "row"
          }} columns={{
            initial: "2",
            sm: "12"
          }} rows={{
            initial: "12",
            sm: "auto"
          }} gap={{
            initial: "2px",
            md: "1"
          }} mx={{
            initial: "-5",
            xs: "-6",
            sm: "0"
          }} px={{
            initial: "2px",
            sm: "0"
          }}>
							<ColorUsageRange display={{
              initial: "none",
              sm: "flex"
            }} gridColumn="1 / 3">
								Backgrounds
							</ColorUsageRange>
							<ColorUsageRange display={{
              initial: "none",
              sm: "flex"
            }} gridColumn="3 / 6">
								Interactive components
							</ColorUsageRange>
							<ColorUsageRange display={{
              initial: "none",
              sm: "flex"
            }} gridColumn="6 / 9">
								Borders and separators
							</ColorUsageRange>
							<ColorUsageRange display={{
              initial: "none",
              sm: "flex"
            }} gridColumn="9 / 11">
								Solid colors
							</ColorUsageRange>
							<ColorUsageRange display={{
              initial: "none",
              sm: "flex"
            }} gridColumn="11 / 13">
								Accessible text
							</ColorUsageRange>

							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>1</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>2</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>3</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>4</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>5</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>6</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>7</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>8</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>9</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>10</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>11</ColorStepLabel>
							<ColorStepLabel display={{
              initial: "none",
              sm: "flex"
            }}>12</ColorStepLabel>

							{Array.from({
              length: 12
            }, (_, i) => i + 1).map((step, i) => <Swatch scale={i} step={step} type="accent" />)}
							{Array.from({
              length: 12
            }, (_, i) => i + 1).map((step, i) => <Swatch scale={i} step={step} type="gray" />)}
						</Grid>
						<Theme class="radix-themes-default-fonts"><Preview /></Theme>
					</Container>
				</Section>
			</RootTheme>
		</ColorThemeProvider>;
}