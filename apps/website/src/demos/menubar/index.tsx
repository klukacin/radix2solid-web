import { createSignal } from "solid-js";
import { Menubar } from "@wsagency/radix2solid-primitives";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const RADIO_ITEMS = ["Andy", "Benoît", "Luis"];
const CHECK_ITEMS = ["Always Show Bookmarks Bar", "Always Show Full URLs"];
const MenubarDemo = () => {
  const [checkedSelection, setCheckedSelection] = createSignal([CHECK_ITEMS[1]]);
  const [radioSelection, setRadioSelection] = createSignal(RADIO_ITEMS[2]);
  return <Menubar.Root class={styles.Root}>
			<Menubar.Menu>
				<Menubar.Trigger class={styles.Trigger}>File</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={styles.Content} align="start" sideOffset={5} alignOffset={-3}>
						<Menubar.Item class={styles.Item}>
							New Tab <div class={styles.RightSlot}>⌘ T</div>
						</Menubar.Item>
						<Menubar.Item class={styles.Item}>
							New Window <div class={styles.RightSlot}>⌘ N</div>
						</Menubar.Item>
						<Menubar.Item class={styles.Item} disabled>
							New Incognito Window
						</Menubar.Item>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Sub>
							<Menubar.SubTrigger class={styles.SubTrigger}>
								Share
								<div class={styles.RightSlot}>
									<ChevronRightIcon />
								</div>
							</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent class={styles.SubContent} alignOffset={-5}>
									<Menubar.Item class={styles.Item}>
										Email Link
									</Menubar.Item>
									<Menubar.Item class={styles.Item}>Messages</Menubar.Item>
									<Menubar.Item class={styles.Item}>Notes</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Item class={styles.Item}>
							Print… <div class={styles.RightSlot}>⌘ P</div>
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger class={styles.Trigger}>Edit</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={styles.Content} align="start" sideOffset={5} alignOffset={-3}>
						<Menubar.Item class={styles.Item}>
							Undo <div class={styles.RightSlot}>⌘ Z</div>
						</Menubar.Item>
						<Menubar.Item class={styles.Item}>
							Redo <div class={styles.RightSlot}>⇧ ⌘ Z</div>
						</Menubar.Item>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Sub>
							<Menubar.SubTrigger class={styles.SubTrigger}>
								Find
								<div class={styles.RightSlot}>
									<ChevronRightIcon />
								</div>
							</Menubar.SubTrigger>

							<Menubar.Portal>
								<Menubar.SubContent class={styles.SubContent} alignOffset={-5}>
									<Menubar.Item class={styles.Item}>
										Search the web…
									</Menubar.Item>
									<Menubar.Separator class={styles.Separator} />
									<Menubar.Item class={styles.Item}>Find…</Menubar.Item>
									<Menubar.Item class={styles.Item}>Find Next</Menubar.Item>
									<Menubar.Item class={styles.Item}>
										Find Previous
									</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Item class={styles.Item}>Cut</Menubar.Item>
						<Menubar.Item class={styles.Item}>Copy</Menubar.Item>
						<Menubar.Item class={styles.Item}>Paste</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger class={styles.Trigger}>View</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={styles.Content} align="start" sideOffset={5} alignOffset={-14}>
						{CHECK_ITEMS.map(item => <Menubar.CheckboxItem class={`${styles.CheckboxItem} inset`} checked={checkedSelection().includes(item)} onCheckedChange={() => setCheckedSelection(current => current.includes(item) ? current.filter(el => el !== item) : current.concat(item))}>
								<Menubar.ItemIndicator class={styles.ItemIndicator}>
									<CheckIcon />
								</Menubar.ItemIndicator>
								{item}
							</Menubar.CheckboxItem>)}
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Item class={`${styles.Item} inset`}>
							Reload <div class={styles.RightSlot}>⌘ R</div>
						</Menubar.Item>
						<Menubar.Item class={`${styles.Item} inset`} disabled>
							Force Reload <div class={styles.RightSlot}>⇧ ⌘ R</div>
						</Menubar.Item>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Item class={`${styles.Item} inset`}>
							Toggle Fullscreen
						</Menubar.Item>
						<Menubar.Separator class={styles.Separator} />
						<Menubar.Item class={`${styles.Item} inset`}>
							Hide Sidebar
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu>
				<Menubar.Trigger class={styles.Trigger}>Profiles</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content class={styles.Content} align="start" sideOffset={5} alignOffset={-14}>
						<Menubar.RadioGroup value={radioSelection()} onValueChange={setRadioSelection}>
							{RADIO_ITEMS.map(item => <Menubar.RadioItem class={`${styles.RadioItem} inset`} value={item}>
									<Menubar.ItemIndicator class={styles.ItemIndicator}>
										<DotFilledIcon />
									</Menubar.ItemIndicator>
									{item}
								</Menubar.RadioItem>)}
							<Menubar.Separator class={styles.Separator} />
							<Menubar.Item class={`${styles.Item} inset`}>
								Edit…
							</Menubar.Item>
							<Menubar.Separator class={styles.Separator} />
							<Menubar.Item class={`${styles.Item} inset`}>
								Add Profile…
							</Menubar.Item>
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>
		</Menubar.Root>;
};
export default MenubarDemo;