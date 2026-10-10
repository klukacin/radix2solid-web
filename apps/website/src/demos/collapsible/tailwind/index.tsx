import { createSignal } from "solid-js";
import { Collapsible } from "@radix-solid/primitives";
import { RowSpacingIcon, Cross2Icon } from "@radix-solid/icons";
const CollapsibleDemo = () => {
  const [open, setOpen] = createSignal(false);
  return <Collapsible.Root class="w-[300px]" open={open()} onOpenChange={setOpen}>
			<div class="flex items-center justify-between">
				<span class=" text-[15px] leading-[25px] text-white">
					@peduarte starred 3 repositories
				</span>
				<Collapsible.Trigger asChild>{target => target("button", {
          "class": "inline-flex size-[25px] items-center justify-center rounded-full text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=closed]:bg-white data-[state=open]:bg-violet3",
          children: <>
						{open() ? <Cross2Icon /> : <RowSpacingIcon />}
					</>
        })}</Collapsible.Trigger>
			</div>

			<div class="my-2.5 rounded bg-white p-2.5 shadow-[0_2px_10px] shadow-blackA4">
				<span class="text-[15px] leading-[25px] text-violet11">
					@radix-ui/primitives
				</span>
			</div>

			<Collapsible.Content>
				<div class="my-2.5 rounded bg-white p-2.5 shadow-[0_2px_10px] shadow-blackA4">
					<span class="text-[15px] leading-[25px] text-violet11">
						@radix-ui/colors
					</span>
				</div>
				<div class="my-2.5 rounded bg-white p-2.5 shadow-[0_2px_10px] shadow-blackA4">
					<span class="text-[15px] leading-[25px] text-violet11">
						@radix-ui/themes
					</span>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>;
};
export default CollapsibleDemo;