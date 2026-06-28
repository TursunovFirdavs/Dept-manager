import { Outlet } from "react-router-dom";
import AppNavigation from "./AppNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0c0a18] text-slate-900 dark:text-slate-100">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative w-full overflow-y-auto">
        {/* Header - Desktop Only */}
        <Header />

        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden md:max-w-none">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <AppNavigation />
    </div>
  );
};

export default DashboardLayout;
