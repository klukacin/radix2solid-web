import { omit, type ComponentProps } from "solid-js";
import { Accordion } from "@radix-solid/primitives";
import { ChevronDownIcon } from "@radix-solid/icons";
const AccordionDemo = () => <Accordion.Root class="w-[300px] rounded-md bg-mauve6 shadow-[0_2px_10px] shadow-black/5" type="single" defaultValue="item-1" collapsible>
		<AccordionItem value="item-1">
			<AccordionTrigger>Is it accessible?</AccordionTrigger>
			<AccordionContent>
				Yes. It adheres to the WAI-ARIA design pattern.
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="item-2">
			<AccordionTrigger>Is it unstyled?</AccordionTrigger>
			<AccordionContent>
				Yes. It&apos;s unstyled by default, giving you freedom over the look and
				feel.
			</AccordionContent>
		</AccordionItem>

		<AccordionItem value="item-3">
			<AccordionTrigger>Can it be animated?</AccordionTrigger>
			<AccordionContent>
				Yes! You can animate the Accordion with CSS or JavaScript.
			</AccordionContent>
		</AccordionItem>
	</Accordion.Root>;
const AccordionItem = function AccordionItem(p: Extract<ComponentProps<typeof Accordion.Item>, {
  asChild?: false;
}>) {
  return <Accordion.Item class={["mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12", p.class]} {...omit(p, "children", "class")} ref={p.ref}>
			{p.children}
		</Accordion.Item>;
};
const AccordionTrigger = function AccordionTrigger(p: Extract<ComponentProps<typeof Accordion.Trigger>, {
  asChild?: false;
}>) {
  return <Accordion.Header class="flex">
			<Accordion.Trigger class={["group flex h-[45px] flex-1 cursor-default items-center justify-between bg-mauve1 px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2", p.class]} {...omit(p, "children", "class")} ref={p.ref}>
				{p.children}
				<ChevronDownIcon class="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" aria-hidden="true" />
			</Accordion.Trigger>
		</Accordion.Header>;
};
const AccordionContent = function AccordionContent(p: Extract<ComponentProps<typeof Accordion.Content>, {
  asChild?: false;
}>) {
  return <Accordion.Content class={["overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown", p.class]} {...omit(p, "children", "class")} ref={p.ref}>
			<div class="px-5 py-[15px]">{p.children}</div>
		</Accordion.Content>;
};
export default AccordionDemo;