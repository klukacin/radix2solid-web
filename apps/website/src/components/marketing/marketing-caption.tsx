import { mergeStyles } from "@radix-solid/themes/helpers";
import { omit, type ComponentProps } from "solid-js";
import { Text } from "@radix-solid/themes";
type CaptionProps = Omit<Extract<ComponentProps<typeof Text>, { as: 'div'; asChild?: false }>, 'as'>;
export const MarketingCaption = (p: CaptionProps) => <Text as="div" size={{
  initial: "3"
}} weight="bold" style={mergeStyles({
  "width": "max-content",
  "color": "transparent",
  "-webkit-background-clip": "text",
  "filter": "saturate(0.5)",
  "background-image": "linear-gradient(to bottom left, var(--blue-11), var(--blue-12))"
}, p.style)} {...omit(p, "asChild", "style")} />;
