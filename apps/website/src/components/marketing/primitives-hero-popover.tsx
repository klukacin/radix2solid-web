
import { createSignal } from "solid-js";
import { Popover as PopoverPrimitive } from "@wsagency/radix2solid-primitives";
import { styled } from "../../utils/css";
import { PrimitivesHeroButton } from "../marketing/primitives-hero-button";
import { Cross2Icon } from "@wsagency/radix2solid-icons";
import { Flex, IconButton, Text, TextField, Grid, Box } from "@wsagency/radix2solid-themes";
import styles from "./primitives-hero-popover.module.css";
const PopoverContentWrapper = styled("div", styles.ContentWrapper);
export function PrimitivesHeroPopover() {
  // The initially open demo must not take focus; user reopens use native autofocus.
  let userOpened = false;
  const [contentRef, setContentRef] = createSignal<HTMLDivElement | null | null>(null);
  const [open, setOpen] = createSignal(true);
  return <PopoverPrimitive.Root modal={false} open={open()} onOpenChange={value => { userOpened = value; setOpen(value); }}>
			<Box style={{
      "margin-bottom": "120px"
    }}>
				<PopoverPrimitive.Trigger asChild>{target => target(PrimitivesHeroButton, {
          children: <>Dimensions</>
        })}</PopoverPrimitive.Trigger>
			</Box>

			<PopoverContentWrapper>
				<PopoverPrimitive.Content ref={setContentRef} side="bottom" sideOffset={5} avoidCollisions={false} style={{
        "position": "relative",
        "width": "200px",
        "background-color": "var(--color-panel-solid)",
        "border-radius": "var(--radius-3)",
        "padding": "10px",
        "box-shadow": "0 0 0 1px var(--gray-a3), var(--shadow-4)"
      }} onInteractOutside={event => event.preventDefault()} onEscapeKeyDown={event => {
        event.preventDefault();
        if (event.target instanceof HTMLElement && contentRef()?.contains(event.target)) {
          setOpen(false);
        }
      }} onOpenAutoFocus={event => {
        if (!userOpened) event.preventDefault();
      }} aria-label="Dimensions" aria-describedby={undefined}>
					<PopoverPrimitive.Arrow fill="var(--color-panel-solid)" />

					<Text as="div" size="3" weight="bold" mb="2">
						Dimensions
					</Text>

					<Grid align="center" columns="auto 100px" gapX="5" gapY="2">
						<Text size="1">Width</Text>
						<TextField.Root size="1" defaultValue="100%" aria-label="Width" />
						<Text size="1">Height</Text>
						<TextField.Root size="1" defaultValue="20vh" aria-label="Height" />
						<Text size="1">Margin</Text>
						<TextField.Root size="1" defaultValue="0" aria-label="Margin" />
						<Text size="1">Padding</Text>
						<TextField.Root size="1" defaultValue="10%" aria-label="Padding" />
					</Grid>

					<Flex position="absolute" top="0" right="0" m="2">
						<PopoverPrimitive.Close asChild>{target => target(IconButton, {
              "size": "1",
              "color": "gray",
              "variant": "ghost",
              "highContrast": true,
              "aria-label": "Close dimensions",
              children: <>
								<Cross2Icon />
							</>
            })}</PopoverPrimitive.Close>
					</Flex>
				</PopoverPrimitive.Content>
			</PopoverContentWrapper>
		</PopoverPrimitive.Root>;
}
