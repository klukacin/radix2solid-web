import { createSignal } from "solid-js";
import { Collapsible } from "@wsagency/radix2solid-primitives";
import { RowSpacingIcon, Cross2Icon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const CollapsibleDemo = () => {
  const [open, setOpen] = createSignal(false);
  return <Collapsible.Root class={styles.Root} open={open()} onOpenChange={setOpen}>
			<div style={{
      "display": "flex",
      "align-items": "center",
      "justify-content": "space-between"
    }}>
				<span class={styles.Text} style={{
        "color": "white"
      }}>
					@peduarte starred 3 repositories
				</span>
				<Collapsible.Trigger asChild>{target => target("button", {
          "class": styles.IconButton,
          children: <>
						{open() ? <Cross2Icon /> : <RowSpacingIcon />}
					</>
        })}</Collapsible.Trigger>
			</div>

			<div class={styles.Repository}>
				<span class={styles.Text}>@radix-ui/primitives</span>
			</div>

			<Collapsible.Content>
				<div class={styles.Repository}>
					<span class={styles.Text}>@radix-ui/colors</span>
				</div>
				<div class={styles.Repository}>
					<span class={styles.Text}>@radix-ui/themes</span>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>;
};
export default CollapsibleDemo;