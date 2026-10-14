import { unstable_PasswordToggleField as PasswordToggleField } from "@wsagency/radix2solid-primitives";
import { EyeClosedIcon, EyeOpenIcon } from "@wsagency/radix2solid-icons";
const PasswordToggleFieldDemo = () => <PasswordToggleField.Root>
		<div class="Root">
			<PasswordToggleField.Input class="Input" />
			<PasswordToggleField.Toggle class="Toggle">
				<PasswordToggleField.Icon visible={target => target(EyeOpenIcon, {})} hidden={target => target(EyeClosedIcon, {})} />
			</PasswordToggleField.Toggle>
		</div>
	</PasswordToggleField.Root>;
export default PasswordToggleFieldDemo;