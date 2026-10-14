import { Text } from "@wsagency/radix2solid-themes";
import { styled } from "../../utils/css";
import { RadioGroup as RadioGroupPrimitive } from "@wsagency/radix2solid-primitives";
import styles from "./primitives-hero-radio-group.module.css";
export const RadioCards = styled(RadioGroupPrimitive.Root, styles.Cards);
const StyledRadioButton = styled("div", styles.RadioButton);
const StyledRadioIndicator = styled("div", styles.RadioIndicator);
const StyledRadio = styled(RadioGroupPrimitive.Item, styles.Radio);
export function PrimitivesHeroRadioGroup() {
  return <RadioCards defaultValue="1" aria-label="Color">
			<StyledRadio value="1">
				<StyledRadioButton>
					<StyledRadioIndicator />
				</StyledRadioButton>
				<Text size="2">Indigo Blue</Text>
			</StyledRadio>
			<StyledRadio value="2">
				<StyledRadioButton>
					<StyledRadioIndicator />
				</StyledRadioButton>
				<Text size="2">Taupe Brown</Text>
			</StyledRadio>
			<StyledRadio value="3">
				<StyledRadioButton>
					<StyledRadioIndicator />
				</StyledRadioButton>
				<Text size="2">Slate Gray</Text>
			</StyledRadio>
		</RadioCards>;
}
