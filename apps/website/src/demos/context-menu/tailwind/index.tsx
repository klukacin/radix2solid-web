import { createSignal } from "solid-js";
import { ContextMenu } from "@wsagency/radix2solid-primitives";
import { DotFilledIcon, CheckIcon, ChevronRightIcon } from "@wsagency/radix2solid-icons";
const ContextMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");
  return <ContextMenu.Root>
			<ContextMenu.Trigger class="block w-[300px] select-none rounded border-2 border-dashed border-white py-[45px] text-center text-[15px] text-white">
				Right-click here.
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content class="min-w-[220px] overflow-hidden rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]" sideOffset={5} align="end">
					<ContextMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
						Back{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+[
						</div>
					</ContextMenu.Item>
					<ContextMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" disabled>
						Forward{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+]
						</div>
					</ContextMenu.Item>
					<ContextMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
						Reload{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+R
						</div>
					</ContextMenu.Item>
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:data-[state=open]:bg-violet9 data-[state=open]:bg-violet4 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
							More Tools
							<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
								<ChevronRightIcon />
							</div>
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class="min-w-[220px] overflow-hidden rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]" sideOffset={2} alignOffset={-5}>
								<ContextMenu.Item class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Save Page As…{" "}
									<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
										⌘+S
									</div>
								</ContextMenu.Item>
								<ContextMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Create Shortcut…
								</ContextMenu.Item>
								<ContextMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Name Window…
								</ContextMenu.Item>
								<ContextMenu.Separator class="m-[5px] h-px bg-violet6" />
								<ContextMenu.Item class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
									Developer Tools
								</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>

					<ContextMenu.Separator class="m-[5px] h-px bg-violet6" />

					<ContextMenu.CheckboxItem class="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" checked={bookmarksChecked()} onCheckedChange={setBookmarksChecked}>
						<ContextMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
							<CheckIcon />
						</ContextMenu.ItemIndicator>
						Show Bookmarks{" "}
						<div class="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
							⌘+B
						</div>
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" checked={urlsChecked()} onCheckedChange={setUrlsChecked}>
						<ContextMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
							<CheckIcon />
						</ContextMenu.ItemIndicator>
						Show Full URLs
					</ContextMenu.CheckboxItem>

					<ContextMenu.Separator class="m-[5px] h-px bg-violet6" />

					<ContextMenu.Label class="pl-[25px] text-xs leading-[25px] text-mauve11">
						People
					</ContextMenu.Label>
					<ContextMenu.RadioGroup value={person()} onValueChange={setPerson}>
						<ContextMenu.RadioItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" value="pedro">
							<ContextMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
								<DotFilledIcon />
							</ContextMenu.ItemIndicator>
							Pedro Duarte
						</ContextMenu.RadioItem>
						<ContextMenu.RadioItem class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1" value="colm">
							<ContextMenu.ItemIndicator class="absolute left-0 inline-flex w-[25px] items-center justify-center">
								<DotFilledIcon />
							</ContextMenu.ItemIndicator>
							Colm Tuite
						</ContextMenu.RadioItem>
					</ContextMenu.RadioGroup>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>;
};
export default ContextMenuDemo;