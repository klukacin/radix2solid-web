import { createSignal, onSettled } from "solid-js";
import { Progress } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const ProgressDemo = () => {
  const [progress, setProgress] = createSignal(13);
  onSettled(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  });
  return <Progress.Root class={styles.Root} value={progress()}>
			<Progress.Indicator class={styles.Indicator} style={{
      "transform": `translateX(-${100 - progress()}%)`
    }} />
		</Progress.Root>;
};
export default ProgressDemo;