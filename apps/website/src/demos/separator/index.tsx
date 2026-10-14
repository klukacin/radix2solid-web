import { Separator } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const SeparatorDemo = () => <div style={{
  "width": "100%",
  "max-width": "300px",
  "margin": "0 15px"
}}>
		<div class={styles.Text} style={{
    "font-weight": 500
  }}>
			Radix Primitives
		</div>
		<div class={styles.Text}>An open-source UI component library.</div>
		<Separator.Root class={styles.Root} style={{
    "margin": "15px 0"
  }} />
		<div style={{
    "display": "flex",
    "height": "20px",
    "align-items": "center"
  }}>
			<div class={styles.Text}>Blog</div>
			<Separator.Root class={styles.Root} decorative orientation="vertical" style={{
      "margin": "0 15px"
    }} />
			<div class={styles.Text}>Docs</div>
			<Separator.Root class={styles.Root} decorative orientation="vertical" style={{
      "margin": "0 15px"
    }} />
			<div class={styles.Text}>Source</div>
		</div>
	</div>;
export default SeparatorDemo;