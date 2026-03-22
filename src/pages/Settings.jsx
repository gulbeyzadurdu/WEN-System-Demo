
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Thermometer, Droplets, Bell, Mail, MessageSquare, FileText,
  Cpu, Wifi, Radio, Globe, Ruler, Save, RotateCcw, CheckCircle2,
  ChevronDown, Server, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings, SETTINGS_DEFAULTS, UNIT_SYMBOLS, LANG_LABELS } from "../context/SettingsContext.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";

function SectionCard({ icon: Icon, title, description, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50 bg-slate-800/40">
        <div className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25">
          <Icon className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="text-white text-sm font-semibold">{title}</h2>
          {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function ThresholdInput({ label, sublabel, value, onChange, min, max, unit, color = "blue" }) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor = color === "red" ? "bg-red-500" : "bg-blue-500";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-200 text-sm font-medium">{label}</p>
          {sublabel && <p className="text-slate-400 text-xs">{sublabel}</p>}
        </div>
        <div className="flex items-center gap-1.5 bg-slate-700/60 border border-slate-600/50 rounded-lg px-3 py-1.5">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
            className="w-10 bg-transparent text-white text-sm font-bold text-right outline-none"
          />
          <span className="text-slate-400 text-xs">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${trackColor} rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
      </div>
      <div className="flex justify-between text-slate-500 text-xs">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-500" : "bg-slate-600"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-md ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function NotificationRow({ icon: Icon, label, sublabel, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${checked ? "bg-blue-500/15 border border-blue-500/25" : "bg-slate-700/50 border border-slate-600/40"}`}>
          <Icon className={`w-3.5 h-3.5 ${checked ? "text-blue-400" : "text-slate-500"}`} />
        </div>
        <div>
          <p className="text-slate-200 text-sm font-medium">{label}</p>
          <p className="text-slate-400 text-xs">{sublabel}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function DeviceCard({ icon: Icon, label, value, status }) {
  const statusMap = {
    online: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Çevrimiçi" },
    warning: { dot: "bg-amber-400", text: "text-amber-400", label: "Uyarı" },
    offline: { dot: "bg-red-400", text: "text-red-400", label: "Çevrimdışı" },
  };
  const s = statusMap[status] || statusMap.online;

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
      <div className="p-2.5 bg-slate-800 border border-slate-600/40 rounded-lg flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white text-sm font-semibold truncate">{value}</p>
      </div>
      {status && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
          <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <p className="text-slate-300 text-sm font-medium">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-900/60 border border-slate-600/60 text-white text-sm rounded-xl px-4 py-2.5 pr-9 outline-none focus:border-blue-500/60 transition-colors cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-slate-900">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Settings() {
  const { settings: committedSettings, saveSettings } = useSettings();
  const { addLog } = useSimulation();

  const [pending, setPending] = useState(committedSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setPending(committedSettings);
    setIsDirty(false);
  }, [committedSettings]);

  const update = (key, value) => {
    setPending((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setJustSaved(false);
  };

  const handleSave = () => {
    const { prev, next } = saveSettings(pending);

    const changes = [];
    if (next.criticalTempThreshold !== prev.criticalTempThreshold)
      changes.push(`Kritik eşik: ${prev.criticalTempThreshold}°C → ${next.criticalTempThreshold}°C`);
    if (next.minWaterReserve !== prev.minWaterReserve)
      changes.push(`Su rezerv min: %${prev.minWaterReserve} → %${next.minWaterReserve}`);
    if (next.unit !== prev.unit)
      changes.push(`Birim: ${UNIT_SYMBOLS[prev.unit]} → ${UNIT_SYMBOLS[next.unit]}`);
    if (next.language !== prev.language)
      changes.push(`Dil: ${LANG_LABELS[prev.language]} → ${LANG_LABELS[next.language]}`);

    const notifChanges = ["emailReports","criticalSms","weeklySummary","maintenanceAlerts"]
      .filter((k) => next[k] !== prev[k]);
    if (notifChanges.length > 0)
      changes.push(`${notifChanges.length} bildirim tercihi güncellendi`);

    if (changes.length > 0) {
      addLog(`⚙️ Ayarlar kaydedildi — ${changes.join(" | ")}`, "success");
    } else {
      addLog("⚙️ Ayarlar kaydedildi (değişiklik yok).", "info");
    }

    setIsDirty(false);
    setJustSaved(true);
    toast.success("Ayarlar Başarıyla Güncellendi", {
      description: changes.length > 0 ? changes.join(" · ") : "Tüm değerler mevcut durumda.",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      position: "top-right",
      duration: 4000,
    });
    setTimeout(() => setJustSaved(false), 3000);
  };

  const handleReset = () => {
    setPending(SETTINGS_DEFAULTS);
    setIsDirty(true);
    setJustSaved(false);
    toast.info("Varsayılan Değerler Yüklendi", {
      description: "Kaydetmek için 'Değişiklikleri Kaydet' butonuna tıklayın.",
      position: "top-right",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-white text-xl font-bold">Sistem Ayarları</h1>
          <p className="text-slate-400 text-sm mt-1">
            WEN System v1.0 yapılandırma ve tercihler
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-medium">Kaydedilmemiş değişiklikler</span>
            </motion.div>
          )}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-xs">v2.4.1 — Kararlı</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard
          icon={Thermometer}
          title="Sistem Eşik Değerleri"
          description="Kritik uyarı tetikleyici sınır değerleri"
          delay={0.05}
        >
          <div className="space-y-6">
            <ThresholdInput
              label="Kritik Sıcaklık Uyarı Eşiği"
              sublabel="Bu değerin üzerinde alarm tetiklenir ve Dashboard rengi değişir"
              value={pending.criticalTempThreshold}
              onChange={(v) => update("criticalTempThreshold", v)}
              min={20}
              max={55}
              unit="°C"
              color="red"
            />
            <div className="border-t border-slate-700/40" />
            <ThresholdInput
              label="Minimum Su Rezerv Seviyesi"
              sublabel="Bu değerin altında su rezerv kartı kırmızıya döner"
              value={pending.minWaterReserve}
              onChange={(v) => update("minWaterReserve", v)}
              min={5}
              max={50}
              unit="%"
              color="blue"
            />

            {(pending.criticalTempThreshold !== committedSettings.criticalTempThreshold ||
              pending.minWaterReserve !== committedSettings.minWaterReserve) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-amber-300"
              >
                ⚠️ Eşik değerleri değiştirildi. Kaydetmek için aşağıdaki butona tıklayın.
              </motion.div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          icon={Bell}
          title="Bildirim Ayarları"
          description="Alarm ve rapor iletişim tercihleri"
          delay={0.1}
        >
          <div>
            <NotificationRow
              icon={Mail}
              label="E-posta ile Rapor Al"
              sublabel="Günlük operasyonel raporlar e-posta ile iletilir"
              checked={pending.emailReports}
              onChange={(v) => update("emailReports", v)}
            />
            <NotificationRow
              icon={MessageSquare}
              label="Kritik Alarmlarda SMS Gönder"
              sublabel="Acil durum ve kritik alarmlar için SMS bildirimi"
              checked={pending.criticalSms}
              onChange={(v) => update("criticalSms", v)}
            />
            <NotificationRow
              icon={FileText}
              label="Haftalık Tasarruf Özeti"
              sublabel="Her Pazartesi 08:00'de haftalık özet raporu"
              checked={pending.weeklySummary}
              onChange={(v) => update("weeklySummary", v)}
            />
            <NotificationRow
              icon={Activity}
              label="Bakım Hatırlatıcıları"
              sublabel="Planlı bakım tarihleri için önceden bildirim"
              checked={pending.maintenanceAlerts}
              onChange={(v) => update("maintenanceAlerts", v)}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={Cpu}
          title="Cihaz Bağlantıları (IoT Gateway)"
          description="Ağ cihazları ve sensör durumu"
          delay={0.15}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DeviceCard icon={Radio} label="Bağlı Sensör Sayısı" value="124 Sensör" status="online" />
            <DeviceCard icon={Wifi} label="Gateway Durumu" value="BOSB-GW-01" status="online" />
            <DeviceCard icon={Server} label="MQTT Broker" value="broker.bosb.local:1883" status="online" />
            <DeviceCard icon={Activity} label="Veri Gecikmesi" value="≈ 42 ms" status="online" />
          </div>
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-emerald-400 text-xs font-medium">
                Tüm cihazlar çevrimiçi · Son senkronizasyon: 12:00:08
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={Globe}
          title="Bölgesel Ayarlar"
          description="Dil, birim ve yerelleştirme tercihleri"
          delay={0.2}
        >
          <div className="space-y-5">
            <SelectField
              label="Arayüz Dili"
              value={pending.language}
              onChange={(v) => update("language", v)}
              options={[
                { value: "tr", label: "🇹🇷  Türkçe" },
                { value: "en", label: "🇬🇧  English" },
                { value: "de", label: "🇩🇪  Deutsch" },
              ]}
            />
            <SelectField
              label="Sıcaklık Birimi"
              value={pending.unit}
              onChange={(v) => update("unit", v)}
              options={[
                { value: "celsius", label: "°C — Celsius" },
                { value: "fahrenheit", label: "°F — Fahrenheit" },
                { value: "kelvin", label: "K — Kelvin" },
              ]}
            />
            {pending.unit !== committedSettings.unit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-blue-300"
              >
                Birim değişikliği kaydedilince tüm sıcaklık göstergeleri güncellenecektir.
              </motion.div>
            )}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Zaman Dilimi</p>
                <p className="text-white text-sm font-medium">UTC+3 — İstanbul</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Tarih Formatı</p>
                <p className="text-white text-sm font-medium">GG/AA/YYYY</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2"
      >
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600/60 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-500/60 transition-all text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Varsayılana Dön
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all text-sm font-semibold shadow-lg ${
            isDirty
              ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 cursor-pointer"
              : justSaved
              ? "bg-emerald-600 shadow-emerald-500/20 cursor-default"
              : "bg-slate-700 shadow-none cursor-not-allowed opacity-60"
          }`}
        >
          {justSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Kaydedildi</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isDirty ? "Değişiklikleri Kaydet" : "Değişiklik Yok"}</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
