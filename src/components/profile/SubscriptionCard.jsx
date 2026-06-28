import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateUz } from "@/lib/utils";

export const SubscriptionCard = ({ subscription }) => {
  const isPremium = subscription?.plan === "premium"; 
  const planName = isPremium ? "Premium - Yillik" : (subscription?.plan === "trial" ? "Sinov muddati" : "Asosiy reja");
  
  const startDate = subscription?.startDate?.toDate() || new Date();
  const endDate = subscription?.endDate?.toDate() || new Date(new Date().setFullYear(new Date().getFullYear() + 1)); 
  
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  let progressPercent = 0;
  if (totalDuration > 0) {
    progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }
  
  const formattedEndDate = formatDateUz(endDate);

  return (
    <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-orange-400" strokeWidth={2.5} />
            <span className="font-bold text-[15px] text-slate-900 dark:text-slate-100">{planName}</span>
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${subscription?.status === 'active' ? 'bg-[#e6f4ea] text-[#137333] dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
            {subscription?.status === 'active' ? 'Faol' : 'Nofaol'}
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
  );
};
