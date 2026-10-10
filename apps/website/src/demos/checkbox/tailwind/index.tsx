import { Checkbox } from "@radix-solid/primitives";
import { CheckIcon } from "@radix-solid/icons";
const CheckboxDemo = () => <form>
		<div class="flex items-center">
			<Checkbox.Root class="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px_black]" defaultChecked id="c1">
				<Checkbox.Indicator class="text-violet11">
					<CheckIcon />
				</Checkbox.Indicator>
			</Checkbox.Root>
			<label class="pl-[15px] text-[15px] leading-none text-white" for="c1">
				Accept terms and conditions.
			</label>
		</div>
	</form>;
export default CheckboxDemo;