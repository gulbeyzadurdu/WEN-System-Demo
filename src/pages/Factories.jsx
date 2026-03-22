
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Factory, ChevronUp, ChevronDown } from "lucide-react";
import { FACTORIES } from "../utils/mockData.js";
import { STATUS_COLORS, STATUS_LABELS } from "../constants/index.js";

export default function Factories() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = FACTORIES.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.sector.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    let av = a[sortField];
    let bv = b[sortField];
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-3.5 h-3.5 text-slate-600" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
      : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-xl font-bold">Fabrika Listesi</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          OSB'deki tüm fabrikaların su tüketim durumu · {FACTORIES.length} Fabrika
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Fabrika adı, sektör veya lokasyon ara..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60">
                {[
                  { label: "Fabrika Adı", field: "name" },
                  { label: "Sektör", field: "sector" },
                  { label: "Lokasyon", field: "location" },
                  { label: "Su Kotası (m³)", field: "waterQuota" },
                  { label: "Yetkili", field: "contactPerson" },
                  { label: "Durum", field: "status" },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="text-left text-slate-400 font-medium px-4 py-3 cursor-pointer hover:text-white transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon field={col.field} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-500 py-12">
                    <Factory className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Arama kriterine uygun fabrika bulunamadı.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((factory, i) => {
                  const statusColors = STATUS_COLORS[factory.status];
                  return (
                    <motion.tr
                      key={factory.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.02 * i }}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{factory.name}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{factory.sector}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{factory.location}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono whitespace-nowrap">
                        {factory.waterQuota.toLocaleString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{factory.contactPerson}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                          {STATUS_LABELS[factory.status]}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} / {FACTORIES.length} fabrika gösteriliyor</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />Normal: {FACTORIES.filter((f) => f.status === "normal").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />Uyarı: {FACTORIES.filter((f) => f.status === "warning").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />Kritik: {FACTORIES.filter((f) => f.status === "critical").length}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
