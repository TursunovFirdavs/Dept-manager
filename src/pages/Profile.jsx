import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../services/auth.service";
import { Pencil, Moon, Headphones, LogOut, Bell, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { ProfileMenuItem } from "@/components/profile/ProfileMenuItem";

const ProfilePage = () => {
  const { userData } = useAuthStore();

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Tizimdan chiqildi");
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const ownerName = userData?.ownerName || "Foydalanuvchi";
  const initials = ownerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const phone = userData?.phone || "+998 -- --- -- --";
  const firmCount = userData?.firmCount || 0;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-start">
        <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white leading-snug">
          Subscription<br />Manager
        </h1>
        <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400">
          <button aria-label="Notifications" className="transition-opacity hover:opacity-70 cursor-pointer">
            <Bell size={20} strokeWidth={2.5} />
          </button>
          <button aria-label="Help" className="transition-opacity hover:opacity-70 cursor-pointer">
            <HelpCircle size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-100 flex flex-col items-center">
          
          {/* Avatar and Info */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-20 h-20 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-3xl font-medium mb-3">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">{ownerName}</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-tight">{phone}</p>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-tight">{firmCount}</p>
          </div>

          {/* Subscription Card */}
          <SubscriptionCard subscription={userData?.subscription} />

          {/* Settings Menu Card */}
          <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card mb-5 overflow-hidden">
            <div className="flex flex-col">
              
              <ProfileMenuItem 
                icon={Pencil} 
                text="Profilni tahrirlash" 
                onClick={() => {}} 
                hasBorder={true} 
              />
              
              <ProfileMenuItem 
                icon={Moon} 
                text="Dark mode" 
                hasBorder={true}
                rightElement={
                  <button 
                    onClick={toggleDarkMode}
                    aria-label="Toggle Dark Mode"
                    className={`cursor-pointer relative inline-flex h-6.5 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isDark ? 'bg-[#1d4ed8]' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <span 
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.75'}`}
                    />
                  </button>
                }
              />
              
              <a 
                href="https://t.me/FRDV001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block"
              >
                <ProfileMenuItem 
                  icon={Headphones} 
                  text="Admin bilan bog'lanish" 
                />
              </a>
              
            </div>
          </Card>

          {/* Chiqish tugmasi */}
          <button 
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-card border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-500 rounded-xl transition-colors font-semibold text-[14px] shadow-sm"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Chiqish</span>
          </button>
          
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
