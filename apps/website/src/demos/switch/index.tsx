import { Switch } from "@radix-solid/primitives";
import styles from "./styles.module.css";
const SwitchDemo = () => <form>
		<div style={{
    "display": "flex",
    "align-items": "center"
  }}>
			<label id="airplane-mode-label" for="airplane-mode" class={styles.Label} style={{
      "padding-right": "15px"
    }}>
				Airplane mode
			</label>
			<Switch.Root id="airplane-mode" aria-labelledby="airplane-mode-label" class={styles.Root}>
				<Switch.Thumb class={styles.Thumb} />
			</Switch.Root>
		</div>
	</form>;
export default SwitchDemo;