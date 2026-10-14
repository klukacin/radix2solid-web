import { Checkbox } from "@wsagency/radix2solid-primitives";
import { CheckIcon } from "@wsagency/radix2solid-icons";
import styles from "./styles.module.css";
const CheckboxDemo = () => <form>
		<div style={{
    "display": "flex",
    "align-items": "center"
  }}>
			<Checkbox.Root class={styles.Root} defaultChecked id="c1">
				<Checkbox.Indicator class={styles.Indicator}>
					<CheckIcon />
				</Checkbox.Indicator>
			</Checkbox.Root>
			<label class={styles.Label} for="c1">
				Accept terms and conditions.
			</label>
		</div>
	</form>;
export default CheckboxDemo;