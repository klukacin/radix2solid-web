import { Slider } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const SliderDemo = () => <form>
		<Slider.Root class={styles.Root} defaultValue={[50]} max={100} step={1}>
			<Slider.Track class={styles.Track}>
				<Slider.Range class={styles.Range} />
			</Slider.Track>
			<Slider.Thumb class={styles.Thumb} aria-label="Volume" />
		</Slider.Root>
	</form>;
export default SliderDemo;