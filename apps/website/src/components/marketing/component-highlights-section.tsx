import { CheckIcon } from "@wsagency/radix2solid-icons";
import { MarketingCaption } from "./marketing-caption";
import { Box, Flex, Grid, Container, Section, Heading, Text } from "@wsagency/radix2solid-themes";
import { HiddenScroll } from "./hidden-scroll";
export const ComponentHighlightsSection = () => {
  return <Section position="relative" overflow="hidden" size={{
    initial: "2",
    sm: "4"
  }} mb={{
    md: "9"
  }}>
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Flex direction="column" align="center" position="relative" mb="6" pb={{
        lg: "9"
      }}>
					<MarketingCaption mb="1">Case in point</MarketingCaption>
					<Heading align="center" as="h2" size="7" mb="3">
						So, you think you can <span style={{
            "white-space": "nowrap"
          }}>build a dropdown?</span>
					</Heading>
					<Text align="center" as="p" size="3" style={{
          "max-width": "340px"
        }}>
						We agonise over API design, performance, and accessibility so you don&apos;t need to.
					</Text>
				</Flex>

				<Box position="relative">
					{/* Use guides to position things sanely */}
					{/* <Guides7 /> */}
					{/* <Guides8 /> */}

					<Box position="relative" mb="4" style={{
          "pointer-events": "none"
        }}>
						<Box position="absolute" height="100%" top="50%" left="50%" style={{
            "transform": "translate(-50%, -50%)"
          }}>
							<Circle size={180} angle={-45} color1="var(--slate-a4)" color2="var(--indigo-a6)" />
							<Circle size={300} angle={20} color1="var(--slate-a3)" color2="var(--indigo-a5)" />
							<Circle size={420} angle={35} color1="var(--slate-a2)" color2="var(--indigo-a4)" />
							<Circle size={540} angle={-50} color1="var(--slate-a2)" color2="var(--indigo-a3)" />
							{[660, 780, 900, 1020, 1140, 1260, 1380, 1500, 1620, 1740, 1860, 1980, 2100].map((size, i) => <Circle size={size + i * i * 5} angle={-45 + i * 15} color1="var(--slate-a2)" color2="var(--indigo-a3)" opacity={Math.max(0, 1 - i * 0.1)} />)}
						</Box>
						<Flex align="center" justify="center" position="relative" style={{
            "height": "var(--component-highlights-image-height, auto)"
          }}>
							<img src="/marketing/dropdown-menu.svg" alt="A dropdown menu example with a checked item and a submenu" />
						</Flex>
					</Box>

					<HiddenScroll position={{
          initial: "relative",
          sm: "static"
        }} m={{
          initial: "-8",
          sm: "0"
        }} p={{
          initial: "8",
          sm: "0"
        }}>
						<Grid gap={{
            initial: "5",
            sm: "7"
          }} flow={{
            initial: "column",
            sm: "row"
          }} justify={{
            initial: "start",
            sm: "center"
          }} columns={{
            initial: "none",
            sm: "auto auto"
          }} style={{
            "grid-auto-columns": "max-content"
          }}>
							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "400px",
              "top": "-1%",
              "left": "27%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Full keyboard navigation
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Navigate the menu using arrow keys, Escape, and Enter hotkeys, or even via
									typeahead.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "400px",
              "top": "14%",
              "left": "60%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Modal and non-modal modes
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Configure whether the dropdown menu allows or blocks outside interactions.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "400px",
              "top": "40%",
              "left": "74%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Supports submenus
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Nest another level of fully functional submenus inside the dropdown menu.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "420px",
              "top": "67%",
              "left": "69%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Supports assistive technology
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Implements correct semantics and behaviors, so it&apos;s accessible to people
									using assistive technology.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "400px",
              "top": "94%",
              "left": "39%"
            }}>
								<Flex gap="2" align="start" mb="1" mr="-1">
									<Checkmark />
									<Heading as="h3" size="3">
										Collision and origin-aware animations
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Create open and close animations that take the dropdown menu’s actual position
									into account.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "420px",
              "top": "76%",
              "left": "8%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Control alignment and collisions
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Position the menu anywhere relative to the trigger, taking collisions with the
									screen into account.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "420px",
              "top": "49%",
              "left": "-1%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Fully managed focus
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Granularly control focus behavior when user closes the dropdown menu or focuses an
									outside element.
								</Text>
							</Box>

							<Box position={{
              lg: "absolute"
            }} style={{
              "width": "var(--component-highlights-item-width)",
              "max-width": "400px",
              "top": "19%",
              "left": "4%"
            }}>
								<Flex gap="2" align="start" mb="1">
									<Checkmark />
									<Heading as="h3" size="3">
										Supports checkable items
									</Heading>
								</Flex>
								<Text as="p" color="gray" size="3" ml="6">
									Items can be used to perform actions, as well as act as checkbox or radiobutton
									controls.
								</Text>
							</Box>

							<Box pr="5" display={{
              sm: "none"
            }} />
						</Grid>
					</HiddenScroll>
				</Box>
			</Container>
		</Section>;
};
const Checkmark = () => <CheckIcon style={{
  "color": "var(--teal-11)",
  "background-color": "var(--teal-4)",
  "padding": "var(--space-1)",
  "width": "var(--space-5)",
  "height": "var(--space-5)",
  "margin-top": "-1px",
  "margin-bottom": "-1px",
  "border-radius": "100%",
  "flex-grow": 0,
  "flex-shrink": 0
}} />;
const Circle = (p: {
  size: number;
  angle?: number;
  color1: string;
  color2: string;
  opacity?: number;
}) => {
  return <Box style={{
    "position": "absolute",
    "left": "50%",
    "top": "50%",
    "width": `${p.size}px`,
    "height": `${p.size}px`,
    "opacity": p.opacity ?? 1,
    "transform": `translate(-50%, -50%) rotate(${p.angle ?? 90}deg)`
  }}>
			<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
      "width": "100%",
      "height": "100%"
    }}>
				<circle cx="50" cy="50" r="49" stroke={`url(#circle-${p.size})`} stroke-width="1" vector-effect="non-scaling-stroke" />
				<defs>
					<linearGradient id={`circle-${p.size}`} gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
						<stop stop-color={p.color1} />
						<stop stop-color={p.color2} offset="1" />
					</linearGradient>
				</defs>
			</svg>
		</Box>;
};
