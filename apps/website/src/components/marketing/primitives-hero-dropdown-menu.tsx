
import { createSignal } from "solid-js";
import { DropdownMenu as DropdownMenuPrimitive } from "@wsagency/radix2solid-primitives";
import { CaretDownIcon, CaretRightIcon, CheckIcon, GitHubLogoIcon, TwitterLogoIcon } from "@wsagency/radix2solid-icons";
import { Box, Flex } from "@wsagency/radix2solid-themes";
import { PrimitivesHeroButton } from "../marketing/primitives-hero-button";
import styles from "./primitives-hero-dropdown-menu.module.css";
import { styled } from "../../utils/css";
const DropdownMenuArrow = styled(DropdownMenuPrimitive.Arrow, styles.Arrow);
const DropdownMenuContentWrapper = styled("div", styles.ContentWrapper);
const DropdownMenuContent = styled(DropdownMenuPrimitive.Content, styles.Content);
const DropdownMenuSeparator = styled(DropdownMenuPrimitive.Separator, styles.Separator);
const DropdownMenuItem = styled(DropdownMenuPrimitive.Item, styles.Item);
const DropdownMenuCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, styles.CheckboxItem);
const DropdownMenuSubTrigger = styled(DropdownMenuPrimitive.SubTrigger, styles.SubTrigger);
const DropdownMenuSubContent = styled(DropdownMenuPrimitive.SubContent, styles.SubContent);
export function PrimitivesHeroDropdownMenu() {
  // The initially open demo must not take focus; user reopens use native autofocus.
  let userOpened = false;
  const [showToolbar, setShowToolbar] = createSignal<boolean | "indeterminate">(true);
  const [showUrls, setShowUrls] = createSignal<boolean | "indeterminate">(false);
  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement | null>(null);
  const [contentRef, setContentRef] = createSignal<HTMLDivElement | null | null>(null);
  const [open, setOpen] = createSignal(true);
  return <DropdownMenuPrimitive.Root modal={false} open={open()} onOpenChange={value => { userOpened = value; setOpen(value); }}>
			<Box style={{
      "margin-bottom": "120px"
    }}>
				<DropdownMenuPrimitive.Trigger asChild>{target => target(PrimitivesHeroButton, {
          get "ref"() {
            return setTriggerRef;
          },
          children: <>
						Options <CaretDownIcon style={{
              "margin-right": "-3px"
            }} />
					</>
        })}</DropdownMenuPrimitive.Trigger>
			</Box>

			<DropdownMenuContentWrapper>
				<DropdownMenuContent ref={setContentRef} sideOffset={5} avoidCollisions={false} onEscapeKeyDown={event => {
        event.preventDefault();
        if (event.target instanceof HTMLElement && contentRef()?.contains(event.target)) {
          setOpen(false);
        }
      }} onInteractOutside={event => {
        if (event.target !== triggerRef()) {
          event.preventDefault();
        }
      }}
      onOpenAutoFocus={event => {
        if (!userOpened) event.preventDefault();
      }}>
					<DropdownMenuArrow />
					<DropdownMenuItem>New Tab</DropdownMenuItem>
					<DropdownMenuItem>New Window</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuPrimitive.Sub>
						<DropdownMenuSubTrigger>
							Favorites
							<CaretRightIcon style={{
              "margin-left": "auto",
              "margin-right": "-5px"
            }} />
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>
								<GitHubLogoIcon style={{
                "margin-left": "-15px",
                "margin-right": "10px"
              }} />
								GitHub
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Flex style={{
                "width": "15px",
                "height": "15px",
                "align-items": "center",
                "justify-content": "center",
                "margin-left": "-15px",
                "margin-right": "10px"
              }}>
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 25 25" fill="currentcolor">
										<path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z" />
										<path d="M12 0H4V8H12V0Z" />
										<path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z" />
									</svg>
								</Flex>
								Radix
							</DropdownMenuItem>
							<DropdownMenuItem>
								<TwitterLogoIcon style={{
                "margin-left": "-15px",
                "margin-right": "10px"
              }} />
								Twitter
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPrimitive.Sub>

					<DropdownMenuItem>Downloads</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem checked={showToolbar()} onCheckedChange={setShowToolbar}>
						<DropdownMenuPrimitive.ItemIndicator>
							<CheckIcon style={{
              "margin-left": "-18px",
              "margin-right": 0 as const
            }} />
						</DropdownMenuPrimitive.ItemIndicator>
						Show Toolbar
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={showUrls()} onCheckedChange={setShowUrls}>
						<DropdownMenuPrimitive.ItemIndicator>
							<CheckIcon style={{
              "margin-left": "-18px",
              "margin-right": 0 as const
            }} />
						</DropdownMenuPrimitive.ItemIndicator>
						Show Full URLs
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenuContentWrapper>
		</DropdownMenuPrimitive.Root>;
}
