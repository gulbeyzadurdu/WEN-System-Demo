
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area
} from "recharts";
import { getDailyAggregates } from "../utils/mockData.js";
import { useSimulation } from "../context/SimulationContext.jsx";

const BASE_TEMP = 32.4;
const WATER_PER_DEGREE = 12;
const ENERGY_PER_DEGREE = 15;

const baseDaily = getDailyAggregates();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {typeof entry.value === "number" ? entry.value.toLocaleString("tr-TR") : entry.value}
              {entry.name.includes("Sıcaklık") ? " °C" : entry.name.includes("Tüketim") ? " m³" : " kWh"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CorrelationChart() {
  const { simulatedTemp, isEmergency } = useSimulation();

  const chartData = useMemo(() => {
    const delta = simulatedTemp - BASE_TEMP;
    return baseDaily.map((day) => ({
      ...day,
      totalWater: isEmergency
        ? Math.round(day.totalWater * 0.04)
        : Math.max(0, Math.round(day.totalWater + delta * WATER_PER_DEGREE * 24)),
      avgEnergy: isEmergency
        ? Math.round(day.avgEnergy * 0.12)
        : Math.max(0, Math.round(day.avgEnergy + delta * ENERGY_PER_DEGREE)),
      maxTemp: Math.round((day.maxTemp + delta) * 10) / 10,
    }));
  }, [simulatedTemp, isEmergency]);

  const isHot = simulatedTemp >= 38;
  const isCold = simulatedTemp < 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative border rounded-xl p-5 transition-colors duration-500 ${
        isEmergency
          ? "bg-red-950/30 border-red-500/40"
          : isHot
          ? "bg-orange-950/20 border-orange-500/30"
          : "bg-slate-800/60 border-slate-700/50"
      }`}
    >
      {isEmergency && (
        <div className="absolute inset-0 rounded-xl border-2 border-red-500/40 pointer-events-none animate-pulse" />
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-semibold text-base">Su & Enerji Korelasyon Grafiği</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {isEmergency
              ? "⚡ ACİL DURUM — Su akışı minimize edildi"
              : `Simüle sıcaklık: ${simulatedTemp.toFixed(1)}°C · Son 7 günlük veriler`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEmergency && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-medium animate-pulse">
              ACİL
            </span>
          )}
          {!isEmergency && simulatedTemp !== BASE_TEMP && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              isHot
                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                : isCold
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              {simulatedTemp > BASE_TEMP ? "▲" : "▼"} {Math.abs(simulatedTemp - BASE_TEMP).toFixed(1)}°C
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            7 Günlük
          </span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isEmergency ? "#ef4444" : "#3b82f6"} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isEmergency ? "#ef4444" : "#3b82f6"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="water"
              orientation="left"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "m³", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10, dy: 20 }}
            />
            <YAxis
              yAxisId="temp"
              orientation="right"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "°C", position: "insideRight", fill: "#64748b", fontSize: 10, dy: -10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "12px" }}
              formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>}
            />
            <Area
              yAxisId="water"
              type="monotone"
              dataKey="totalWater"
              name="Su Tüketimi (m³)"
              fill="url(#waterGradient)"
              stroke={isEmergency ? "#ef4444" : "#3b82f6"}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Bar
              yAxisId="water"
              dataKey="avgEnergy"
              name="Ort. Enerji (kWh)"
              fill={isEmergency ? "#7f1d1d" : "#8b5cf6"}
              fillOpacity={isEmergency ? 0.8 : 0.5}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="maxTemp"
              name="Maks. Sıcaklık (°C)"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className={`mt-4 p-3 rounded-lg text-xs border ${
        isEmergency
          ? "bg-red-500/10 border-red-500/20"
          : "bg-amber-500/10 border-amber-500/20"
      }`}>
        {isEmergency ? (
          <p className="text-red-300">
            <span className="font-semibold">⚡ ACİL DURUM:</span> Tüm su vanalar kapatıldı.
            Günlük su tüketimi <span className="font-semibold">~%96 azaltıldı</span>.
            Enerji yükü minimumda.
          </p>
        ) : (
          <p className="text-amber-300">
            <span className="font-semibold">Korelasyon Analizi:</span> Sıcaklık 1°C artışı, günlük ortalama{" "}
            <span className="font-semibold">12 m³ ek su tüketimine</span> yol açmaktadır.
            Su-Enerji bağlantı katsayısı: <span className="font-semibold">r = 0.89</span>
            {simulatedTemp !== BASE_TEMP && (
              <span className="ml-2 text-white">
                · Şu an {Math.abs((simulatedTemp - BASE_TEMP) * 12 * 24).toFixed(0)} m³/gün{" "}
                {simulatedTemp > BASE_TEMP ? "fazla" : "az"} tüketim simüle ediliyor.
              </span>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}
