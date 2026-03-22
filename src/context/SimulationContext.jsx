
import { createContext, useContext, useState, useCallback, useRef } from "react";

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [simulatedTemp, setSimulatedTemp] = useState(32.4);
  const [isEmergency, setIsEmergency] = useState(false);
  const [logs, setLogs] = useState([
    { id: 0, time: "12:00:00", message: "Sistem başlatıldı. WEN System v1.0 aktif.", type: "info" },
    { id: 1, time: "12:00:01", message: "Sensör ağı bağlantısı kuruldu. 48 aktif sensör.", type: "success" },
    { id: 2, time: "12:00:02", message: "Simülasyon modu etkin. Veriler gerçek zamanlı işleniyor.", type: "warn" },
  ]);
  const logIdRef = useRef(3);

  const addLog = useCallback((message, type = "info") => {
    const now = new Date();
    const time = now.toTimeString().split(" ")[0];
    setLogs((prev) => {
      const next = [...prev, { id: logIdRef.current++, time, message, type }];
      return next.slice(-120);
    });
  }, []);

  const updateTemp = useCallback((value) => {
    setSimulatedTemp(value);
    const delta = (value - 32.4).toFixed(1);
    const dir = delta >= 0 ? "▲" : "▼";
    addLog(
      `Simüle edilen sıcaklık güncellendi: ${value.toFixed(1)}°C  (${dir}${Math.abs(delta)}°C baz değerden)`,
      value > 38 ? "warn" : value < 15 ? "warn" : "info"
    );
  }, [addLog]);

  const triggerEmergency = useCallback(() => {
    setIsEmergency(true);
    addLog("⚡ ACİL DURUM: Su kesintisi protokolü etkinleştirildi!", "error");
    addLog("Tüm fabrika su vanalarına KAPALI komutu gönderiliyor...", "error");
    addLog("Kriz Yönetim Ekibi'ne SMS & e-posta bildirimi iletildi.", "warn");
    addLog("Rezerv pompa sistemi devreye alındı.", "warn");
  }, [addLog]);

  const cancelEmergency = useCallback(() => {
    setIsEmergency(false);
    addLog("✅ Acil durum protokolü iptal edildi. Normal operasyona dönülüyor.", "success");
    addLog("Su vanalarına AÇIK komutu gönderiliyor...", "info");
    addLog("Sistem durumu: Normal operasyon.", "success");
  }, [addLog]);

  return (
    <SimulationContext.Provider
      value={{
        simulatedTemp,
        updateTemp,
        isEmergency,
        triggerEmergency,
        cancelEmergency,
        logs,
        addLog,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside SimulationProvider");
  return ctx;
}
