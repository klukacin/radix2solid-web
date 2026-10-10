import { Tooltip } from "@radix-solid/primitives";
import { PlusIcon } from "@radix-solid/icons";
const TooltipDemo = () => {
  return <Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{target => target("button", {
          "class": "inline-flex size-[35px] items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black",
          children: <>
						<PlusIcon />
					</>
        })}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content class="select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade" sideOffset={5}>
						Add to library
						<Tooltip.Arrow class="fill-white" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>;
};
export default TooltipDemo;