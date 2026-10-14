import { type ComponentProps } from "solid-js";
import { Flex } from "@wsagency/radix2solid-themes";
import { mergeStyles } from '@wsagency/radix2solid-themes/helpers';
export const Marker = (props: Extract<ComponentProps<typeof Flex>, { asChild?: false }>) => <Flex align="center" justify="center" width="16px" height="16px" {...props} style={mergeStyles({
  color: 'var(--teal-11)', 'background-color': 'var(--teal-a4)', 'border-radius': '100%'
}, props.style)} />;