import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const StatTabs = ({ activeTab, onTabChange, selectedDate, onDateChange }) => {
  const tabs = [
    { id: "daily", label: "Kunlik" },
    { id: "monthly", label: "Oylik" },
    { id: "yearly", label: "Yillik" },
  ];

  const handleDateSelect = (date) => {
    onDateChange(date);
    if (date) {
      onTabChange("custom");
    } else {
      onTabChange("daily"); // reset if cleared
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-full sm:w-auto md:w-75">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-1.5 px-3 text-[13px] font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="relative inline-flex items-center w-full sm:w-auto">
            <button 
              className={`h-9 px-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap w-full sm:w-auto ${
                activeTab === "custom" 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800" 
                  : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              } ${selectedDate ? "pr-8" : ""}`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-[13px] font-medium">
                {activeTab === "custom" && selectedDate 
                  ? format(selectedDate, "dd MMM yyyy", { locale: uz }) 
                  : "Sana"}
              </span>
            </button>
            {selectedDate && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDateChange(null);
                  onTabChange("daily");
                }}
                className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Sanani tozalash"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
