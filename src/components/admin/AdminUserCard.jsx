import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Calendar as CalendarIcon,
  CheckCircle,
  Store,
  Settings,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AdminUserCard = ({ user, currentUser, handleStatusChange, handleSubscriptionDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Local loading states
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isAddMonthLoading, setIsAddMonthLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const isBlocked = user.status === "blocked";
  const subActive = user.subscription?.status === "active";
  const subEndDate = user.subscription?.endDate?.toDate();
  const isExpired = subEndDate ? new Date() > subEndDate : false;
  const actualSubStatus = !isExpired && subActive ? "Faol" : "Tugagan";

  const onStatusClick = async () => {
    setIsStatusLoading(true);
    await handleStatusChange(user.id, isBlocked ? "active" : "blocked");
    setIsStatusLoading(false);
  };

  const onAddMonthClick = async () => {
    setIsAddMonthLoading(true);
    const baseDate = subEndDate && subEndDate > new Date() ? subEndDate : new Date();
    const nextMonth = new Date(baseDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await handleSubscriptionDateChange(user.id, nextMonth);
    setIsAddMonthLoading(false);
  };

  const onUpdateDateClick = async () => {
    if (!selectedDate) return;
    setIsUpdateLoading(true);
    await handleSubscriptionDateChange(user.id, selectedDate);
    setSelectedDate(null);
    setIsUpdateLoading(false);
  };

  return (
    <Card className="p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              user.role === "admin"
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            }`}
          >
            {user.role === "admin" ? <Shield className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
              {user.shopName || "Ismsiz Do'kon"}
            </h3>
            <p className="text-xs text-slate-500 font-mono" title={user.uid}>
              {user.uid.slice(0, 10)}...
            </p>
          </div>
        </div>

        <div
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            !isBlocked
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {!isBlocked ? "Active" : "Blocked"}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 mb-6 flex-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Rol
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
            {user.role || "user"}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> Obuna Turi
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
            {user.subscription?.plan || "Yo'q"}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Obuna Holati
          </span>
          <span
            className={`font-semibold ${
              actualSubStatus === "Faol" ? "text-green-600" : "text-red-600"
            }`}
          >
            {actualSubStatus}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4" /> Muddat
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {subEndDate ? subEndDate.toLocaleDateString() : "Biriktirilmagan"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex gap-2">
          {user.uid !== currentUser?.uid && (
            <Button
              variant="outline"
              disabled={isStatusLoading}
              onClick={onStatusClick}
              className={`flex-1 h-9 text-xs font-semibold ${
                isBlocked
                  ? "hover:bg-green-50 hover:text-green-600"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {isStatusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isBlocked ? "Blokdan Yechish" : "Bloklash")}
            </Button>
          )}
          <Button
            variant="outline"
            disabled={isAddMonthLoading}
            onClick={onAddMonthClick}
            className="flex-1 h-9 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 text-blue-600 dark:text-blue-400"
          >
            {isAddMonthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "+1 Oy Qo'shish"}
          </Button>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-9 flex-1 text-xs justify-start text-left font-normal ${
                  !selectedDate && "text-slate-500"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(new Date(selectedDate), "PP", { locale: uz })
                  : "Sana tanlang"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ShadcnCalendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            disabled={isUpdateLoading || !selectedDate}
            onClick={onUpdateDateClick}
            className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUpdateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yangilash"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminUserCard;
