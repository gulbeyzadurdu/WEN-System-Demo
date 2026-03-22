
export const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/" },
  { id: "factories", label: "Fabrika Listesi", icon: "Factory", path: "/factories" },
  { id: "analytics", label: "Analitik", icon: "BarChart3", path: "/analytics" },
  { id: "alarms", label: "Alarmlar", icon: "Bell", path: "/alarms", badge: 3 },
  { id: "settings", label: "Ayarlar", icon: "Settings", path: "/settings" },
];

export const STATUS_COLORS = {
  normal: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" },
};

export const STATUS_LABELS = {
  normal: "Normal",
  warning: "Uyarı",
  critical: "Kritik",
};

export const PRIORITY_COLORS = {
  high: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  low: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
};

export const PRIORITY_LABELS = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
};
