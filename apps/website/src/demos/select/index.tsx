import { omit, type ComponentProps } from "solid-js";
import { Select } from "@wsagency/radix2solid-primitives";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const SelectDemo = () => <Select.Root>
		<Select.Trigger class={styles.Trigger} aria-label="Food">
			<Select.Value placeholder="Select a fruit…" />
			<Select.Icon class={styles.Icon}>
				<ChevronDownIcon />
			</Select.Icon>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content class={styles.Content}>
				<Select.ScrollUpButton class={styles.ScrollButton}>
					<ChevronUpIcon />
				</Select.ScrollUpButton>
				<Select.Viewport class={styles.Viewport}>
					<Select.Group>
						<Select.Label class={styles.Label}>Fruits</Select.Label>
						<SelectItem value="apple">Apple</SelectItem>
						<SelectItem value="banana">Banana</SelectItem>
						<SelectItem value="blueberry">Blueberry</SelectItem>
						<SelectItem value="grapes">Grapes</SelectItem>
						<SelectItem value="pineapple">Pineapple</SelectItem>
					</Select.Group>

					<Select.Separator class={styles.Separator} />

					<Select.Group>
						<Select.Label class={styles.Label}>Vegetables</Select.Label>
						<SelectItem value="aubergine">Aubergine</SelectItem>
						<SelectItem value="broccoli">Broccoli</SelectItem>
						<SelectItem value="carrot" disabled>
							Carrot
						</SelectItem>
						<SelectItem value="courgette">Courgette</SelectItem>
						<SelectItem value="leek">Leek</SelectItem>
					</Select.Group>

					<Select.Separator class={styles.Separator} />

					<Select.Group>
						<Select.Label class={styles.Label}>Meat</Select.Label>
						<SelectItem value="beef">Beef</SelectItem>
						<SelectItem value="chicken">Chicken</SelectItem>
						<SelectItem value="lamb">Lamb</SelectItem>
						<SelectItem value="pork">Pork</SelectItem>
					</Select.Group>
				</Select.Viewport>
				<Select.ScrollDownButton class={styles.ScrollButton}>
					<ChevronDownIcon />
				</Select.ScrollDownButton>
			</Select.Content>
		</Select.Portal>
	</Select.Root>;
const SelectItem = function SelectItem(p: Extract<ComponentProps<typeof Select.Item>, {
  asChild?: false;
}>) {
  return <Select.Item class={[styles.Item, p.class]} {...omit(p, "children", "class")} ref={p.ref}>
			<Select.ItemText>{p.children}</Select.ItemText>
			<Select.ItemIndicator class={styles.ItemIndicator}>
				<CheckIcon />
			</Select.ItemIndicator>
		</Select.Item>;
};
export default SelectDemo;