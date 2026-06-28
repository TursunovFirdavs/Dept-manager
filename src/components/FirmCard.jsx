import { Card, CardTitle } from "@/components/ui/card";
import { formatDateUz } from "@/lib/utils";

const FirmCard = ({ firm, onClick }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const w = name.trim().split(/\s+/);
    return w
      .slice(0, w.length >= 3 ? 2 : w.length)
      .map((x) => x[0].toUpperCase())
      .join("");
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const firmPercent = firm.totalPurchase > 0 
    ? Math.floor((firm.balance / firm.totalPurchase) * 100) 
    : 0;

  return (
    <Card
      onClick={() => onClick && onClick(firm.id)}
      className="flex justify-between items-center gap-4 w-full px-4 py-4 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-[#121212]"
    >
      <div className="w-[46px] h-[46px] rounded-[14px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
        {getInitials(firm.name)}
      </div>
      <div className="flex flex-1 justify-between items-center min-w-0">
        <div className="truncate mr-3">
          <CardTitle className="font-bold text-[16px] text-slate-900 dark:text-slate-100 mb-0.5 truncate">
            {capitalize(firm.name)}
          </CardTitle>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium truncate">
            {firm.updatedAt?.toDate ? formatDateUz(firm.updatedAt.toDate()) : "Sana yo'q"}
          </p>
        </div>
        <div className="flex flex-col items-end flex-shrink-0">
          <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">
            {firm.balance?.toLocaleString("fr-FR") || 0}
          </p>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
            {firmPercent}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FirmCard;
