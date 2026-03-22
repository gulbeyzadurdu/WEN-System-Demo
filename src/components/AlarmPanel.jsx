
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { alarms } from "../utils/mockData.js";

const SEVERITY_CONFIG = {
  critical: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Kritik" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Uyarı" },
  info: { icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Bilgi" },
};

export function AlarmPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-base">Aktif Alarmlar</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
          {alarms.length} Aktif
        </span>
      </div>

      <div className="space-y-2">
        {alarms.map((alarm, i) => {
          const config = SEVERITY_CONFIG[alarm.severity] || SEVERITY_CONFIG.info;
          const Icon = config.icon;
          return (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i + 0.4 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg} ${config.border}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium">{alarm.factory}</p>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{alarm.message}</p>
              </div>
              <span className="text-slate-500 text-xs flex-shrink-0">{alarm.time}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
