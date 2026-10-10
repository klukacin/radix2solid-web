import type { JSX } from "@solidjs/web";
import styles from "./hover.module.css";
const HoverRoot = (props: JSX.IntrinsicElements["div"]) => <div {...props} class={[styles.HoverRoot, props.class]} />;
const HoverShow = (props: JSX.IntrinsicElements["div"]) => <div {...props} class={[styles.HoverShow, props.class]} />;
export const Hover = {
  Root: HoverRoot,
  Show: HoverShow
};