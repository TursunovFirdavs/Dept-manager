import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../services/auth.service";
import { Pencil, Moon, Headphones, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { ProfileMenuItem } from "@/components/profile/ProfileMenuItem";
import ThemeToggle from "@/components/ThemeToggle";

const ProfilePage = () => {
  const { userData } = useAuthStore();
  const navigate = useNavigate();

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
    <div className="flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center px-4 pb-6">
        <div className="w-full max-w-100 flex flex-col items-center">
          {/* Avatar and Info */}
          <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
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
          <SubscriptionCard subscription={userData?.subscription} />

          {/* Settings Menu Card */}
          <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card mb-5 overflow-hidden shrink-0">
            <div className="flex flex-col">
              <ProfileMenuItem
                icon={Pencil}
                text="Profilni tahrirlash"
                onClick={() => navigate("/profile/edit")}
                hasBorder={true}
              />

              <div className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Moon className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  <span className="font-semibold text-[14px] text-slate-900 dark:text-slate-100">
                    Dark mode
                  </span>
                </div>

                <ThemeToggle />
              </div>

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
            className="cursor-pointer w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-card border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-500 rounded-xl transition-colors font-semibold text-[14px] shadow-sm shrink-0"
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
