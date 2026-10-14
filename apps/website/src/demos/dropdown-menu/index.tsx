import { createSignal } from "solid-js";
import { DropdownMenu } from "@wsagency/radix2solid-primitives";
import { HamburgerMenuIcon, DotFilledIcon, CheckIcon, ChevronRightIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const DropdownMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");
  return <DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>{target => target("button", {
        "class": styles.IconButton,
        "aria-label": "Customise options",
        children: <>
					<HamburgerMenuIcon />
				</>
      })}</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content class={styles.Content} sideOffset={5}>
					<DropdownMenu.Item class={styles.Item}>
						New Tab <div class={styles.RightSlot}>⌘+T</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item class={styles.Item}>
						New Window <div class={styles.RightSlot}>⌘+N</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item class={styles.Item} disabled>
						New Private Window <div class={styles.RightSlot}>⇧+⌘+N</div>
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger class={styles.SubTrigger}>
							More Tools
							<div class={styles.RightSlot}>
								<ChevronRightIcon />
							</div>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent class={styles.SubContent} sideOffset={2} alignOffset={-5}>
								<DropdownMenu.Item class={styles.Item}>
									Save Page As… <div class={styles.RightSlot}>⌘+S</div>
								</DropdownMenu.Item>
								<DropdownMenu.Item class={styles.Item}>
									Create Shortcut…
								</DropdownMenu.Item>
								<DropdownMenu.Item class={styles.Item}>
									Name Window…
								</DropdownMenu.Item>
								<DropdownMenu.Separator class={styles.Separator} />
								<DropdownMenu.Item class={styles.Item}>
									Developer Tools
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>

					<DropdownMenu.Separator class={styles.Separator} />

					<DropdownMenu.CheckboxItem class={styles.CheckboxItem} checked={bookmarksChecked()} onCheckedChange={setBookmarksChecked}>
						<DropdownMenu.ItemIndicator class={styles.ItemIndicator}>
							<CheckIcon />
						</DropdownMenu.ItemIndicator>
						Show Bookmarks <div class={styles.RightSlot}>⌘+B</div>
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem class={styles.CheckboxItem} checked={urlsChecked()} onCheckedChange={setUrlsChecked}>
						<DropdownMenu.ItemIndicator class={styles.ItemIndicator}>
							<CheckIcon />
						</DropdownMenu.ItemIndicator>
						Show Full URLs
					</DropdownMenu.CheckboxItem>

					<DropdownMenu.Separator class={styles.Separator} />

					<DropdownMenu.Label class={styles.Label}>
						People
					</DropdownMenu.Label>
					<DropdownMenu.RadioGroup value={person()} onValueChange={setPerson}>
						<DropdownMenu.RadioItem class={styles.RadioItem} value="pedro">
							<DropdownMenu.ItemIndicator class={styles.ItemIndicator}>
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Pedro Duarte
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem class={styles.RadioItem} value="colm">
							<DropdownMenu.ItemIndicator class={styles.ItemIndicator}>
								<DotFilledIcon />
							</DropdownMenu.ItemIndicator>
							Colm Tuite
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>

					<DropdownMenu.Arrow class={styles.Arrow} />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>;
};
export default DropdownMenuDemo;