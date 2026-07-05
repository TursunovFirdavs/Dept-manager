import { Calendar as CalendarIcon, X, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const StatTabs = ({ activeTab, onTabChange, selectedDate, onDateChange, viewMonth, onMonthChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const tabs = [
    { id: "daily", label: "Kunlik" },
    { id: "monthly", label: "Oylik" },
    { id: "yearly", label: "Yillik" },
  ];

  const handleDateSelect = (date) => {
    onDateChange(date);
    if (date) {
      onTabChange("custom");
      setIsCalendarOpen(false);
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

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
              <span className="text-[13px] font-medium capitalize">
                {activeTab === "custom" && selectedDate 
                  ? format(selectedDate, "dd MMM yyyy", { locale: uz }) 
                  : activeTab === "daily" 
                    ? format(new Date(), "dd MMM yyyy", { locale: uz })
                    : activeTab === "monthly"
                      ? format(viewMonth, "MMMM yyyy", { locale: uz })
                      : activeTab === "yearly"
                        ? format(viewMonth, "yyyy", { locale: uz })
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
        <PopoverContent className="w-70 p-0 rounded-[16px] shadow-2xl border-slate-100 dark:border-slate-800" align="end">
          {activeTab === "daily" || activeTab === "custom" ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={viewMonth}
              onMonthChange={(newMonth) => {
                onMonthChange(newMonth);
              }}
              disabled={(date) => date > new Date()}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={new Date().getFullYear()}
              className="bg-white dark:bg-[#121212] rounded-[16px] p-3"
            />
          ) : activeTab === "monthly" ? (
            <div className="p-4 bg-white dark:bg-[#121212] rounded-[16px]">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => onMonthChange(new Date(viewMonth.getFullYear() - 1, viewMonth.getMonth(), 1))} 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="font-medium text-sm flex items-center">
                  {viewMonth.getFullYear()}
                </div>
                <button 
                  onClick={() => onMonthChange(new Date(viewMonth.getFullYear() + 1, viewMonth.getMonth(), 1))} 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={viewMonth.getFullYear() >= new Date().getFullYear()}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"].map((m, i) => {
                  const isCurrent = viewMonth.getMonth() === i;
                  const isDisabled = viewMonth.getFullYear() === new Date().getFullYear() && i > new Date().getMonth();
                  return (
                    <button 
                      key={m}
                      onClick={() => {
                        onMonthChange(new Date(viewMonth.getFullYear(), i, 1));
                        setIsCalendarOpen(false);
                      }}
                      disabled={isDisabled}
                      className={`h-9 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
                        isCurrent 
                          ? 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 shadow' 
                          : isDisabled 
                            ? 'text-slate-400 opacity-50 cursor-not-allowed' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white dark:bg-[#121212] rounded-[16px]">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => onMonthChange(new Date(viewMonth.getFullYear() - 12, viewMonth.getMonth(), 1))} 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="font-medium text-sm flex items-center">
                  Yillar
                </div>
                <button 
                  onClick={() => onMonthChange(new Date(viewMonth.getFullYear() + 12, viewMonth.getMonth(), 1))} 
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  disabled={viewMonth.getFullYear() + 12 > new Date().getFullYear()}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({length: 12}, (_, i) => Math.floor(viewMonth.getFullYear() / 12) * 12 + i).map(y => {
                  const isCurrent = viewMonth.getFullYear() === y;
                  const isDisabled = y > new Date().getFullYear();
                  return (
                    <button 
                      key={y}
                      onClick={() => {
                        onMonthChange(new Date(y, viewMonth.getMonth(), 1));
                        setIsCalendarOpen(false);
                      }}
                      disabled={isDisabled}
                      className={`h-9 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
                        isCurrent 
                          ? 'bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 shadow' 
                          : isDisabled 
                            ? 'text-slate-400 opacity-50 cursor-not-allowed' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {(selectedDate || viewMonth?.getMonth() !== new Date().getMonth() || viewMonth?.getFullYear() !== new Date().getFullYear()) && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121212] rounded-b-[16px]">
              <button
                onClick={() => {
                  onDateChange(null);
                  onMonthChange(new Date());
                  onTabChange("daily");
                  setIsCalendarOpen(false);
                }}
                className="w-full h-10 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-[13px] cursor-pointer"
              >
                <FilterX className="w-4 h-4" />
                Filtrni tozalash
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
