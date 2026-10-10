import { unstable_PasswordToggleField as PasswordToggleField } from "@radix-solid/primitives";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-solid/icons";
import styles from "./styles.module.css";
const PasswordToggleFieldDemo = () => <PasswordToggleField.Root>
		<div class={styles.Root}>
			<PasswordToggleField.Input class={styles.Input} />
			<PasswordToggleField.Toggle class={styles.Toggle}>
				<PasswordToggleField.Icon visible={target => target(EyeOpenIcon, {})} hidden={target => target(EyeClosedIcon, {})} />
			</PasswordToggleField.Toggle>
		</div>
	</PasswordToggleField.Root>;
export default PasswordToggleFieldDemo;