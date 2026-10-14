import { omit, type ComponentProps } from "solid-js";
import { Box } from "@wsagency/radix2solid-themes";
import styles from "./hidden-scroll.module.css";
export const HiddenScroll = (p: ComponentProps<typeof Box>) => <Box {...omit(p, 'class')} class={[p.class, styles.HiddenScroll]} />;
