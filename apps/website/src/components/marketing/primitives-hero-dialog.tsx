
import { Dialog as DialogPrimitive, Label } from "@wsagency/radix2solid-primitives";
import { Cross2Icon } from "@wsagency/radix2solid-icons";
import { Flex, TextField, Text, IconButton, Box } from "@wsagency/radix2solid-themes";
import { PrimitivesHeroButton } from "./primitives-hero-button";
export function PrimitivesHeroDialog() {
  // The initially open demo must not take focus; user reopens use native autofocus.
  let userOpened = false;
  return <DialogPrimitive.Root modal={false} defaultOpen onOpenChange={value => { userOpened = value; }}>
			<DialogPrimitive.Trigger asChild>{target => target(PrimitivesHeroButton, {
        children: <>Edit Profile</>
      })}</DialogPrimitive.Trigger>

			<DialogPrimitive.Content aria-describedby={undefined} style={{
      "outline": 0 as const,
      "position": "absolute",
      "top": "50%",
      "left": "50%",
      "transform": "translate(-50%, -50%)",
      "width": "70%",
      "background-color": "var(--color-panel-solid)",
      "border-radius": "var(--radius-3)",
      "padding": "var(--space-3)",
      "margin-top": "calc(var(--space-4) * -1)",
      "box-shadow": "0 0 0 1px var(--gray-a3), var(--shadow-4)"
    }} onInteractOutside={event => event.preventDefault()} onOpenAutoFocus={event => {
      if (!userOpened) event.preventDefault();
    }}>
				<DialogPrimitive.Title asChild>{target => target(Text, {
          "as": "div",
          "size": "3",
          "weight": "bold",
          "mb": "2",
          children: <>
						Edit Profile
					</>
        })}</DialogPrimitive.Title>

				<Flex mb="2" direction="column">
					<Label.Root>
						<Box mb="1">
							<Text size="1" color="gray">
								Name
							</Text>
						</Box>
						<TextField.Root size="1" id="primitives-hero-dialog-name" defaultValue="Pedro Duarte" />
					</Label.Root>
				</Flex>

				<Flex mb="4" direction="column">
					<Label.Root>
						<Box mb="1">
							<Text size="1" color="gray">
								Username
							</Text>
						</Box>
						<TextField.Root size="1" id="primitives-hero-dialog-username" defaultValue="@peduarte" />
					</Label.Root>
				</Flex>

				<Flex justify="end" gap="2">
					<DialogPrimitive.Close asChild>{target => target(PrimitivesHeroButton, {
            "variant": "gray",
            children: <>Save</>
          })}</DialogPrimitive.Close>
				</Flex>

				<Flex position="absolute" top="0" right="0" m="2">
					<DialogPrimitive.Close asChild>{target => target(IconButton, {
            "size": "1",
            "color": "gray",
            "variant": "ghost",
            "highContrast": true,
            "aria-label": "Close profile editor",
            children: <>
							<Cross2Icon />
						</>
          })}</DialogPrimitive.Close>
				</Flex>
			</DialogPrimitive.Content>
		</DialogPrimitive.Root>;
}
