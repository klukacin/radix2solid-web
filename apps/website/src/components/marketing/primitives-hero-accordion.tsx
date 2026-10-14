import { omit, type ComponentProps } from "solid-js";
import { Accordion as AccordionPrimitive } from "@wsagency/radix2solid-primitives";
import { ChevronDownIcon } from "@wsagency/radix2solid-icons";
import styles from "./primitives-hero-accordion.module.css";
const Accordion = (props: AccordionPrimitive.AccordionSingleProps) => <AccordionPrimitive.Root {...props} class={styles.Accordion} />;
const AccordionItem = (props: AccordionPrimitive.AccordionItemProps) => <AccordionPrimitive.Item {...props} class={styles.Item} />;
const AccordionTrigger = function AccordionTrigger(p: Exclude<ComponentProps<typeof AccordionPrimitive.Trigger>, {
  asChild: true;
}> & Pick<Exclude<ComponentProps<typeof AccordionPrimitive.Trigger>, {
  asChild: true;
}>, "ref">) {
  const props = omit(p, "children");
  return <AccordionPrimitive.Header class={styles.Header}>
			<AccordionPrimitive.Trigger {...props} class={styles.Trigger} ref={p.ref}>
				{p.children}
				<ChevronDownIcon class={styles.Chevron} aria-hidden="true" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>;
};
const AccordionContent = function AccordionContent(p: Exclude<ComponentProps<typeof AccordionPrimitive.Content>, {
  asChild: true;
}> & Pick<Exclude<ComponentProps<typeof AccordionPrimitive.Content>, {
  asChild: true;
}>, "ref">) {
  const props = omit(p, "children");
  return <AccordionPrimitive.Content {...props} class={styles.Content} ref={p.ref}>
			<div class={styles.ContentText}>{p.children}</div>
		</AccordionPrimitive.Content>;
};
export function PrimitivesHeroAccordion() {
  return <Accordion type="single" defaultValue="item-1" collapsible>
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>
					Yes. The Accordion adheres to the WAI‑ARIA design pattern.
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="item-2">
				<AccordionTrigger>Is it unstyled?</AccordionTrigger>
				<AccordionContent>
					Yes. The Accordion is unstyled by default, giving you freedom over the look and feel.
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="item-3">
				<AccordionTrigger>Can it be animated?</AccordionTrigger>
				<AccordionContent>
					Yes! You can animate the Accordion with CSS or JavaScript.
				</AccordionContent>
			</AccordionItem>
		</Accordion>;
}
