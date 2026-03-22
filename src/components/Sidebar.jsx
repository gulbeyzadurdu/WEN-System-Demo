
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Factory, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, Droplets, X, Menu,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { SIDEBAR_ITEMS } from "../constants/index.js";
import { alarms } from "../utils/mockData.js";

const ICON_MAP = {
  LayoutDashboard, Factory, BarChart3, Bell, Settings,
};

function SidebarContent({ collapsed = false, onToggle, onClose, isMobile = false }) {
  const [location] = useLocation();
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-white text-sm font-bold leading-tight">WEN System</p>
                <p className="text-slate-400 text-xs leading-tight">v1.0</p>
              </div>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mx-auto"
            >
              <Droplets className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1">
          {onToggle && (
            <button
              onClick={onToggle}
              className="hidden md:flex w-7 h-7 rounded-md items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="flex w-7 h-7 rounded-md items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          const alarmCount = item.id === "alarms" ? alarms.length : null;

          return (
            <Link key={item.id} href={item.path}>
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors relative group
                  ${isActive
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/60 border border-transparent"
                  }`}
                onClick={onClose}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {alarmCount && !isCollapsed && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                    {alarmCount}
                  </span>
                )}
                {alarmCount && isCollapsed && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {alarmCount}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            SA
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="text-white text-xs font-medium">Sistem Admin</p>
                <p className="text-slate-500 text-xs">admin@bosb.gov.tr</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, toggle, mobileOpen, closeMobile }) {
  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col flex-shrink-0 bg-slate-900 border-r border-slate-700/50 h-screen sticky top-0 overflow-hidden"
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={toggle}
          onClose={closeMobile}
        />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-700/50 z-50 md:hidden flex flex-col overflow-hidden"
            >
              <SidebarContent
                collapsed={false}
                isMobile={true}
                onClose={closeMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
