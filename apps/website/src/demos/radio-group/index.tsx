import { RadioGroup } from "@radix-solid/primitives";
import styles from "./styles.module.css";
const RadioGroupDemo = () => <form>
		<RadioGroup.Root class={styles.Root} defaultValue="default" aria-label="View density">
			<div style={{
      "display": "flex",
      "align-items": "center"
    }}>
				<RadioGroup.Item class={styles.Item} value="default" id="r1">
					<RadioGroup.Indicator class={styles.Indicator} />
				</RadioGroup.Item>
				<label class={styles.Label} for="r1">
					Default
				</label>
			</div>
			<div style={{
      "display": "flex",
      "align-items": "center"
    }}>
				<RadioGroup.Item class={styles.Item} value="comfortable" id="r2">
					<RadioGroup.Indicator class={styles.Indicator} />
				</RadioGroup.Item>
				<label class={styles.Label} for="r2">
					Comfortable
				</label>
			</div>
			<div style={{
      "display": "flex",
      "align-items": "center"
    }}>
				<RadioGroup.Item class={styles.Item} value="compact" id="r3">
					<RadioGroup.Indicator class={styles.Indicator} />
				</RadioGroup.Item>
				<label class={styles.Label} for="r3">
					Compact
				</label>
			</div>
		</RadioGroup.Root>
	</form>;
export default RadioGroupDemo;