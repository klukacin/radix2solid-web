import { createSignal } from "solid-js";
import { ContextMenu } from "@radix-solid/primitives";
import { DotFilledIcon, CheckIcon, ChevronRightIcon } from "@radix-solid/icons";
import styles from "./styles.module.css";
const ContextMenuDemo = () => {
  const [bookmarksChecked, setBookmarksChecked] = createSignal(true);
  const [urlsChecked, setUrlsChecked] = createSignal(false);
  const [person, setPerson] = createSignal("pedro");
  return <ContextMenu.Root>
			<ContextMenu.Trigger class={styles.Trigger}>
				Right-click here.
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content class={styles.Content} sideOffset={5} align="end">
					<ContextMenu.Item class={styles.Item}>
						Back <div class={styles.RightSlot}>⌘+[</div>
					</ContextMenu.Item>
					<ContextMenu.Item class={styles.Item} disabled>
						Forward <div class={styles.RightSlot}>⌘+]</div>
					</ContextMenu.Item>
					<ContextMenu.Item class={styles.Item}>
						Reload <div class={styles.RightSlot}>⌘+R</div>
					</ContextMenu.Item>
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger class={styles.SubTrigger}>
							More Tools
							<div class={styles.RightSlot}>
								<ChevronRightIcon />
							</div>
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class={styles.SubContent} sideOffset={2} alignOffset={-5}>
								<ContextMenu.Item class={styles.Item}>
									Save Page As… <div class={styles.RightSlot}>⌘+S</div>
								</ContextMenu.Item>
								<ContextMenu.Item class={styles.Item}>
									Create Shortcut…
								</ContextMenu.Item>
								<ContextMenu.Item class={styles.Item}>
									Name Window…
								</ContextMenu.Item>
								<ContextMenu.Separator class={styles.Separator} />
								<ContextMenu.Item class={styles.Item}>
									Developer Tools
								</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>

					<ContextMenu.Separator class={styles.Separator} />

					<ContextMenu.CheckboxItem class={styles.CheckboxItem} checked={bookmarksChecked()} onCheckedChange={setBookmarksChecked}>
						<ContextMenu.ItemIndicator class={styles.ItemIndicator}>
							<CheckIcon />
						</ContextMenu.ItemIndicator>
						Show Bookmarks <div class={styles.RightSlot}>⌘+B</div>
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem class={styles.CheckboxItem} checked={urlsChecked()} onCheckedChange={setUrlsChecked}>
						<ContextMenu.ItemIndicator class={styles.ItemIndicator}>
							<CheckIcon />
						</ContextMenu.ItemIndicator>
						Show Full URLs
					</ContextMenu.CheckboxItem>

					<ContextMenu.Separator class={styles.Separator} />

					<ContextMenu.Label class={styles.Label}>People</ContextMenu.Label>
					<ContextMenu.RadioGroup value={person()} onValueChange={setPerson}>
						<ContextMenu.RadioItem class={styles.RadioItem} value="pedro">
							<ContextMenu.ItemIndicator class={styles.ItemIndicator}>
								<DotFilledIcon />
							</ContextMenu.ItemIndicator>
							Pedro Duarte
						</ContextMenu.RadioItem>
						<ContextMenu.RadioItem class={styles.RadioItem} value="colm">
							<ContextMenu.ItemIndicator class={styles.ItemIndicator}>
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