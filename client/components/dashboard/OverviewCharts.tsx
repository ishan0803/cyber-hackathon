import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TimePoint, StateBar, DonutSlice } from "@/lib/dataGenerator";

const COLORS = ["#22d3ee", "#06b6d4", "#0ea5e9"];

export function TrendChart({ data }: { data: TimePoint[] }) {
  return (
    <div className="h-64 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm text-muted-foreground">
        Engagement vs Time
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#64748b"
            width={40}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <RTooltip
            contentStyle={{
              background: "#0b1220",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#colorEng)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StateBarChart({ data }: { data: StateBar[] }) {
  return (
    <div className="h-64 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm text-muted-foreground">
        Accounts Flagged per State
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
        >
          <XAxis
            dataKey="state"
            stroke="#64748b"
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#64748b"
            width={40}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <RTooltip
            contentStyle={{
              background: "#0b1220",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
          <Bar dataKey="flagged" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SentimentDonut({ data }: { data: DonutSlice[] }) {
  return (
    <div className="h-64 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm text-muted-foreground">
        Sentiment Breakdown
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <RTooltip
            contentStyle={{
              background: "#0b1220",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#e2e8f0" }}
            itemStyle={{ color: "#e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
