
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Trash2, PauseCircle, PlayCircle, Download } from "lucide-react";
import { useSimulation } from "../context/SimulationContext.jsx";

const LOG_COLORS = {
  info:    { text: "text-slate-300", prefix: "text-blue-400",    label: "INFO " },
  success: { text: "text-emerald-300", prefix: "text-emerald-500", label: "OK   " },
  warn:    { text: "text-amber-300",  prefix: "text-amber-400",  label: "WARN " },
  error:   { text: "text-red-300",   prefix: "text-red-500",    label: "ERROR" },
};

export function SystemLog() {
  const { logs } = useSimulation();
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("all");
  const [cleared, setCleared] = useState(0);

  const visibleLogs = logs.slice(cleared).filter(
    (l) => filter === "all" || l.type === filter
  );

  useEffect(() => {
    if (!paused && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, paused]);

  const downloadLogs = () => {
    const text = logs
      .map((l) => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bosb-wms-log-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-950 border border-slate-700/60 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400 text-xs font-mono">bosb-wms — sistem-log-akışı</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {["all", "info", "success", "warn", "error"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-2 py-0.5 rounded font-mono transition-colors ${
                filter === f
                  ? "bg-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "ALL" : f.toUpperCase()}
            </button>
          ))}
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => setPaused((p) => !p)}
            title={paused ? "Devam ettir" : "Duraklat"}
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
          >
            {paused
              ? <PlayCircle className="w-3.5 h-3.5" />
              : <PauseCircle className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={downloadLogs}
            title="Log dosyasını indir"
            className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCleared(logs.length)}
            title="Ekranı temizle"
            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-52 overflow-y-auto p-3 font-mono text-xs leading-6 space-y-0.5 scroll-smooth"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}
      >
        {visibleLogs.length === 0 ? (
          <p className="text-slate-600 italic">Log bulunamadı.</p>
        ) : (
          visibleLogs.map((log) => {
            const cfg = LOG_COLORS[log.type] || LOG_COLORS.info;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-2 group"
              >
                <span className="text-slate-600 flex-shrink-0 select-none">{log.time}</span>
                <span className={`flex-shrink-0 font-bold select-none ${cfg.prefix}`}>[{cfg.label}]</span>
                <span className={`${cfg.text} break-all`}>{log.message}</span>
              </motion.div>
            );
          })
        )}
        {!paused && (
          <div className="flex items-center gap-1 text-slate-600 mt-1">
            <span className="animate-pulse">█</span>
          </div>
        )}
        {paused && (
          <div className="flex items-center gap-1 text-amber-600/60 mt-1 text-xs italic">
            — duraklat modu —
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 border-t border-slate-800 bg-slate-900/50">
        <span className="text-slate-600 text-xs font-mono">
          {visibleLogs.length} kayıt
        </span>
        <span className="text-slate-600 text-xs font-mono">
          {paused ? "⏸ DURAKLADI" : "● CANLI"}
        </span>
      </div>
    </motion.div>
  );
}
