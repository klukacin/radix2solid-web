import { unstable_OneTimePasswordField as OneTimePasswordField } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const OneTimePasswordFieldDemo = () => <OneTimePasswordField.Root class={styles.Root}>
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.Input class={styles.Input} />
		<OneTimePasswordField.HiddenInput />
	</OneTimePasswordField.Root>;
export default OneTimePasswordFieldDemo;