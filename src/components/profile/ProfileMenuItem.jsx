import { ChevronRight } from "lucide-react";

export const ProfileMenuItem = ({ icon: Icon, text, onClick, rightElement, hasBorder = false }) => {
  const Component = onClick ? "button" : "div";
  
  return (
    <Component 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left group ${hasBorder ? 'border-b border-slate-100 dark:border-slate-800/60' : ''} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3.5">
        {Icon && <Icon className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />}
        <span className="font-semibold text-[14px] text-slate-900 dark:text-slate-100">{text}</span>
      </div>
      {rightElement ? rightElement : <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />}
    </Component>
  );
};
