import { Popover } from "@wsagency/radix2solid-primitives";
import { MixerHorizontalIcon, Cross2Icon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const PopoverDemo = () => <Popover.Root>
		<Popover.Trigger asChild>{target => target("button", {
      "class": styles.IconButton,
      "aria-label": "Update dimensions",
      children: <>
				<MixerHorizontalIcon />
			</>
    })}</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content class={styles.Content} sideOffset={5} aria-label="Dimensions" aria-describedby={undefined}>
				<div style={{
        "display": "flex",
        "flex-direction": "column",
        "gap": "10px"
      }}>
					<p class={styles.Text} style={{
          "margin-bottom": "10px"
        }}>
						Dimensions
					</p>
					<fieldset class={styles.Fieldset}>
						<label class={styles.Label} for="width">
							Width
						</label>
						<input class={styles.Input} id="width" defaultValue="100%" />
					</fieldset>
					<fieldset class={styles.Fieldset}>
						<label class={styles.Label} for="maxWidth">
							Max. width
						</label>
						<input class={styles.Input} id="maxWidth" defaultValue="300px" />
					</fieldset>
					<fieldset class={styles.Fieldset}>
						<label class={styles.Label} for="height">
							Height
						</label>
						<input class={styles.Input} id="height" defaultValue="25px" />
					</fieldset>
					<fieldset class={styles.Fieldset}>
						<label class={styles.Label} for="maxHeight">
							Max. height
						</label>
						<input class={styles.Input} id="maxHeight" defaultValue="none" />
					</fieldset>
				</div>
				<Popover.Close class={styles.Close} aria-label="Close">
					<Cross2Icon />
				</Popover.Close>
				<Popover.Arrow class={styles.Arrow} />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>;
export default PopoverDemo;