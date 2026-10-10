import { Popover } from "@radix-solid/primitives";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-solid/icons";
import "./styles.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger asChild>{target => target("button", {
      "class": "IconButton",
      "aria-label": "Update dimensions",
      children: <>
				<MixerHorizontalIcon />
			</>
    })}</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class="PopoverContent" sideOffset={5}>
				<div style={{
        "display": "flex",
        "flex-direction": "column",
        "gap": "10px"
      }}>
					<p class="Text" style={{
          "margin-bottom": "10px"
        }}>
						Dimensions
					</p>
					<fieldset class="Fieldset">
						<label class="Label" for="width">
							Width
						</label>
						<input class="Input" id="width" defaultValue="100%" />
					</fieldset>
					<fieldset class="Fieldset">
						<label class="Label" for="maxWidth">
							Max. width
						</label>
						<input class="Input" id="maxWidth" defaultValue="300px" />
					</fieldset>
					<fieldset class="Fieldset">
						<label class="Label" for="height">
							Height
						</label>
						<input class="Input" id="height" defaultValue="25px" />
					</fieldset>
					<fieldset class="Fieldset">
						<label class="Label" for="maxHeight">
							Max. height
						</label>
						<input class="Input" id="maxHeight" defaultValue="none" />
					</fieldset>
				</div>
				<Popover.Close class="PopoverClose" aria-label="Close">
					<Cross2Icon />
				</Popover.Close>
				<Popover.Arrow class="PopoverArrow" />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;