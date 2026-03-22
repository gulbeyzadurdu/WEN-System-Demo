
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, X, ShieldAlert, Phone } from "lucide-react";
import { useSimulation } from "../context/SimulationContext.jsx";

export function EmergencyOverlay() {
  const { isEmergency, cancelEmergency } = useSimulation();

  return (
    <>
      {isEmergency && (
        <div className="fixed inset-0 z-50 pointer-events-none border-4 border-red-500/60 animate-pulse" />
      )}

      <AnimatePresence>
        {isEmergency && (
          <>
            <motion.div
              key="emergency-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
              }}
            />

            <motion.div
              key="emergency-banner"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-4 inset-x-0 mx-auto z-[60] w-full max-w-2xl px-4 flex justify-center"
            >
              <div className="bg-red-950/95 backdrop-blur-md border-2 border-red-500 rounded-2xl shadow-2xl shadow-red-500/30 overflow-hidden">
                <div className="flex items-center gap-1 bg-red-500 px-4 py-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                  <span className="text-white text-xs font-bold tracking-widest uppercase flex-1 text-center">
                    Acil Durum Protokolü Aktif
                  </span>
                  <span className="text-red-200 text-xs font-mono">KOD KIRMIZI</span>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                      className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex-shrink-0"
                    >
                      <ShieldAlert className="w-8 h-8 text-red-400" />
                    </motion.div>

                    <div className="flex-1">
                      <h2 className="text-red-300 text-lg font-bold mb-1">
                        Acil Durum Su Kesintisi Etkinleştirildi
                      </h2>
                      <p className="text-red-200/80 text-sm leading-relaxed mb-3">
                        Tüm fabrika su vanalarına kapatma komutu gönderildi.
                        Su tüketimi minimuma indirildi. Sistem log akışını takip edin.
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { label: "Aktif Vana", value: "0 / 48", color: "text-red-400" },
                          { label: "Su Akışı", value: "≈ 0 m³/h", color: "text-red-400" },
                          { label: "Protokol", value: "EP-001", color: "text-amber-400" },
                        ].map((s) => (
                          <div key={s.label} className="bg-red-900/40 border border-red-500/20 rounded-lg p-2.5 text-center">
                            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-red-300/60 text-xs mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <p className="text-amber-300 text-xs">
                          Kriz Koordinatörü: <strong>+90 224 000 00 00</strong> · BOSB Güvenlik: <strong>+90 224 000 00 01</strong>
                        </p>
                      </div>

                      <button
                        onClick={cancelEmergency}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white text-sm rounded-lg transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        Acil Durumu İptal Et — Normal Operasyona Dön
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
