import { Wallet } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-dvh w-full bg-[#f8fafc] dark:bg-[#0c0a18] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="w-full max-w-[400px] flex flex-col items-center z-10">
        {/* Logo and Headings */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link
            to="/"
            className="w-13 h-13 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-blue-200 dark:border-blue-800"
          >
            <Wallet
              className="w-6 h-6 text-blue-900 dark:text-blue-400"
              strokeWidth={2.5}
            />
          </Link>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2">
            Savdo daftar
          </h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 px-4 leading-relaxed max-w-[280px]">
            Moliyaviy jarayonlaringizni tizimli va xotirjam boshqaring.
          </p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
