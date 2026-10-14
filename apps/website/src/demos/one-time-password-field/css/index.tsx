import { unstable_OneTimePasswordField as OneTimePasswordField } from "@wsagency/radix2solid-primitives";
const OneTimePasswordFieldDemo = () => <OneTimePasswordField.Root class="OTPRoot">
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.Input class="OTPInput" />
		<OneTimePasswordField.HiddenInput />
	</OneTimePasswordField.Root>;
export default OneTimePasswordFieldDemo;