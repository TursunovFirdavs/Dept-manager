import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../services/auth.service";
import {
  Award,
  Pencil,
  Moon,
  Headphones,
  LogOut,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const { userData } = useAuthStore();

  // ESLint: react-hooks/set-state-in-effect xatosi oldini olish uchun dangasa initsializatsiya
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

  const subscription = userData?.subscription;
  const isPremium = subscription?.plan === "premium";
  const planName = isPremium
    ? "Premium - Yillik"
    : subscription?.plan === "trial"
      ? "Sinov muddati"
      : "Asosiy reja";

  const startDate = subscription?.startDate?.toDate() || new Date();
  const endDate =
    subscription?.endDate?.toDate() ||
    new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  let progressPercent = 0;
  if (totalDuration > 0) {
    progressPercent = Math.min(
      100,
      Math.max(0, (elapsed / totalDuration) * 100),
    );
  }

  const formattedEndDate = endDate.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center px-4 pb-12 mt-2 md:mt-4 lg:mt-10">
        <div className="w-full max-w-100 flex flex-col items-center">
          {/* Avatar and Info */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-20 h-20 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-3xl font-medium mb-3">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">
              {ownerName}
            </h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-tight">
              {phone}
            </p>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-tight">
              {firmCount}
            </p>
          </div>

          {/* Subscription Card */}
          <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card mb-4 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <Award
                    size={18}
                    className="text-orange-400"
                    strokeWidth={2.5}
                  />
                  <span className="font-bold text-[15px] text-slate-900 dark:text-slate-100">
                    {planName}
                  </span>
                </div>
                <div
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${subscription?.status === "active" ? "bg-[#e6f4ea] text-[#137333] dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}
                >
                  {subscription?.status === "active" ? "Faol" : "Nofaol"}
                </div>
              </div>

              <div className="mb-2 text-[13px] text-slate-600 dark:text-slate-400">
                Tugashiga {daysLeft} kun qoldi
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-[#10b981] rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="text-[12px] text-slate-500 dark:text-slate-400">
                {formattedEndDate} gacha amal qiladi
              </div>
            </CardContent>
          </Card>

          {/* Settings Menu Card */}
          <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card mb-5 overflow-hidden">
            <div className="flex flex-col">
              {/* Profilni tahrirlash */}
              <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <Pencil className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-[14px] text-slate-900 dark:text-slate-100">
                    Profilni tahrirlash
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dark mode */}
              <div className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Moon className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-[14px] text-slate-900 dark:text-slate-100">
                    Dark mode
                  </span>
                </div>

                {/* Custom Toggle Switch (Tailwind xatoliklari to'g'irlangan) */}
                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle Dark Mode"
                  className={`relative inline-flex h-6.5 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isDark ? "bg-[#1d4ed8]" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isDark ? "translate-x-5" : "translate-x-0.75"}`}
                  />
                </button>
              </div>

              {/* Admin bilan bog'lanish */}
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <Headphones className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-[14px] text-slate-900 dark:text-slate-100">
                    Admin bilan bog'lanish
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>

          {/* Chiqish tugmasi */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-card border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-500 rounded-xl transition-colors font-semibold text-[14px] shadow-sm"
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
