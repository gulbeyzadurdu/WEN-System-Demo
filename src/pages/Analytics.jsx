
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { getTodayHourlyData } from "../utils/mockData.js";

const todayData = getTodayHourlyData();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="text-slate-300 font-medium mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const sampled = todayData.filter((_, i) => i % 2 === 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-xl font-bold">Analitik</h1>
        <p className="text-slate-400 text-sm mt-0.5">Bugünkü saatlik veri analizi</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5"
      >
        <h2 className="text-white font-semibold mb-1">Bugünkü Saatlik Sıcaklık & Tüketim</h2>
        <p className="text-slate-400 text-xs mb-5">21 Mart 2026 · Saatlik veri</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampled} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="water" orientation="left" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="temp" orientation="right" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "12px" }} formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "11px" }}>{v}</span>} />
              <Line yAxisId="water" type="monotone" dataKey="waterConsumption" name="Su (m³)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Sıcaklık (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="water" type="monotone" dataKey="energyLoad" name="Enerji (kWh)" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Günlük Toplam Tüketim", value: `${todayData.reduce((a, d) => a + d.waterConsumption, 0).toLocaleString("tr-TR")} m³`, sub: "Hedef: 18,000 m³" },
          { label: "Ortalama Sıcaklık", value: `${(todayData.reduce((a, d) => a + d.temperature, 0) / todayData.length).toFixed(1)} °C`, sub: "Max: 34.2°C" },
          { label: "Enerji Verimliliği", value: "73.4%", sub: "Dünden +2.1%" },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">{item.label}</p>
            <p className="text-white text-2xl font-bold">{item.value}</p>
            <p className="text-slate-500 text-xs mt-1">{item.sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
