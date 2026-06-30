import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { differenceInDays } from "date-fns";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AdminUserCard = ({ user, currentUser, handleStatusChange, handleSubscriptionDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isAddMonthLoading, setIsAddMonthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isBlocked = user.status === "blocked";
  const subEndDate = user.subscription?.endDate?.toDate();
  
  // Calculate remaining days
  const today = new Date();
  const daysLeft = subEndDate ? differenceInDays(subEndDate, today) : -1;
  
  let statusBadge = { label: "Tugagan", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  let progressColor = "bg-red-600";
  let progressValue = 100;
  
  if (isBlocked) {
    statusBadge = { label: "Bloklangan", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" };
    progressColor = "bg-slate-400";
    progressValue = 0;
  } else if (daysLeft > 10) {
    statusBadge = { label: "Faol", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    progressColor = "bg-black dark:bg-white"; 
    progressValue = Math.min(100, Math.max(0, (daysLeft / 365) * 100)); // Scaled randomly based on 1 year max
  } else if (daysLeft > 0 && daysLeft <= 10) {
    statusBadge = { label: `${daysLeft} Kun qoldi`, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" };
    progressColor = "bg-yellow-400";
    progressValue = Math.max(5, (daysLeft / 30) * 100);
  } else if (daysLeft <= 0) {
    statusBadge = { label: "Tugagan", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    progressColor = "bg-red-600";
    progressValue = 100;
  }

  const handleToggleAccess = async () => {
    await handleStatusChange(user.id, isBlocked ? "active" : "blocked");
  };

  const onUpdateDateClick = async () => {
    if (!selectedDate) return;
    setIsUpdateLoading(true);
    await handleSubscriptionDateChange(user.id, selectedDate);
    setSelectedDate(null);
    setIsUpdateLoading(false);
    setIsPopoverOpen(false);
  };

  const onAddMonthClick = async () => {
    setIsAddMonthLoading(true);
    const baseDate = subEndDate && subEndDate > new Date() ? subEndDate : new Date();
    const nextMonth = new Date(baseDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await handleSubscriptionDateChange(user.id, nextMonth);
    setIsAddMonthLoading(false);
  };

  return (
    <Card className="rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] overflow-hidden flex flex-col relative">
      {/* Decorative left border for warning states like in the image */}
      {daysLeft > 0 && daysLeft <= 10 && !isBlocked && (
         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400" />
      )}
      
      <div className="p-5 flex-1 md:pl-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-[17px] text-slate-900 dark:text-white line-clamp-1 pr-2">
            {user.shopName || "Ismsiz Do'kon"}
          </h3>
          <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${statusBadge.color}`}>
            {statusBadge.label}
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-[13px] text-slate-500 mb-5">
          {user.role === 'admin' ? "Admin" : "Chakana savdo"} • @{user.uid.slice(0, 10).toLowerCase()}
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 mb-5" />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Parol
            </p>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-medium text-[14px]">
              {showPassword ? (user.password || "Kiritilmagan") : "••••••••"}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Telefon
            </p>
            <p className="text-slate-900 dark:text-slate-100 font-medium text-[14px]">
              {user.phone || "Kiritilmagan"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Qolgan Vaqt
            </p>
            <p className={`text-[12px] font-bold ${daysLeft <= 0 ? 'text-red-600' : (daysLeft <= 10 ? 'text-yellow-600 dark:text-yellow-500' : 'text-slate-700 dark:text-slate-300')}`}>
              {daysLeft > 0 ? `${daysLeft} Kun` : `O'tgan ${Math.abs(daysLeft)} Kun`}
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 mb-5" />

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button
               type="button"
               disabled={user.uid === currentUser?.uid}
               onClick={handleToggleAccess}
               className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${!isBlocked ? 'bg-black dark:bg-white' : 'bg-slate-300 dark:bg-slate-700'}`}
             >
                <div className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${!isBlocked ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
             <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">Ruxsat</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={isAddMonthLoading}
              onClick={onAddMonthClick}
              className="h-9 px-3 rounded-xl text-[13px] font-bold cursor-pointer hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isAddMonthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "+1 Oy"}
            </Button>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={daysLeft <= 0 ? "default" : "secondary"}
                  className={`h-9 px-4 rounded-xl text-[13px] font-bold cursor-pointer gap-2 ${
                    daysLeft <= 0 
                      ? 'bg-black hover:bg-slate-900 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200' 
                      : 'bg-blue-100/60 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {daysLeft <= 0 ? "Uzatish" : "Yangilash"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 rounded-2xl shadow-xl border-slate-100 dark:border-slate-800" align="end">
                <ShadcnCalendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="mb-3"
                />
                <Button
                  disabled={isUpdateLoading || !selectedDate}
                  onClick={onUpdateDateClick}
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  {isUpdateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Saqlash"}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default AdminUserCard;
