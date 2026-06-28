import {
  ChartNoAxesCombined,
  History,
  House,
  NotebookTabs,
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AppNavigation = () => {
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 w-full bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] md:hidden z-50 pb-safe"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <nav className="flex justify-around items-center pb-2 pt-3 px-1">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                location.pathname === "/dashboard" ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <House className="w-6 h-6" />
              Asosiy
            </Link>
            <Link
              to="/firms"
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                location.pathname.startsWith("/firms") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <NotebookTabs className="w-6 h-6" />
              Firmalar
            </Link>
            <Link
              to="/transactions"
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                location.pathname === "/transactions" ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <History className="w-6 h-6" />
              Arxiv
            </Link>
            <Link
              to="/calendar"
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                location.pathname === "/calendar" ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <ChartNoAxesCombined className="w-6 h-6" />
              Statistika
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                location.pathname === "/profile" ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <User className="w-6 h-6" />
              Profil
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;
