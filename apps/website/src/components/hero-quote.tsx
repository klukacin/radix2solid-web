import { type ComponentProps, omit } from "solid-js";
import { Text } from "@wsagency/radix2solid-themes";
import styles from "./hero-quote.module.css";
type TextProps = Omit<Extract<ComponentProps<typeof Text>, { as?: 'span'; asChild?: false }>, 'as'>;
export const HeroQuote = (p: TextProps) => {
  return <Text {...omit(p, 'children', 'asChild')} as="span" size="5" color="gray" asChild class={styles.HeroQuote}>{target => target("blockquote", {
      children: p.children
    })}</Text>;
};