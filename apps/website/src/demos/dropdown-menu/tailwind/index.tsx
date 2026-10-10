import { createSignal } from "solid-js";
import { DropdownMenu } from "@radix-solid/primitives";
import { HamburgerMenuIcon, DotFilledIcon, CheckIcon, ChevronRightIcon } from "@radix-solid/icons";
const DropdownMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");
  return <DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{target => target("button", {
        "class": "inline-flex size-[35px] items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black",
        "aria-label": "Customise options",
        children: <>
					<HamburgerMenuIcon />
				</>
      })}</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content class="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade" sideOffset={5}>
					<DropdownMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
						New Tab{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+T
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
						New Window{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+N
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" disabled>
						New Private Window{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⇧+⌘+N
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:data-[state=open]:bg-violet9 data-[state=open]:bg-violet4 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
							More Tools
							<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
								<ChevronRightIcon />
							</div>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent class="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade" sideOffset={2} alignOffset={-5}>
								<DropdownMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Save Page As…{" "}
									<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
										⌘+S
									</div>
								</DropdownMenu.Item>
								<DropdownMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Create Shortcut…
								</DropdownMenu.Item>
								<DropdownMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Name Window…
								</DropdownMenu.Item>
								<DropdownMenu.Separator class="m-[5px] h-px bg-violet6" />
								<DropdownMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Developer Tools
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>

					<DropdownMenu.Separator class="m-[5px] h-px bg-violet6" />

					<DropdownMenu.CheckboxItem class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" checked={bookmarksChecked()} onCheckedChange={setBookmarksChecked}>
						<DropdownMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
							<CheckIcon />
						</DropdownMenu.ItemIndicator>
						Show Bookmarks{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+B
						</div>
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" checked={urlsChecked()} onCheckedChange={setUrlsChecked}>
						<DropdownMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
							<CheckIcon />
						</DropdownMenu.ItemIndicator>
						Show Full URLs
					</DropdownMenu.CheckboxItem>

					<DropdownMenu.Separator class="m-[5px] h-px bg-violet6" />

					<DropdownMenu.Label class="pl-[25px] text-xs leading-[25px] text-mauve11">
						People
					</DropdownMenu.Label>
					<DropdownMenu.RadioGroup value={person()} onValueChange={setPerson}>
						<DropdownMenu.RadioItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" value="pedro">
							<DropdownMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Pedro Duarte
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" value="colm">
							<DropdownMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Colm Tuite
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>

					<DropdownMenu.Arrow class="fill-white" />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>;
};
export default DropdownMenuDemo;