import { Tooltip } from "@radix-solid/primitives";
import { PlusIcon } from "@radix-solid/icons";
import "./styles.css";
const TooltipDemo = () => {
  return <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{target => target("button", {
          "class": "IconButton",
          children: <>
						<PlusIcon />
					</>
        })}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content class="TooltipContent" sideOffset={5}>
						Add to library
						<Tooltip.Arrow class="TooltipArrow" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>;
};
export default TooltipDemo;