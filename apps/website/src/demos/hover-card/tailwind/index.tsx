import { HoverCard } from "@wsagency/radix2solid-primitives";
const HoverCardDemo = () => <HoverCard.Root>
		<HoverCard.Trigger asChild>{target => target("a", {
      "class": "inline-block cursor-pointer rounded-full shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none focus:shadow-[0_0_0_2px_white]",
      "href": "https://twitter.com/radix_ui",
      "target": "_blank",
      "rel": "noreferrer noopener",
      children: <>
				<img class="block size-[45px] rounded-full" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35' fill='%231C2024'%3E%3Cpath d='M17 35C10.3726 35 5 30.0751 5 24C5 17.9249 10.3726 13 17 13L17 35Z'/%3E%3Crect x='5' width='12' height='12'/%3E%3Ccircle cx='24' cy='6' r='6'/%3E%3C/svg%3E" alt="Radix UI" />
			</>
    })}</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content class="w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all" sideOffset={5}>
				<div class="flex flex-col gap-[7px]">
					<img class="block size-[60px] rounded-full" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35' fill='%231C2024'%3E%3Cpath d='M17 35C10.3726 35 5 30.0751 5 24C5 17.9249 10.3726 13 17 13L17 35Z'/%3E%3Crect x='5' width='12' height='12'/%3E%3Ccircle cx='24' cy='6' r='6'/%3E%3C/svg%3E" alt="Radix UI" />
					<div class="flex flex-col gap-[15px]">
						<div>
							<div class="m-0 text-[15px] font-medium text-mauve12">
								Radix
							</div>
							<div class="m-0 text-[15px] text-mauve10">@radix_ui</div>
						</div>
						<div class="m-0 text-[15px] text-mauve12">
							Components, icons, colors, and templates for building
							high-quality, accessible UI. Free and open-source.
						</div>
						<div class="flex gap-[15px]">
							<div class="flex gap-[5px]">
								<div class="m-0 text-[15px] font-medium text-mauve12">
									0
								</div>{" "}
								<div class="m-0 text-[15px] text-mauve10">Following</div>
							</div>
							<div class="flex gap-[5px]">
								<div class="m-0 text-[15px] font-medium text-mauve12">
									2,900
								</div>{" "}
								<div class="m-0 text-[15px] text-mauve10">Followers</div>
							</div>
						</div>
					</div>
				</div>

				<HoverCard.Arrow class="fill-white" />
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>;
export default HoverCardDemo;