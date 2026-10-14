import { Slider as SliderPrimitive } from "@wsagency/radix2solid-primitives";
import { styled } from "../../utils/css";
import styles from "./primitives-hero-slider.module.css";
const StyledSlider = styled(SliderPrimitive.Root, styles.Slider);
const StyledTrack = styled(SliderPrimitive.Track, styles.Track);
const StyledRange = styled(SliderPrimitive.Range, styles.Range);
const StyledThumb = styled(SliderPrimitive.Thumb, styles.Thumb);
export function PrimitivesHeroSlider() {
  return <StyledSlider defaultValue={[50]} max={100} step={1}>
			<StyledTrack>
				<StyledRange />
			</StyledTrack>
			<StyledThumb aria-label="Volume" />
		</StyledSlider>;
}
