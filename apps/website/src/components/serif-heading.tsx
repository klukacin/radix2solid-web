import { mergeStyles } from "@radix-solid/themes/helpers";
import { type ComponentProps } from "solid-js";
import { Heading } from "@radix-solid/themes";
export const SerifHeading = (props: Extract<ComponentProps<typeof Heading>, {
  asChild?: false;
}>) => {
  return <Heading weight="regular" size={{ initial: "8", xs: "9" }} {...props} style={mergeStyles({
    "--heading-font-family": "var(--font-source-serif), serif",
    "--heading-font-size-adjust": "1.1",
  }, props.style)} />;
};