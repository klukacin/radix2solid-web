import type { JSX } from "@solidjs/web";
import { mergeStyles } from "@radix-solid/themes/helpers";
import { omit, createSignal } from "solid-js";
import { SwatchCopyButton as CopyButton } from './swatch-copy-button';
import { VisuallyHidden, Popover, Box, Heading, Theme, Button, Separator, Grid, Text, Tooltip, Flex, AccessibleIcon, IconButton, Dialog, Reset } from "@radix-solid/themes";
import styles from "./custom-swatch.module.css";
import { useSiteContext } from "./site-context";
import { Cross2Icon, InfoCircledIcon } from "@radix-solid/icons";
const brightColors = ["amber", "yellow", "lime", "mint", "sky"];
type CustomSwatchProps = JSX.IntrinsicElements["button"] & {
  scale: string;
  step: string;
  cssVariable: string;
  hex: string;
  hexA: string;
  p3: string;
  p3A: string;
};
export const CustomSwatch = (p: CustomSwatchProps) => {
  const [contentRef, setContentRef] = createSignal<HTMLDivElement | null | null>(null);
  const _site = useSiteContext();
  const friendlyScaleName = () => `${p.scale.charAt(0).toUpperCase() + p.scale.slice(1)}`;
  const friendlyColorName = () => `${friendlyScaleName()} ${p.step}`;
  const otherTheme = () => _site.resolvedTheme === "light" ? "dark" : "light";
  const isGray = () => ["gray", "mauve", "slate", "sage", "olive", "sand"].includes(p.scale);
  return <Dialog.Root>
			<Dialog.Trigger>{target => target(Reset, {
        children: target => target("button", {
          get "class"() {
            return [styles.CustomSwatchTrigger, styles.CustomSwatchTransparencyGrid];
          },
          ...omit(p, "scale", "step", "cssVariable", "hex", "hexA", "p3", "p3A", "style"),
          children: <>
						<span style={mergeStyles({
              "background-color": p.cssVariable
            }, p.style)}>
							<VisuallyHidden>
								{p.scale} {p.step}
							</VisuallyHidden>
						</span>
					</>
        })
      })}</Dialog.Trigger>

			<Theme accentColor="gray" class="radix-themes-custom-fonts" asChild>{target => target(Dialog.Content, {
        get "ref"() {
          return setContentRef;
        },
        "size": "1",
        get "class"() {
          return styles.CustomSwatchContent;
        },
        "onOpenAutoFocus": event => {
          event.preventDefault();
          contentRef()?.focus();
        },
        children: <>
					<Box position="relative">
						<Box class={styles.CustomSwatchTransparencyGrid} height="240px">
							<Box style={{
                "width": "100%",
                "height": "100%",
                "background-color": p.cssVariable
              }} />
						</Box>

						<Dialog.Title as="h3" size="3" trim="both" my="4">
							{friendlyColorName()}
						</Dialog.Title>

						<Grid align="center" columns={{
              xs: "auto 1fr"
            }} gapY={{
              xs: "2"
            }} gapX="5">
							<Text color="gray" size="2">
								Usage
							</Text>
							<Box mb={{
                initial: "3",
                xs: "0"
              }}>
								<Text size="2">
									{["1", "2"].includes(p.step) && "Backgrounds"}
									{["3", "4", "5"].includes(p.step) && "Interactive components"}
									{["6", "7"].includes(p.step) && "Borders and separators"}
									{["8"].includes(p.step) && isGray() && "Borders, focus rings, disabled text"}
									{["8"].includes(p.step) && !isGray() && "Borders, focus rings"}
									{["9", "10"].includes(p.step) && isGray() && "Solid backgrounds, disabled text"}
									{["9", "10"].includes(p.step) && !isGray() && "Solid backgrounds, buttons"}
									{["11"].includes(p.step) && "Secondary text, links"}
									{["12"].includes(p.step) && "High-contrast text"}
								</Text>
							</Box>

							<Text color="gray" size="2">
								Pairs with
							</Text>
							<Box>
								<Text size="2">
									{["1", "2"].includes(p.step) && "Steps 11, 12 text"}
									{["3"].includes(p.step) && "Steps 11 labels, Step 12 text"}
									{["4"].includes(p.step) && "Steps 11, 12 labels"}
									{["5"].includes(p.step) && "Step 12 labels"}
									{["6", "7", "8"].includes(p.step) && "Steps 1–5 backgrounds"}
									{["9", "10"].includes(p.step) && (brightColors.includes(p.scale) ? "Dark text" : "White text")}
									{["11", "12"].includes(p.step) && "Background colors"}
								</Text>
							</Box>

							<Box style={{
                "grid-column": "1 / -1 "
              }} my={{
                initial: "4",
                xs: "1"
              }}>
								<Separator size="4" />
							</Box>

							<Text color="gray" size="2">
								Solid color
							</Text>

							<Flex mb={{
                initial: "3",
                xs: "0"
              }} height={{
                initial: "24px",
                xs: "16px"
              }} align="center">
								<CopyButton>{p.hex}</CopyButton>
							</Flex>

							<Flex align="center">
								<Text color="gray" size="2">
									Alpha color
								</Text>

								<Popover.Root modal>
									<Popover.Trigger>{target => target(IconButton, {
                      "size": "1",
                      "variant": "ghost",
                      get "style"() {
                        return {
                          "margin-left": "2px"
                        };
                      },
                      "aria-label": "Learn more about alpha colors",
                      children: <>
											<AccessibleIcon label="Learn more">{target => target(InfoCircledIcon, {})}</AccessibleIcon>
										</>
                    })}</Popover.Trigger>
									<Theme asChild class="radix-themes-custom-fonts">{target => target(Popover.Content, {
                      "side": "top",
                      "align": "center",
                      "aria-label": "Alpha colors",
                      get "style"() {
                        return {
                          "width": "380px"
                        };
                      },
                      children: <>
											<Heading size="2" mb="4" trim="both">
												Alpha colors
											</Heading>
											<Text as="p" size="2" trim="both" mb="4">
												Alpha color is a translucent color that achieves the same look against a
												neutral background. Alpha colors are used for elements that need to retain
												contrast when overlayed over different backgrounds
											</Text>
											<Text as="p" size="2" trim="both">
												Radix Colors alphas are designed against white background in light mode and
												Gray 1 in dark mode.
											</Text>
										</>
                    })}</Theme>
								</Popover.Root>
							</Flex>

							<Flex mb={{
                initial: "3",
                xs: "0"
              }} height={{
                initial: "24px",
                xs: "16px"
              }} align="center">
								<CopyButton>{p.hexA}</CopyButton>
							</Flex>

							<Text color="gray" size="2">
								P3 color
							</Text>
							<Flex mb={{
                initial: "3",
                xs: "0"
              }} height={{
                initial: "24px",
                xs: "16px"
              }} align="center">
								<CopyButton>{p.p3}</CopyButton>
							</Flex>

							<Text color="gray" size="2">
								P3 alpha
							</Text>
							<Flex height={{
                initial: "24px",
                xs: "16px"
              }} align="center">
								<CopyButton>{p.p3A}</CopyButton>
							</Flex>
						</Grid>

						<Theme asChild hasBackground={false} appearance={(() => {
              if (+p.step < 9) {
                return "inherit";
              }
              if (+p.step < 11) {
                const isBright = brightColors.includes(p.scale);
                return isBright ? "light" : "dark";
              }
              return otherTheme();
            })()}>{target => target(Box, {
                "position": "absolute",
                "m": "2",
                "top": "0",
                "right": "0",
                children: <>
								<Dialog.Close>{target => target(IconButton, {
                      "size": "1",
                      "highContrast": true,
                      "variant": "ghost",
                      "aria-label": "Close color details",
                      children: <>
										<Cross2Icon width="24" height="24" />
									</>
                    })}</Dialog.Close>
							</>
              })}</Theme>
					</Box>
				</>
      })}</Theme>
		</Dialog.Root>;
};