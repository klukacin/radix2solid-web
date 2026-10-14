
import { mergeStyles } from "@wsagency/radix2solid-themes/helpers";
import type { JSX } from "@solidjs/web";
import { createSignal, onCleanup, createEffect } from "solid-js";
import { Box, Section, Text, Flex, Grid, Heading, Card } from "@wsagency/radix2solid-themes";
import { MarketingCaption } from "./marketing-caption";
import { Container, Theme } from "@wsagency/radix2solid-themes";
import { HiddenScroll } from "./hidden-scroll";
import { CodeBlock } from "../code-block";
enum Highlights {
  Unstyled = "1-10",
  Composable = "13-26",
  Customizable = "29-46",
  Consistent = "49-67",
}
export const DeveloperExperienceSection = () => {
  const [activeLines, setActiveLines] = createSignal<Highlights>(Highlights.Unstyled);
  const [preRef, setPreRef] = createSignal<HTMLPreElement | null>(null);
  createEffect(() => [activeLines(), preRef()], () => {
    const pre = preRef();
    if (!pre) {
      return;
    }
    const paddingY = 24;
    const codeInner = pre.querySelector("code")!;
    const codeBlockHeight = pre.clientHeight - paddingY * 2;
    const lines = pre.querySelectorAll<HTMLElement>("[data-highlighted]");
    if (!activeLines()) {
      codeInner.style.transform = `translate3d(0, 0, 0)`;
      return;
    }
    const linesToHighlight = activeLines().split("-").map(Number);
    const firstLineNumber = Math.max(0, linesToHighlight[0] - 1);
    const lastLineNumber = Math.min(lines.length - 1, linesToHighlight[1] - 1);
    const firstLine = lines[firstLineNumber];
    const lastLine = lines[lastLineNumber];

    // Prevent errors in case the right line doesnt exist
    if (!firstLine || !lastLine) {
      console.warn(`NewCodeDemo: Error finding the right line`);
      return;
    }
    const linesHeight = lastLine.offsetTop + lastLine.offsetHeight - firstLine.offsetTop;
    const maxDistance = codeInner.clientHeight - codeBlockHeight;
    const codeFits = linesHeight < codeBlockHeight;
    const lastLineIsBelow = lastLine.offsetTop + lastLine.offsetHeight > codeBlockHeight - paddingY;
    const lastLineIsAbove = !lastLineIsBelow;
    let translateY: number;
    if (codeFits && lastLineIsAbove) {
      translateY = 0;
    } else if (codeFits && lastLineIsBelow) {
      const dist = firstLine.offsetTop - (codeBlockHeight - linesHeight) / 2;
      translateY = dist > maxDistance ? maxDistance : dist;
    } else {
      translateY = firstLine.offsetTop;
    }
    lines.forEach((line, i) => {
      const lineIndex = i + 1;
      if (lineIndex >= linesToHighlight[0] && lineIndex <= linesToHighlight[1]) {
        line.setAttribute("data-highlighted", "true");
      } else {
        line.setAttribute("data-highlighted", "false");
      }
    });
    requestAnimationFrame(() => codeInner.style.transform = `translate3d(0, ${-translateY}px, 0)`);
  });
  return <Section size={{
    initial: "2",
    sm: "4"
  }} overflow="hidden" style={{
    "background-color": "var(--sky-6)",
    "background": `
					radial-gradient(ellipse at 100% 100%, hsl(254 100% 6% / 0.07), var(--violet-a1), transparent),
					linear-gradient(to bottom right, var(--mint-2), var(--indigo-2), var(--pink-3), var(--cyan-3))`
  }}>
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Grid gap={{
        initial: "5",
        md: "8"
      }} columns={{
        sm: "auto 1fr"
      }}>
					<Box style={{
          "max-width": "430px"
        }}>
						<MarketingCaption mb="1">Developer experience to love</MarketingCaption>
						<Heading as="h2" size="7" mb="4">
							Develop with an open, thought‑out API
						</Heading>

						<Text as="p" mb="5" style={{
            "max-width": "500px"
          }}>
							One of our main goals is to provide the best possible developer experience. Radix
							Primitives provides a fully-typed API. All components share a similar API, creating a
							consistent and predictable experience.
						</Text>

						<HiddenScroll pl="5" py="1" width="100vw" display={{
            md: "none"
          }} mx={{
            initial: "-5",
            xs: "-6",
            sm: "-7"
          }}>
							<Grid gapX={{
              initial: "3",
              xs: "5"
            }} gapY="3" flow="column" columns="repeat(4, max-content) 1px" rows="430px auto">
								<Theme asChild appearance="dark">{target => target(CodeBlock.Root, {
                  get "style"() {
                    return codeBlockRootStyles;
                  },
                  children: <>
										<CodeBlock.Content>
											<CodeBlock.Pre>
												<CodeBlock.Code language="tsx">{code.unstyled}</CodeBlock.Code>
											</CodeBlock.Pre>
										</CodeBlock.Content>
									</>
                })}</Theme>

								<Box>
									<Heading as="h3" size="3">
										Unstyled
									</Heading>
									<Text as="p" size="3" color="gray">
										No need to override styles, no specificity wars.
									</Text>
								</Box>

								<Theme asChild appearance="dark">{target => target(CodeBlock.Root, {
                  get "style"() {
                    return codeBlockRootStyles;
                  },
                  children: <>
										<CodeBlock.Content>
											<CodeBlock.Pre>
												<CodeBlock.Code language="tsx">{code.composable}</CodeBlock.Code>
											</CodeBlock.Pre>
										</CodeBlock.Content>
									</>
                })}</Theme>

								<Box>
									<Heading as="h3" size="3">
										Composable
									</Heading>
									<Text as="p" size="3" color="gray">
										Granular access to each component part.
									</Text>
								</Box>

								<Theme asChild appearance="dark">{target => target(CodeBlock.Root, {
                  get "style"() {
                    return codeBlockRootStyles;
                  },
                  children: <>
										<CodeBlock.Content>
											<CodeBlock.Pre>
												<CodeBlock.Code language="tsx">{code.customizable}</CodeBlock.Code>
											</CodeBlock.Pre>
										</CodeBlock.Content>
									</>
                })}</Theme>

								<Box>
									<Heading as="h3" size="3">
										Customizable
									</Heading>
									<Text as="p" size="3" color="gray">
										Configure behavior, control focus, add event listeners.
									</Text>
								</Box>

								<Theme asChild appearance="dark">{target => target(CodeBlock.Root, {
                  get "style"() {
                    return codeBlockRootStyles;
                  },
                  children: <>
										<CodeBlock.Content>
											<CodeBlock.Pre>
												<CodeBlock.Code language="tsx">{code.consistent}</CodeBlock.Code>
											</CodeBlock.Pre>
										</CodeBlock.Content>
									</>
                })}</Theme>

								<Box>
									<Heading as="h3" size="3">
										Consistent
									</Heading>
									<Text as="p" size="3" color="gray">
										Components with similar functionality share similar API.
									</Text>
								</Box>
								<Box />
							</Grid>
						</HiddenScroll>

						<Flex gap="1" direction="column" ml="-3" display={{
            initial: "none",
            md: "flex"
          }}>
							<Card asChild aria-pressed={activeLines() === Highlights.Unstyled ? "true" : "false"} onMouseDown={() => setActiveLines(Highlights.Unstyled)} onClick={() => setActiveLines(Highlights.Unstyled)} variant="ghost" style={{
              "margin": 0 as const,
              "background-color": activeLines() === Highlights.Unstyled ? "var(--gray-a3)" : undefined
            }}>{target => target("button", {
                children: <>
									<Heading as="h3" size="3">
										Unstyled
									</Heading>
									<Text as="p" size="3" color="gray">
										No need to override styles, no specificity wars.
									</Text>
								</>
              })}</Card>

							<Card asChild aria-pressed={activeLines() === Highlights.Composable ? "true" : "false"} onMouseDown={() => setActiveLines(Highlights.Composable)} onClick={() => setActiveLines(Highlights.Composable)} variant="ghost" style={{
              "margin": 0 as const,
              "background-color": activeLines() === Highlights.Composable ? "var(--gray-a3)" : undefined
            }}>{target => target("button", {
                children: <>
									<Heading as="h3" size="3">
										Composable
									</Heading>
									<Text as="p" size="3" color="gray">
										Granular access to each component part.
									</Text>
								</>
              })}</Card>

							<Card asChild aria-pressed={activeLines() === Highlights.Customizable ? "true" : "false"} onMouseDown={() => setActiveLines(Highlights.Customizable)} onClick={() => setActiveLines(Highlights.Customizable)} variant="ghost" style={{
              "margin": 0 as const,
              "background-color": activeLines() === Highlights.Customizable ? "var(--gray-a3)" : undefined
            }}>{target => target("button", {
                children: <>
									<Heading as="h3" size="3">
										Customizable
									</Heading>
									<Text as="p" size="3" color="gray">
										Configure behavior, control focus, add event listeners.
									</Text>
								</>
              })}</Card>

							<Card asChild aria-pressed={activeLines() === Highlights.Consistent ? "true" : "false"} onMouseDown={() => setActiveLines(Highlights.Consistent)} onClick={() => setActiveLines(Highlights.Consistent)} variant="ghost" style={{
              "margin": 0 as const,
              "background-color": activeLines() === Highlights.Consistent ? "var(--gray-a3)" : undefined
            }}>{target => target("button", {
                children: <>
									<Heading as="h3" size="3">
										Consistent
									</Heading>
									<Text as="p" size="3" color="gray">
										Components with similar functionality share similar API.
									</Text>
								</>
              })}</Card>
						</Flex>
					</Box>

					<Box display={{
          initial: "none",
          md: "block"
        }} position="relative" minWidth="480px" minHeight="602px">
						<Theme asChild appearance="dark">{target => target(CodeBlock.Root, {
              get "style"() {
                return mergeStyles(codeBlockRootStyles, {
                  "position": "absolute",
                  "inset": 0 as const,
                  "padding-top": "var(--space-6)",
                  "box-shadow": "0 50px 100px -50px hsl(254 100% 6% / 0.7)"
                });
              },
              children: <>
								<Box position="absolute" top="10px" left="10px">
									<WindowControlButtons />
								</Box>

								<Box position="absolute" top="0" left="0" right="0">
									<WindowTitle />
								</Box>

								<CodeBlock.Content>
									<CodeBlock.Pre ref={setPreRef} overflow="hidden" data-marketing-code="true">
										<CodeBlock.Code language="tsx" invertLineHighlight style={codeBlockCodeStyles}>
											{allCode}
										</CodeBlock.Code>
									</CodeBlock.Pre>
								</CodeBlock.Content>
							</>
            })}</Theme>
					</Box>
				</Grid>
			</Container>
		</Section>;
};
const codeBlockRootStyles = {
  "--code-block-background": "var(--developer-experience-code-block-background)",
  "--code-block-border": "transparent",
  "--code-block-radius": "var(--radius-5)",
  "--scrollarea-scrollbar-vertical-margin-top": "var(--space-2)",
  "--scrollarea-scrollbar-vertical-margin-bottom": "var(--space-2)"
} as JSX.CSSProperties;
const codeBlockCodeStyles = {
  display: "block",
  transition: "transform 200ms ease-in-out",
  "will-change": "transform"
};
const WindowControlButtons = () => <Box width="52px" height="12px" style={{
  "background": `
				radial-gradient(circle closest-side at 6px, var(--gray-a7) 90%, #FFFFFF00),
				radial-gradient(circle closest-side at 24px, var(--gray-a7) 90%, #FFFFFF00),
				radial-gradient(circle closest-side at 42px, var(--gray-a7) 90%, #FFFFFF00)`
}} />;
const WindowTitle = () => <Flex align="center" justify="center" height="32px">
		<Text size="1" style={{
    "color": "var(--slate-a9)",
    "user-select": "none"
  }}>
			MyComponent.jsx
		</Text>
	</Flex>;
const code = {
  unstyled: "// Add styles with your preferred CSS technology\nimport type { ComponentProps } from 'solid-js';\nimport { Tooltip, Popover, Dialog } from '@wsagency/radix2solid-primitives';\n\nconst TooltipContent = (props: ComponentProps<typeof Tooltip.Content>) =>\n  <Tooltip.Content {...props} class=\"TooltipContent\" />;\nconst PopoverContent = (props: ComponentProps<typeof Popover.Content>) =>\n  <Popover.Content {...props} class=\"PopoverContent\" />;\nconst DialogContent = (props: ComponentProps<typeof Dialog.Content>) =>\n  <Dialog.Content {...props} class=\"DialogContent\" />;",
  composable: "// Compose a custom Tooltip component\nexport const StatusTooltip = (props: { state: string; label: string }) => (\n  <Tooltip.Root>\n    <Tooltip.Trigger asChild>\n      {target => target('button', { children: props.state })}\n    </Tooltip.Trigger>\n    <Tooltip.Portal>\n      <TooltipContent>\n        <Tooltip.Arrow />\n        {props.label}\n      </TooltipContent>\n    </Tooltip.Portal>\n  </Tooltip.Root>\n);",
  customizable: "// Compose a Popover with custom focus and positioning\nimport { createSignal, type Element } from 'solid-js';\nexport const StatusPopover = (props: { children: Element }) => {\n  const [closeButton, setCloseButton] = createSignal<HTMLButtonElement>();\n  return <Popover.Root>\n    <Popover.Trigger>View status</Popover.Trigger>\n    <Popover.Portal>\n      <PopoverContent align=\"start\" collisionPadding={10}\n        aria-label=\"Status\" aria-describedby={undefined}\n        onOpenAutoFocus={event => {\n          closeButton()?.focus();\n          event.preventDefault();\n        }}>\n        {props.children}\n        <Popover.Close ref={setCloseButton}>Close</Popover.Close>\n      </PopoverContent>\n    </Popover.Portal>\n  </Popover.Root>;\n};",
  consistent: "// Compose a Dialog with custom focus management\nexport const InfoDialog = (props: { children: Element }) => {\n  const [closeButton, setCloseButton] = createSignal<HTMLButtonElement>();\n  return <Dialog.Root>\n    <Dialog.Trigger>View details</Dialog.Trigger>\n    <Dialog.Portal>\n      <Dialog.Overlay />\n      <DialogContent onOpenAutoFocus={event => {\n        closeButton()?.focus();\n        event.preventDefault();\n      }}>\n        <Dialog.Title>Details</Dialog.Title>\n        <Dialog.Description>Information about this item.</Dialog.Description>\n        {props.children}\n        <Dialog.Close ref={setCloseButton}>Close</Dialog.Close>\n      </DialogContent>\n    </Dialog.Portal>\n  </Dialog.Root>;\n};"
};
const allCode = [code.unstyled, code.composable, code.customizable, code.consistent].join("\n\n");
