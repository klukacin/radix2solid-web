import { createSignal, onSettled } from "solid-js";
import { Progress } from "@wsagency/radix2solid-primitives";
const ProgressDemo = () => {
  const [progress, setProgress] = createSignal(13);
  onSettled(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  });
  return <Progress.Root class="relative h-[25px] w-[300px] overflow-hidden rounded-full bg-blackA6" style={{
    // Fix overflow clipping in Safari
    // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
    "transform": "translateZ(0)"
  }} value={progress()}>
			<Progress.Indicator class="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-white transition-transform duration-[660ms]" style={{
      "transform": `translateX(-${100 - progress()}%)`
    }} />
		</Progress.Root>;
};
export default ProgressDemo;