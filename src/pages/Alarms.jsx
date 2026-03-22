
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, Bell } from "lucide-react";
import { alarms } from "../utils/mockData.js";

const SEVERITY_CONFIG = {
  critical: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Kritik" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Uyarı" },
};

export default function Alarms() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-xl font-bold">Alarmlar</h1>
        <p className="text-slate-400 text-sm mt-0.5">Aktif alarm ve uyarılar · {alarms.length} aktif</p>
      </motion.div>

      <div className="space-y-3">
        {alarms.map((alarm, i) => {
          const config = SEVERITY_CONFIG[alarm.severity] || SEVERITY_CONFIG.warning;
          const Icon = config.icon;
          return (
            <motion.div
              key={alarm.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} ${config.border}`}
            >
              <div className={`p-2 rounded-lg ${config.bg} ${config.border} border flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold">{alarm.factory}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.bg} ${config.color} ${config.border}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{alarm.message}</p>
                <p className="text-slate-500 text-xs mt-1">Bugün {alarm.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {alarms.length === 0 && (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 mx-auto text-emerald-400 mb-3 opacity-60" />
          <p className="text-white font-medium">Aktif alarm yok</p>
          <p className="text-slate-400 text-sm mt-1">Tüm sistemler normal çalışıyor.</p>
        </div>
      )}
    </div>
  );
}
