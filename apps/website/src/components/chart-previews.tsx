import { For, type Element } from 'solid-js';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, RadialBar, RadialBarChart, ResponsiveContainer, Sankey, Scatter, ScatterChart, SunburstChart, Tooltip, Treemap, XAxis, YAxis, ZAxis } from '@wsagency/radix2solid-charts';

// Real chart families whose colors are Themes tokens, so accent and appearance changes apply.
const months = [
  { month: 'Jan', visitors: 4000, signups: 2400, revenue: 2400 },
  { month: 'Feb', visitors: 3000, signups: 1398, revenue: 2210 },
  { month: 'Mar', visitors: 2000, signups: 3800, revenue: 2290 },
  { month: 'Apr', visitors: 2780, signups: 3908, revenue: 2000 },
  { month: 'May', visitors: 1890, signups: 4800, revenue: 2181 },
  { month: 'Jun', visitors: 2390, signups: 3800, revenue: 2500 },
];
const shares = [{ name: 'Search', value: 400 }, { name: 'Direct', value: 300 }, { name: 'Social', value: 300 }, { name: 'Email', value: 200 }];
const palette = ['var(--accent-9)', 'var(--teal-9)', 'var(--amber-9)', 'var(--crimson-9)', 'var(--violet-9)', 'var(--gray-9)'];
const skills = [{ subject: 'Speed', a: 120, b: 110 }, { subject: 'Design', a: 98, b: 130 }, { subject: 'Docs', a: 86, b: 130 }, { subject: 'Tests', a: 99, b: 100 }, { subject: 'A11y', a: 85, b: 90 }];
const points = [{ x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 }, { x: 170, y: 300, z: 400 }, { x: 140, y: 250, z: 280 }, { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 }];
const steps = [{ name: 'Visited', value: 1000, fill: 'var(--accent-9)' }, { name: 'Signed up', value: 640, fill: 'var(--accent-8)' }, { name: 'Activated', value: 410, fill: 'var(--accent-7)' }, { name: 'Paid', value: 180, fill: 'var(--accent-6)' }];
const tree = [{ name: 'Themes', children: [{ name: 'Button', size: 1302 }, { name: 'Dialog', size: 2400 }, { name: 'Table', size: 1800 }] }, { name: 'Primitives', children: [{ name: 'Menu', size: 3100 }, { name: 'Select', size: 2200 }] }, { name: 'Charts', children: [{ name: 'Line', size: 1500 }, { name: 'Pie', size: 900 }] }];
const flow = { nodes: [{ name: 'Visits' }, { name: 'Docs' }, { name: 'Playground' }, { name: 'Install' }], links: [{ source: 0, target: 1, value: 60 }, { source: 0, target: 2, value: 40 }, { source: 1, target: 3, value: 35 }, { source: 2, target: 3, value: 20 }] };
const hierarchy = { name: 'Packages', children: [{ name: 'Themes', fill: 'var(--accent-9)', children: [{ name: 'Layout', value: 30, fill: 'var(--accent-8)' }, { name: 'Forms', value: 40, fill: 'var(--accent-7)' }] }, { name: 'Charts', fill: 'var(--teal-9)', children: [{ name: 'Cartesian', value: 35, fill: 'var(--teal-8)' }, { name: 'Polar', value: 25, fill: 'var(--teal-7)' }] }] };

function Frame(props: { height: number; children: Element }) {
  return <ResponsiveContainer width="100%" height={props.height} initialDimension={{ width: 480, height: props.height }}>{props.children}</ResponsiveContainer>;
}

export const chartFamilies = {
  'line-chart': { title: 'Line chart', render: (height: number) => <Frame height={height}><LineChart data={months} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} title="Visitors and signups by month"><CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a6)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="visitors" stroke="var(--accent-9)" strokeWidth={2} /><Line type="monotone" dataKey="signups" stroke="var(--teal-9)" strokeWidth={2} /></LineChart></Frame> },
  'area-chart': { title: 'Area chart', render: (height: number) => <Frame height={height}><AreaChart data={months} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} title="Stacked visitors and signups"><CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a6)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area type="monotone" dataKey="visitors" stackId="1" stroke="var(--accent-9)" fill="var(--accent-a5)" /><Area type="monotone" dataKey="signups" stackId="1" stroke="var(--teal-9)" fill="var(--teal-a5)" /></AreaChart></Frame> },
  'bar-chart': { title: 'Bar chart', render: (height: number) => <Frame height={height}><BarChart data={months} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} title="Monthly visitors and signups"><CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a6)" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="visitors" fill="var(--accent-9)" radius={[4, 4, 0, 0]} /><Bar dataKey="signups" fill="var(--teal-9)" radius={[4, 4, 0, 0]} /></BarChart></Frame> },
  'composed-chart': { title: 'Composed chart', render: (height: number) => <Frame height={height}><ComposedChart data={months} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} title="Revenue bars with visitor trend"><CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a6)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="revenue" fill="var(--accent-a8)" /><Area type="monotone" dataKey="signups" stroke="var(--teal-9)" fill="var(--teal-a4)" /><Line type="monotone" dataKey="visitors" stroke="var(--amber-10)" strokeWidth={2} /></ComposedChart></Frame> },
  'scatter-chart': { title: 'Scatter chart', render: (height: number) => <Frame height={height}><ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }} title="Bubble scatter"><CartesianGrid strokeDasharray="3 3" stroke="var(--gray-a6)" /><XAxis dataKey="x" type="number" name="Load" /><YAxis dataKey="y" type="number" name="Latency" /><ZAxis dataKey="z" range={[60, 400]} /><Tooltip /><Scatter name="Requests" data={points} fill="var(--accent-9)" /></ScatterChart></Frame> },
  'pie-chart': { title: 'Pie chart', render: (height: number) => <Frame height={height}><PieChart title="Traffic sources"><Pie data={shares} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="80%" paddingAngle={2}><For each={shares}>{(_, index) => <Cell fill={palette[index()]} />}</For></Pie><Tooltip /></PieChart></Frame> },
  'radar-chart': { title: 'Radar chart', render: (height: number) => <Frame height={height}><RadarChart data={skills} outerRadius="75%" title="Team skill comparison"><PolarGrid stroke="var(--gray-a6)" /><PolarAngleAxis dataKey="subject" /><Radar name="Team A" dataKey="a" stroke="var(--accent-9)" fill="var(--accent-9)" fillOpacity={0.4} /><Radar name="Team B" dataKey="b" stroke="var(--teal-9)" fill="var(--teal-9)" fillOpacity={0.3} /><Tooltip /></RadarChart></Frame> },
  'radial-bar-chart': { title: 'Radial bar chart', render: (height: number) => <Frame height={height}><RadialBarChart data={steps} innerRadius="25%" outerRadius="95%" title="Conversion steps"><RadialBar dataKey="value" background /><Tooltip /></RadialBarChart></Frame> },
  'funnel-chart': { title: 'Funnel chart', render: (height: number) => <Frame height={height}><FunnelChart title="Signup funnel"><Tooltip /><Funnel dataKey="value" data={steps} isAnimationActive={false} /></FunnelChart></Frame> },
  treemap: { title: 'Treemap', render: (height: number) => <Frame height={height}><Treemap data={tree} dataKey="size" nameKey="name" stroke="var(--color-background)" colorPanel={palette} /></Frame> },
  sankey: { title: 'Sankey', render: (height: number) => <Frame height={height}><Sankey data={flow} nodePadding={24}><Tooltip /></Sankey></Frame> },
  'sunburst-chart': { title: 'Sunburst chart', render: (height: number) => <Frame height={height}><SunburstChart data={hierarchy} innerRadius={30} /></Frame> },
} as const;
export type ChartFamily = keyof typeof chartFamilies;
