import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentPage } from "@/hooks/useCurrentPage";
import {
  House,
  NotebookTabs,
  History,
  ChartNoAxesCombined,
  User,
  ChevronLeft,
  ChevronRight,
  Wallet
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Sidebar = () => {
  const { path } = useCurrentPage();
  const user = useAuthStore((state) => state.user);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: "Asosiy", path: "/dashboard", icon: House },
    { name: "Firmalar", path: "/firms", icon: NotebookTabs },
    { name: "Arxiv", path: "/transactions", icon: History },
    { name: "Statistika", path: "/statistika", icon: ChartNoAxesCombined },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="cursor-pointer absolute -right-3.5 top-15 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-full p-1 shadow-sm hover:text-blue-600 transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`h-16 flex items-center border-b border-slate-100 dark:border-slate-800/60 overflow-hidden ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
        <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
            <Wallet size={18} />
          </div>
          {!isCollapsed && (
            <h1 className="text-[19px] font-black text-blue-600 dark:text-blue-500 tracking-tight whitespace-nowrap">
              Savdo daftar
            </h1>
          )}
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 whitespace-nowrap">
            Menyu
          </p>
        )}
        {navLinks.map((link) => {
          const isActive = path === link.path || (link.path !== "/dashboard" && path.startsWith(link.path));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              title={isCollapsed ? link.name : ""}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 font-semibold text-[14px] ${
                isCollapsed ? "justify-center px-0" : "px-3"
              } ${
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-500" : "text-slate-400"}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Profile Section at Bottom */}
      <div className={`p-4 border-t border-slate-100 dark:border-slate-800/60 overflow-hidden`}>
        <Link
          to="/profile"
          title={isCollapsed ? "Profil" : ""}
          className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 font-semibold text-[14px] ${
            isCollapsed ? "justify-center px-0" : "px-3"
          } ${
            path === "/profile"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <p className="truncate">{user?.displayName || user?.email || "Foydalanuvchi"}</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
