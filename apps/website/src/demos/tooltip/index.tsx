import { Tooltip } from "@wsagency/radix2solid-primitives";
import { PlusIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const TooltipDemo = () => {
  return <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{target => target("button", {
          "class": styles.IconButton,
          children: <>
						<PlusIcon />
					</>
        })}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content class={styles.Content} sideOffset={5}>
						Add to library
						<Tooltip.Arrow class={styles.Arrow} />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>;
};
export default TooltipDemo;