import { useCurrentPage } from "@/hooks/useCurrentPage";
import { Bell, LogOut, Headphones, Wallet } from "lucide-react";
import { logoutUser } from "@/services/auth.service";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const { title } = useCurrentPage();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        {/* Faqat mobilda chiqadigan logo */}
        <a href="/dashboard" className="md:hidden bg-blue-600 text-white p-1 rounded-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <Wallet size={16} />
        </a>
        <h2 className="text-[17px] md:text-[18px] font-bold text-slate-900 dark:text-white">
          {/* Mobilda "Asosiy" o'rniga "Savdo daftar" chiqadi */}
          {title === "Asosiy" ? (
            <a href="/dashboard" className="md:hidden cursor-pointer hover:opacity-80 transition-opacity">
              Savdo daftar
            </a>
          ) : (
            <span className="md:hidden">{title}</span>
          )}
          <span className="hidden md:inline">{title}</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://t.me/FRDV001"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3 md:px-4 h-9 md:h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-[13px] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors mr-0 md:mr-2"
          title="Admin bilan bog'lanish"
        >
          <Headphones className="w-4 h-4" />
          <span className="hidden lg:inline">Admin bilan bog'lanish</span>
        </a>

        <ThemeToggle />

        <button className="cursor-pointer w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#121212] shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <Bell className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </button>

        <button
          onClick={handleLogout}
          className="hidden sm:flex cursor-pointer w-9 h-9 md:w-10 md:h-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          title="Tizimdan chiqish"
        >
          <LogOut
            className="w-4 h-4 md:w-4.5 md:h-4.5 ml-0.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
