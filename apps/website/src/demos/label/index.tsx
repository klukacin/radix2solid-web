import { Label } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const LabelDemo = () => <div style={{
  "display": "flex",
  "padding": "0 20px",
  "flex-wrap": "wrap",
  "gap": "15px",
  "align-items": "center"
}}>
		<Label.Root class={styles.Root} for="firstName">
			First name
		</Label.Root>
		<input class={styles.Input} type="text" id="firstName" defaultValue="Pedro Duarte" />
	</div>;
export default LabelDemo;