import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({ title, amount, type = "purchase" }) => {
  const isPurchase = type === "purchase";
  
  return (
    <Card className="flex-1 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212]">
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <p className="text-[22px] md:text-[24px] font-bold text-slate-900 dark:text-white">
          {amount.toLocaleString("fr-FR")} <span className="text-[14px] text-slate-400">UZS</span>
        </p>
        
        <div className={`flex items-center gap-1 mt-1 text-[12px] font-medium ${isPurchase ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPurchase ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          <span>{isPurchase ? "Olingan mollar" : "Qilingan to'lovlar"}</span>
        </div>
      </div>
    </Card>
  );
};
