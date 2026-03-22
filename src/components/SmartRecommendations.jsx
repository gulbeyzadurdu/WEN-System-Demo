
import { motion } from "framer-motion";
import { Thermometer, Clock, Droplets, Zap, TrendingDown, ChevronRight } from "lucide-react";
import { smartRecommendations } from "../utils/mockData.js";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "../constants/index.js";

const ICON_MAP = { thermometer: Thermometer, clock: Clock, droplets: Droplets, zap: Zap };

export function SmartRecommendations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-base">Akıllı Öneriler</h2>
          <p className="text-slate-400 text-xs mt-0.5">Yapay zeka destekli optimizasyon</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Canlı</span>
        </div>
      </div>

      <div className="space-y-3">
        {smartRecommendations.map((rec, i) => {
          const Icon = ICON_MAP[rec.icon] || Zap;
          const colors = PRIORITY_COLORS[rec.priority];
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="p-3.5 rounded-lg border bg-slate-900/40 border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg border flex-shrink-0 ${colors.bg} ${colors.border}`}>
                  <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-white text-sm font-medium truncate">{rec.title}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                      {PRIORITY_LABELS[rec.priority]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{rec.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">{rec.saving}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-1 w-16 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-xs">%{rec.confidence}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors ml-auto" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-1 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-center">
        <p className="text-slate-400 text-xs">
          Öneriler uygulanırsa toplam tasarruf potansiyeli:
        </p>
        <p className="text-white font-bold text-lg mt-0.5">~154 m³/gün</p>
        <p className="text-emerald-400 text-xs">≈ ₺4,620 günlük maliyet tasarrufu</p>
      </div>
    </motion.div>
  );
}
