
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Thermometer, Droplets, AlertTriangle, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "../components/StatCard.jsx";
import { CorrelationChart } from "../components/CorrelationChart.jsx";
import { SmartRecommendations } from "../components/SmartRecommendations.jsx";
import { AlarmPanel } from "../components/AlarmPanel.jsx";
import { AdminPanel } from "../components/AdminPanel.jsx";
import { SystemLog } from "../components/SystemLog.jsx";
import { currentStats } from "../utils/mockData.js";
import { useSimulation } from "../context/SimulationContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

export default function Dashboard() {
  const { simulatedTemp, isEmergency } = useSimulation();
  const { settings, toDisplay, unitSymbol } = useSettings();

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Veriler Simüle Edilmektedir", {
        description: "Bu dashboard prototip amaçlıdır. Gösterilen tüm veriler simülasyona dayanmaktadır.",
        duration: 6000,
        icon: "⚠️",
        position: "bottom-right",
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const { criticalTempThreshold, minWaterReserve } = settings;

  const liveWaterReserve = isEmergency
    ? (currentStats.waterReserve + 4.2).toFixed(1)
    : Math.max(0, (currentStats.waterReserve - Math.max(0, simulatedTemp - 32.4) * 0.8)).toFixed(1);

  const liveAlarms = isEmergency
    ? currentStats.activeAlarms + 2
    : simulatedTemp >= criticalTempThreshold
    ? currentStats.activeAlarms + 1
    : currentStats.activeAlarms;

  const liveSavings = isEmergency
    ? 94.3
    : Math.max(0, currentStats.savingsRate - Math.max(0, (simulatedTemp - 32.4) * 1.2)).toFixed(1);

  const displayTemp = toDisplay(simulatedTemp);
  const displayThreshold = toDisplay(criticalTempThreshold);
  const isHot = simulatedTemp >= criticalTempThreshold;
  const isWarm = simulatedTemp >= criticalTempThreshold * 0.85;
  const isLowWater = parseFloat(liveWaterReserve) < minWaterReserve;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-white text-xl font-bold">WEN System v1.0</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Water-Energy Nexus Optimization Platform
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Anlık Sıcaklık"
          value={displayTemp}
          unit={unitSymbol}
          icon={Thermometer}
          color={isHot ? "red" : isWarm ? "amber" : "blue"}
          trendLabel={`Eşik: ${displayThreshold}${unitSymbol}`}
          delay={0}
        />
        <StatCard
          title="Toplam Su Rezervi"
          value={liveWaterReserve}
          unit="%"
          icon={Droplets}
          color={isEmergency ? "emerald" : isLowWater ? "red" : "blue"}
          trend={isEmergency ? 1 : -1}
          trendLabel={isEmergency ? "Acil durum modu" : `Min eşik: %${minWaterReserve}`}
          delay={0.05}
        />
        <StatCard
          title="Aktif Alarmlar"
          value={liveAlarms}
          unit="adet"
          icon={AlertTriangle}
          color={liveAlarms > 4 ? "red" : "red"}
          trendLabel={isEmergency ? "ACİL DURUM aktif!" : isHot ? `Sıcaklık eşiği aşıldı!` : "2 kritik, 1 uyarı"}
          delay={0.1}
        />
        <StatCard
          title="Günlük Tasarruf"
          value={liveSavings}
          unit="%"
          icon={TrendingDown}
          color="emerald"
          trend={isEmergency ? 1 : 1}
          trendLabel={isEmergency ? "Acil kesiyle maks tasarruf" : "Hedef %15"}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CorrelationChart />
        </div>
        <div className="xl:col-span-1">
          <SmartRecommendations />
        </div>
      </div>

      <AlarmPanel />

      <AdminPanel />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold text-base">Sistem Log Akışı</h2>
          <span className="text-xs text-slate-500 font-mono">— gerçek zamanlı</span>
        </div>
        <SystemLog />
      </div>
    </div>
  );
}
