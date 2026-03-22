
import { motion } from "framer-motion";

export function StatCard({ title, value, unit, icon: Icon, trend, trendLabel, color = "blue", delay = 0 }) {
  const colorMap = {
    blue: {
      icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      trend: "text-emerald-400",
      trendBad: "text-red-400",
      glow: "hover:shadow-blue-500/10",
    },
    emerald: {
      icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      trend: "text-emerald-400",
      trendBad: "text-red-400",
      glow: "hover:shadow-emerald-500/10",
    },
    amber: {
      icon: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      trend: "text-emerald-400",
      trendBad: "text-red-400",
      glow: "hover:shadow-amber-500/10",
    },
    red: {
      icon: "text-red-400 bg-red-500/10 border-red-500/20",
      trend: "text-emerald-400",
      trendBad: "text-red-400",
      glow: "hover:shadow-red-500/10",
    },
  };

  const colors = colorMap[color] || colorMap.blue;
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className={`relative overflow-hidden bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 cursor-default hover:shadow-lg hover:shadow-black/20 ${colors.glow} transition-shadow`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className={`p-2 rounded-lg border ${colors.icon}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {unit && <span className="text-slate-400 text-sm mb-1">{unit}</span>}
      </div>

      {trendLabel && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-medium ${isPositiveTrend ? colors.trend : colors.trendBad}`}>
            {trend !== undefined && (trend > 0 ? "▲" : "▼")} {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}
