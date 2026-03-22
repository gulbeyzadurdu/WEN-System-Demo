
import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Zap, Thermometer, AlertOctagon, CheckCircle2, RotateCcw } from "lucide-react";
import { useSimulation } from "../context/SimulationContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

export function AdminPanel() {
  const { simulatedTemp, updateTemp, isEmergency, triggerEmergency, cancelEmergency, addLog } = useSimulation();
  const { settings, toDisplay, unitSymbol } = useSettings();
  const [localTemp, setLocalTemp] = useState(simulatedTemp);
  const [confirmEmergency, setConfirmEmergency] = useState(false);

  const { criticalTempThreshold } = settings;

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setLocalTemp(val);
    updateTemp(val);
  };

  const resetTemp = () => {
    setLocalTemp(32.4);
    updateTemp(32.4);
    addLog("Sıcaklık baz değere sıfırlandı: 32.4°C", "info");
  };

  const tempColor =
    localTemp >= criticalTempThreshold + 5 ? "text-red-400" :
    localTemp >= criticalTempThreshold ? "text-orange-400" :
    localTemp >= criticalTempThreshold - 5 ? "text-amber-400" :
    localTemp >= 18 ? "text-emerald-400" :
    "text-blue-400";

  const trackFill = ((localTemp - 5) / (50 - 5)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-700/50 bg-slate-900/40">
        <div className="p-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg">
          <Sliders className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">Yönetici Kontrol Paneli</h2>
          <p className="text-slate-500 text-xs">Simülasyon parametrelerini kontrol edin</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-400 text-xs font-medium">Admin</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm font-medium">Simüle Edilen Sıcaklık</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold font-mono ${tempColor}`}>
                {toDisplay(localTemp)}{unitSymbol}
              </span>
              <button
                onClick={resetTemp}
                title="Baz değere sıfırla"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative py-2">
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
                style={{
                  width: `${trackFill}%`,
                  background: localTemp >= 40
                    ? "linear-gradient(90deg, #3b82f6, #f59e0b, #ef4444)"
                    : localTemp >= 28
                    ? "linear-gradient(90deg, #3b82f6, #f59e0b)"
                    : "linear-gradient(90deg, #3b82f6, #10b981)",
                }}
              />
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={0.1}
              value={localTemp}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              style={{ margin: 0 }}
            />
            <input
              type="range"
              min={5}
              max={50}
              step={0.1}
              value={localTemp}
              onChange={handleSliderChange}
              className="w-full mt-1 accent-blue-500 cursor-pointer"
              style={{ WebkitAppearance: "none", appearance: "none", background: "transparent", height: "20px" }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500">
            <span>{toDisplay(5)}{unitSymbol}</span>
            <span>{toDisplay(27.5)}{unitSymbol} (Baz)</span>
            <span>{toDisplay(50)}{unitSymbol}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Serin", val: 15, color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
              { label: "Normal", val: 32.4, color: "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" },
              { label: "Aşırı", val: 45, color: "text-red-400 border-red-500/30 hover:bg-red-500/10" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { setLocalTemp(p.val); updateTemp(p.val); }}
                className={`text-xs py-1.5 px-2 rounded-lg border bg-slate-900/40 transition-colors font-medium ${p.color}`}
              >
                {p.label} ({toDisplay(p.val)}{unitSymbol})
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/40 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Tahmini su artışı:</span>
              <span className="text-blue-400 font-medium">
                +{Math.max(0, ((localTemp - 32.4) * 12)).toFixed(0)} m³/gün
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tahmini enerji artışı:</span>
              <span className="text-purple-400 font-medium">
                +{Math.max(0, ((localTemp - 32.4) * 15)).toFixed(0)} kWh/gün
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Risk seviyesi:</span>
              <span className={`font-medium ${localTemp >= criticalTempThreshold + 5 ? "text-red-400" : localTemp >= criticalTempThreshold ? "text-orange-400" : "text-emerald-400"}`}>
                {localTemp >= criticalTempThreshold + 5 ? "KRİTİK" : localTemp >= criticalTempThreshold ? "YÜKSEK" : "NORMAL"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm font-medium">Acil Durum Kontrolü</span>
          </div>

          <div className="p-4 rounded-xl border bg-slate-900/60 border-slate-700/40 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${isEmergency ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
              <div>
                <p className="text-white text-sm font-medium">
                  {isEmergency ? "Protokol Aktif — Tüm Vanalar KAPALI" : "Normal Operasyon — Sistem Hazır"}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {isEmergency
                    ? "EP-001 protokolü devrede. Su tüketimi minimize edildi."
                    : "Acil durum butonu tüm su akışını durdurur."}
                </p>
              </div>
            </div>

            {!isEmergency ? (
              <>
                {!confirmEmergency ? (
                  <button
                    onClick={() => setConfirmEmergency(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 hover:border-red-500/60 text-red-400 font-semibold text-sm transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Acil Durum Su Kesintisi
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-amber-400 text-xs text-center font-medium">
                      ⚠️ Bu işlem tüm su akışını durduracak. Onaylıyor musunuz?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { triggerEmergency(); setConfirmEmergency(false); }}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors"
                      >
                        Evet, Onayla
                      </button>
                      <button
                        onClick={() => { setConfirmEmergency(false); addLog("Acil durum protokolü iptal edildi (kullanıcı onaylamadı).", "info"); }}
                        className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={cancelEmergency}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold text-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Normal Operasyona Dön
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Tüm Sensörleri Sıfırla", action: () => addLog("Sensör kalibrasyonu başlatıldı. 48 sensör sıfırlanıyor...", "info"), color: "text-slate-300 border-slate-600 hover:bg-slate-700/40" },
              { label: "Rapor Oluştur", action: () => addLog("PDF raporu oluşturuldu: BOSB_WMS_rapor_21-03-2026.pdf", "success"), color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
              { label: "Veri Yedekle", action: () => addLog("Veritabanı yedeği alınıyor... Tamamlandı (128 MB).", "success"), color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10" },
              { label: "Bakım Modu", action: () => addLog("Bakım modu aktive edildi. Operatörler bilgilendirildi.", "warn"), color: "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`text-xs py-2 px-3 rounded-lg border bg-slate-900/40 transition-colors font-medium text-left ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
