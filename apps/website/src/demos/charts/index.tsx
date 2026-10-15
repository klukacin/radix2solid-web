import { createSignal } from "solid-js";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Sankey, Tooltip, XAxis, YAxis, type CartesianPosition } from "@wsagency/radix2solid-charts";
import styles from "./styles.module.css";
const data = [
	{ month: "Jan", visitors: 4000, signups: 2400 },
	{ month: "Feb", visitors: 3000, signups: 1398 },
	{ month: "Mar", visitors: 2000, signups: 3800 },
	{ month: "Apr", visitors: 2780, signups: 3908 },
	{ month: "May", visitors: 1890, signups: 4800 },
	{ month: "Jun", visitors: 2390, signups: 3800 },
];
const flow = { nodes: [{ name: "Visits" }, { name: "Docs" }, { name: "Install" }], links: [{ source: 0, target: 1, value: 60 }, { source: 1, target: 2, value: 35 }] };
const ChartsDemo = () => {
	const [kind, setKind] = createSignal<"line" | "bar" | "sankey">("line");
	const [position, setPosition] = createSignal<Extract<CartesianPosition, string>>("bottom");
	return <figure class={styles.Root}>
		<div class={styles.Toolbar} role="group" aria-label="Chart type">
			<button class={styles.Button} aria-pressed={kind() === "line" ? "true" : "false"} onClick={() => setKind("line")}>Line</button>
			<button class={styles.Button} aria-pressed={kind() === "bar" ? "true" : "false"} onClick={() => setKind("bar")}>Bar</button>
      <button class={styles.Button} aria-pressed={kind() === "sankey" ? "true" : "false"} onClick={() => setKind("sankey")}>Sankey</button>
		</div>
    <label>Legend position <select aria-label="Legend position" value={position()} onChange={event => setPosition(event.currentTarget.value as Extract<CartesianPosition, string>)}>
      <option value="bottom">Outside bottom</option><option value="right">Outside right</option><option value="insideTopRight">Inside top right</option>
    </select></label>
    <output aria-label="Legend configuration">Position: {position()}; offset: 8; layout: auto</output>
		<ResponsiveContainer width="100%" height={240} initialDimension={{ width: 360, height: 240 }}>
			{kind() === "line" ? <LineChart data={data} title="Visitors and signups by month">
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" height="auto" angle={-35} label="Reporting month" />
        <Legend position={position()} offset={8} layout="auto" />
				<YAxis />
				<Tooltip />
				<Line type="monotone" dataKey="visitors" stroke="var(--violet-9)" strokeWidth={2} />
				<Line type="monotone" dataKey="signups" stroke="var(--teal-9)" strokeWidth={2} />
			</LineChart> : kind() === "bar" ? <BarChart data={data} title="Visitors and signups by month">
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis dataKey="month" height="auto" angle={-35} label="Reporting month" />
        <Legend position={position()} offset={8} layout="auto" />
				<YAxis />
				<Tooltip />
				<Bar dataKey="visitors" fill="var(--violet-9)" radius={[4, 4, 0, 0]} />
				<Bar dataKey="signups" fill="var(--teal-9)" radius={[4, 4, 0, 0]} />
			</BarChart> : <Sankey data={flow} title="Documentation flow" desc="Visits flow through docs and playground to installation." accessibilityLayer><Tooltip /></Sankey>}
		</ResponsiveContainer>
		<figcaption class={styles.Caption}>Visitors and signups, January–June</figcaption>
	</figure>;
};
export default ChartsDemo;
