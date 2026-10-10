import { omit, type ComponentProps } from "solid-js";
import { Accordion } from "@radix-solid/primitives";
import { ChevronDownIcon } from "@radix-solid/icons";
import "./styles.css";
const AccordionDemo = () => <Accordion.Root class="AccordionRoot" type="single" defaultValue="item-1" collapsible>
		<Accordion.Item class="AccordionItem" value="item-1">
			<AccordionTrigger>Is it accessible?</AccordionTrigger>
			<AccordionContent>
				Yes. It adheres to the WAI-ARIA design pattern.
			</AccordionContent>
		</Accordion.Item>

		<Accordion.Item class="AccordionItem" value="item-2">
			<AccordionTrigger>Is it unstyled?</AccordionTrigger>
			<AccordionContent>
				Yes. It&apos;s unstyled by default, giving you freedom over the look and
				feel.
			</AccordionContent>
		</Accordion.Item>

		<Accordion.Item class="AccordionItem" value="item-3">
			<AccordionTrigger>Can it be animated?</AccordionTrigger>
			<Accordion.Content class="AccordionContent">
				<div class="AccordionContentText">
					Yes! You can animate the Accordion with CSS or JavaScript.
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>;
const AccordionTrigger = function AccordionTrigger(p: Extract<ComponentProps<typeof Accordion.Trigger>, {
  asChild?: false;
}>) {
  return <Accordion.Header class="AccordionHeader">
			<Accordion.Trigger class={["AccordionTrigger", p.class]} {...omit(p, "children", "class")} ref={p.ref}>
				{p.children}
				<ChevronDownIcon class="AccordionChevron" aria-hidden="true" />
			</Accordion.Trigger>
		</Accordion.Header>;
};
const AccordionContent = function AccordionContent(p: Extract<ComponentProps<typeof Accordion.Content>, {
  asChild?: false;
}>) {
  return <Accordion.Content class={["AccordionContent", p.class]} {...omit(p, "children", "class")} ref={p.ref}>
			<div class="AccordionContentText">{p.children}</div>
		</Accordion.Content>;
};
export default AccordionDemo;