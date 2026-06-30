import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Lock, Headphones, RefreshCcw, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDateUz } from "@/lib/utils";
import { getPaymentSettings } from "../services/settings.service";

const SubscriptionExpired = () => {
  const { userData } = useAuthStore();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getPaymentSettings();
      setPaymentInfo(data);
    };
    fetchSettings();
  }, []);

  const handleCopy = () => {
    if (paymentInfo?.cardNumber) {
      navigator.clipboard.writeText(paymentInfo.cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const subscription = userData?.subscription;
  const isPremium = subscription?.plan === "premium";
  const planName = isPremium
    ? "Premium - Yillik"
    : subscription?.plan === "trial"
      ? "Sinov muddati"
      : "Asosiy reja";

  const endDate = subscription?.endDate?.toDate() || new Date();
  const formattedEndDate = formatDateUz(endDate);

  return (
    <div className="min-h-screen bg-[#f9f8f6] dark:bg-[#0c0a18] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-95 flex flex-col items-center">
        {/* Ikonka (Qulf) */}
        <div className="w-17 h-17 rounded-full bg-[#fef2f2] dark:bg-red-950/30 flex items-center justify-center mb-5">
          <Lock
            className="w-7 h-7 text-[#7f1d1d] dark:text-red-400"
            strokeWidth={2}
          />
        </div>

        {/* Sarlavha va matn */}
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2.5 text-center leading-tight">
          Obuna muddati tugadi
        </h1>
        <p className="text-[14px] text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-7 px-2">
          Tizimdan foydalanishni davom ettirish uchun administrator bilan
          bog'laning.
        </p>

        {/* Ma'lumotlar kartasi */}
        <Card className="w-full rounded-[14px] shadow-sm border-[#e5e5e5] dark:border-slate-800 bg-white dark:bg-card mb-5">
          <CardContent className="p-4 flex flex-col gap-3.5">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400">Reja</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {planName}
              </span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500 dark:text-slate-400">
                Tugagan sana
              </span>
              <span className="font-semibold text-[#7f1d1d] dark:text-red-400">
                {formattedEndDate}
              </span>
            </div>

            {/* To'lov ma'lumotlari qismi */}
            {paymentInfo && (
              <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">To'lov uchun karta:</span>
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tracking-[0.1em] text-[15px]">
                      {paymentInfo.cardNumber}
                    </span>
                    <button 
                      onClick={handleCopy}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                      title="Nusxa olish"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-slate-500 dark:text-slate-400">Karta egasi</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {paymentInfo.ownerName}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tugmalar */}
        <Link
          to={"https://t.me/FRDV001"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" size="lg" className={"w-full py-5"}>
            <Headphones className="w-4.5 h-4.5" strokeWidth={2.5} />
            <span>Admin bilan bog'lanish</span>
          </Button>
        </Link>

        <Link reloadDocument className="w-full mt-3">
          <Button variant="default" size="lg" className={"w-full py-5"}>
            <RefreshCcw className="w-4.5 h-4.5" strokeWidth={2.5} />
            <span>Qayta yuklash</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionExpired;
