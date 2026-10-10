import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import styles from "./primitives-hero-button.module.css";
export const PrimitivesHeroButton = function PrimitivesHeroButton(p: JSX.IntrinsicElements["button"] & {
  variant?: "white" | "gray";
} & Pick<JSX.IntrinsicElements["button"], "ref">) {
  const props = omit(p, "variant");
  return <button type="button" data-variant={p.variant ?? 'white'} ref={p.ref} {...props} class={[props.class, styles.PrimitivesHeroButton]} />;
};
