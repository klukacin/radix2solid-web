import { createSignal } from "solid-js";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@wsagency/radix2solid-charts";
import "./styles.css";
const data = [
	{ month: "Jan", visitors: 4000, signups: 2400 },
	{ month: "Feb", visitors: 3000, signups: 1398 },
	{ month: "Mar", visitors: 2000, signups: 3800 },
	{ month: "Apr", visitors: 2780, signups: 3908 },
	{ month: "May", visitors: 1890, signups: 4800 },
	{ month: "Jun", visitors: 2390, signups: 3800 },
];
const ChartsDemo = () => {
	const [kind, setKind] = createSignal<"line" | "bar">("line");
	return <figure class="ChartRoot">
		<div class="ChartToolbar" role="group" aria-label="Chart type">
			<button class="ChartButton" aria-pressed={kind() === "line" ? "true" : "false"} onClick={() => setKind("line")}>Line</button>
			<button class="ChartButton" aria-pressed={kind() === "bar" ? "true" : "false"} onClick={() => setKind("bar")}>Bar</button>
		</div>
		<ResponsiveContainer width="100%" height={240} initialDimension={{ width: 360, height: 240 }}>
			{kind() === "line" ? <LineChart data={data} title="Visitors and signups by month">
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Line type="monotone" dataKey="visitors" stroke="var(--violet-9)" strokeWidth={2} />
				<Line type="monotone" dataKey="signups" stroke="var(--teal-9)" strokeWidth={2} />
			</LineChart> : <BarChart data={data} title="Visitors and signups by month">
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Bar dataKey="visitors" fill="var(--violet-9)" radius={[4, 4, 0, 0]} />
				<Bar dataKey="signups" fill="var(--teal-9)" radius={[4, 4, 0, 0]} />
			</BarChart>}
		</ResponsiveContainer>
		<figcaption class="ChartCaption">Visitors and signups, January–June</figcaption>
	</figure>;
};
export default ChartsDemo;
