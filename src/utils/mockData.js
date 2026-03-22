
const FACTORIES = [
  { id: 1, name: "BOSB Otomotiv A.Ş.", sector: "Otomotiv", location: "B-4 Blok", waterQuota: 850, status: "normal", contactPerson: "Ahmet Kaya" },
  { id: 2, name: "Bursa Tekstil Fab.", sector: "Tekstil", location: "C-7 Blok", waterQuota: 1200, status: "warning", contactPerson: "Ayşe Demir" },
  { id: 3, name: "MetalForm Sanayi", sector: "Metal İşleme", location: "A-2 Blok", waterQuota: 640, status: "normal", contactPerson: "Mehmet Yılmaz" },
  { id: 4, name: "EnerjiPlast Ltd.", sector: "Plastik", location: "D-1 Blok", waterQuota: 420, status: "critical", contactPerson: "Fatma Şahin" },
  { id: 5, name: "Uludağ Gıda San.", sector: "Gıda", location: "E-3 Blok", waterQuota: 980, status: "normal", contactPerson: "Ali Çelik" },
  { id: 6, name: "BursaElektronik", sector: "Elektronik", location: "F-5 Blok", waterQuota: 310, status: "normal", contactPerson: "Zeynep Arslan" },
  { id: 7, name: "Kimyasal Çözüm A.Ş.", sector: "Kimya", location: "G-9 Blok", waterQuota: 760, status: "warning", contactPerson: "Hasan Güler" },
  { id: 8, name: "Beton & Yapı Malz.", sector: "İnşaat", location: "H-2 Blok", waterQuota: 540, status: "normal", contactPerson: "Neslihan Kurt" },
  { id: 9, name: "Oto Yedek Parça", sector: "Otomotiv", location: "B-8 Blok", waterQuota: 390, status: "normal", contactPerson: "Serkan Öztürk" },
  { id: 10, name: "Tarım Makineleri", sector: "Tarım", location: "I-4 Blok", waterQuota: 290, status: "normal", contactPerson: "Hatice Aydın" },
  { id: 11, name: "Ambalaj Teknoloji", sector: "Ambalaj", location: "J-6 Blok", waterQuota: 480, status: "normal", contactPerson: "Burak Şimşek" },
  { id: 12, name: "Endüstri Boyalar", sector: "Kimya", location: "G-3 Blok", waterQuota: 350, status: "warning", contactPerson: "Selin Koç" },
];

function generateHourlyData() {
  const data = [];
  const now = new Date("2026-03-21T12:00:00");

  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(hour, 0, 0, 0);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayFactor = isWeekend ? 0.72 : 1.0;

      const hourlyTempBase = hour < 6 ? 18 : hour < 12 ? 22 + (hour - 6) * 1.5 : hour < 16 ? 32 - (hour - 12) * 0.5 : 26 - (hour - 16) * 1.2;
      const seasonOffset = -2 + Math.sin((day / 7) * Math.PI) * 3;
      const temperature = Math.round((hourlyTempBase + seasonOffset + (Math.random() - 0.5) * 1.5) * 10) / 10;

      const baseConsumption = 180;
      const tempEffect = Math.max(0, (temperature - 15)) * 12;
      const hourEffect = hour >= 8 && hour <= 18 ? 80 : 20;
      const noiseEffect = (Math.random() - 0.5) * 30;
      const waterConsumption = Math.round((baseConsumption + tempEffect + hourEffect) * dayFactor + noiseEffect);

      const baseEnergy = 420;
      const energyTempEffect = Math.max(0, (temperature - 20)) * 15;
      const energyHourEffect = hour >= 8 && hour <= 18 ? 120 : 30;
      const energyLoad = Math.round((baseEnergy + energyTempEffect + energyHourEffect) * dayFactor + (Math.random() - 0.5) * 40);

      data.push({
        timestamp: date.toISOString(),
        date: date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }),
        hour: `${String(hour).padStart(2, "0")}:00`,
        dayLabel: date.toLocaleDateString("tr-TR", { weekday: "short", day: "2-digit", month: "2-digit" }),
        temperature,
        waterConsumption,
        energyLoad,
        humidity: Math.round(55 + (temperature - 20) * (-0.8) + (Math.random() - 0.5) * 8),
        pressure: Math.round(101.3 + (Math.random() - 0.5) * 0.5),
      });
    }
  }
  return data;
}

export const hourlyData = generateHourlyData();

export function getDailyAggregates() {
  const byDay = {};
  hourlyData.forEach((d) => {
    if (!byDay[d.date]) {
      byDay[d.date] = { date: d.date, temps: [], water: [], energy: [] };
    }
    byDay[d.date].temps.push(d.temperature);
    byDay[d.date].water.push(d.waterConsumption);
    byDay[d.date].energy.push(d.energyLoad);
  });

  return Object.values(byDay).map((day) => ({
    date: day.date,
    avgTemp: Math.round((day.temps.reduce((a, b) => a + b, 0) / day.temps.length) * 10) / 10,
    maxTemp: Math.max(...day.temps),
    totalWater: Math.round(day.water.reduce((a, b) => a + b, 0)),
    avgEnergy: Math.round(day.energy.reduce((a, b) => a + b, 0) / day.energy.length),
    peakEnergy: Math.max(...day.energy),
  }));
}

export function getTodayHourlyData() {
  const today = new Date("2026-03-21T12:00:00");
  const todayStr = today.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
  return hourlyData.filter((d) => d.date === todayStr);
}

export const currentStats = {
  temperature: 32.4,
  waterReserve: 68.3,
  activeAlarms: 3,
  savingsRate: 12.7,
  humidity: 42,
  pressure: 101.2,
  windSpeed: 14,
};

export const alarms = [
  { id: 1, severity: "critical", message: "EnerjiPlast Ltd. su tüketimi kotayı %25 aştı", time: "12:34", factory: "EnerjiPlast Ltd." },
  { id: 2, severity: "warning", message: "Bursa Tekstil Fab. artan tüketim trendi tespit edildi", time: "11:55", factory: "Bursa Tekstil Fab." },
  { id: 3, severity: "warning", message: "Kimyasal Çözüm A.Ş. su kalitesi parametresi eşikte", time: "10:18", factory: "Kimyasal Çözüm A.Ş." },
];

export const smartRecommendations = [
  {
    id: 1,
    priority: "high",
    icon: "thermometer",
    title: "Chiller Optimizasyonu",
    description: "Sıcaklık 32°C seviyesinde. Chiller sistemlerini %15 kısarak su rezervini koruyun.",
    saving: "~45 m³/gün",
    confidence: 87,
  },
  {
    id: 2,
    priority: "medium",
    icon: "clock",
    title: "Gece Sulama Zamanlaması",
    description: "Saat 02:00-05:00 arası sulama planlanarak buharlaşma kayıpları %30 azaltılabilir.",
    saving: "~28 m³/gün",
    confidence: 92,
  },
  {
    id: 3,
    priority: "medium",
    icon: "droplets",
    title: "Gri Su Geri Dönüşümü",
    description: "B ve C blokları için gri su geri dönüşüm sistemi aktive edilmesi önerilir.",
    saving: "~63 m³/gün",
    confidence: 74,
  },
  {
    id: 4,
    priority: "low",
    icon: "zap",
    title: "Enerji-Su Dengeleme",
    description: "Enerji yükü %68 seviyesinde. Pompa hızı düşürülerek hem enerji hem su tasarrufu sağlanabilir.",
    saving: "~18 m³/gün",
    confidence: 81,
  },
];

export { FACTORIES };
