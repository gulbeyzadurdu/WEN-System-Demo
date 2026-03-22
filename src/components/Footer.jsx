
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, FileText } from "lucide-react";

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-700/50 bg-slate-900/80 px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>© 2026 WEN System v1.0</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Veriler simüle edilmektedir</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Yasal Uyarı & KVKK</span>
            </button>
            <a href="#" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              <span>Gizlilik Politikası</span>
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">Yasal Uyarı & KVKK</h2>
                    <p className="text-slate-400 text-xs">Kişisel Verilerin Korunması Kanunu</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm text-slate-300">
                <section>
                  <h3 className="text-white font-semibold mb-2">1. Yasal Uyarı</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Bu platform, WEN System v1.0 — Water-Energy Nexus Optimization Platform'un prototip aşamasındadır.
                    Gösterilen tüm veriler <strong className="text-amber-400">simülasyon amaçlıdır</strong> ve gerçek
                    sistem verilerini yansıtmamaktadır. Veriler yalnızca eğitim ve demonstrasyon amacıyla kullanılmaktadır.
                  </p>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">2. Veri Sorumlusu</h3>
                  <p className="text-slate-400 leading-relaxed">
                    6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu,
                    <strong className="text-white"> Bursa Organize Sanayi Bölgesi Müdürlüğü</strong>'dür.
                  </p>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">3. İşlenen Veriler</h3>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Kullanıcı kimlik bilgileri (ad, soyad, kurumsal e-posta)</li>
                    <li>Sistem erişim logları (IP adresi, erişim zamanı)</li>
                    <li>Fabrika bazlı su tüketim verileri (anonim istatistik)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">4. Veri Saklama Süresi</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Kişisel veriler, hukuki yükümlülükler çerçevesinde azami <strong className="text-white">5 yıl</strong> süreyle saklanmakta,
                    bu sürenin sonunda güvenli imha yöntemleriyle silinmektedir.
                  </p>
                </section>

                <section>
                  <h3 className="text-white font-semibold mb-2">5. Haklarınız</h3>
                  <p className="text-slate-400 leading-relaxed">
                    KVKK'nın 11. maddesi kapsamında verilerinize erişim, düzeltme, silme ve itiraz haklarınız mevcuttur.
                    Başvurularınız için: <strong className="text-blue-400">kvkk@bosb.gov.tr</strong>
                  </p>
                </section>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-300 text-xs text-center">
                    Bu platform ISO 27001 ve KVKK standartlarına uygun geliştirilmiştir.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
