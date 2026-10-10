import { createSignal, onSettled, onCleanup } from "solid-js";
import { Progress } from "@radix-solid/primitives";
import "./styles.css";
const ProgressDemo = () => {
  const [progress, setProgress] = createSignal(13);
  onSettled(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    onCleanup(() => clearTimeout(timer));
  });
  return <Progress.Root class="ProgressRoot" value={progress()}>
			<Progress.Indicator class="ProgressIndicator" style={{
      "transform": `translateX(-${100 - progress()}%)`
    }} />
		</Progress.Root>;
};
export default ProgressDemo;