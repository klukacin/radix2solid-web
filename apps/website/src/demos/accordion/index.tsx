import { omit, type ComponentProps } from "solid-js";
import { Accordion } from "@wsagency/radix2solid-primitives";
import { ChevronDownIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const AccordionDemo = () => <Accordion.Root class={styles.Root} type="single" defaultValue="item-1" collapsible>
		<Accordion.Item class={styles.Item} value="item-1">
			<AccordionTrigger>Is it accessible?</AccordionTrigger>
			<AccordionContent>
				Yes. It adheres to the WAI-ARIA design pattern.
			</AccordionContent>
		</Accordion.Item>

		<Accordion.Item class={styles.Item} value="item-2">
			<AccordionTrigger>Is it unstyled?</AccordionTrigger>
			<AccordionContent>
				Yes. It&apos;s unstyled by default, giving you freedom over the look and
				feel.
			</AccordionContent>
		</Accordion.Item>

		<Accordion.Item class={styles.Item} value="item-3">
			<AccordionTrigger>Can it be animated?</AccordionTrigger>
			<AccordionContent>
				Yes! You can animate the Accordion with CSS or JavaScript.
			</AccordionContent>
		</Accordion.Item>
	</Accordion.Root>;
const AccordionTrigger = function AccordionTrigger(p: Extract<ComponentProps<typeof Accordion.Trigger>, {
  asChild?: false;
}>) {
  return <Accordion.Header class={styles.Header}>
			<Accordion.Trigger class={[styles.Trigger, p.class]} {...omit(p, "children", "class")} ref={p.ref}>
				{p.children}
				<ChevronDownIcon class={styles.Chevron} aria-hidden="true" />
			</Accordion.Trigger>
		</Accordion.Header>;
};
const AccordionContent = function AccordionContent(p: Extract<ComponentProps<typeof Accordion.Content>, {
  asChild?: false;
}>) {
  return <Accordion.Content class={[styles.Content, p.class]} {...omit(p, "children", "class")} ref={p.ref}>
			<div class={styles.ContentText}>{p.children}</div>
		</Accordion.Content>;
};
export default AccordionDemo;