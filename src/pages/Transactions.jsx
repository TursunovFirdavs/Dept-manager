import { getAllTransactions } from "@/services/transaction.service";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Calendar as CalendarIcon,
  TrendingDown,
  TrendingUp,
  X,
  FilterX,
} from "lucide-react";

import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Calendar states
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      try {
        const data = await getAllTransactions(user.uid);
        setTransactions(data);
      } catch {
        console.error("Xatolik");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.uid]);

  const getInitials = (name) => {
    if (!name) return "";
    const w = name.trim().split(/\s+/);
    return w
      .slice(0, w.length >= 3 ? 2 : w.length)
      .map((x) => x[0].toUpperCase())
      .join("");
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  // Date format function
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return "";
    return `${dateObj.getDate()}-${monthNames[dateObj.getMonth()].slice(0, 3).toUpperCase()}, ${dateObj.getFullYear()}`;
  };

  const currentMonthName = `${monthNames[currentMonth]}, ${currentYear}`;
  const viewRangeTitle = selectedDate
    ? formatDateDisplay(selectedDate)
    : currentMonthName;

  // Filter Transactions based on selection
  // eslint-disable-next-line no-useless-assignment
  let filteredTransactions = transactions;
  if (selectedDate) {
    filteredTransactions = transactions.filter((tx) => {
      const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
      return date && date.toDateString() === selectedDate.toDateString();
    });
  } else {
    // Default: joriy oy
    filteredTransactions = transactions.filter((tx) => {
      const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
      return (
        date &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });
  }

  // Calculate Stats
  const inflow = filteredTransactions
    .filter((tx) => tx.type === "purchase")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const outflow = filteredTransactions
    .filter((tx) => tx.type === "payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalMovement = inflow - outflow;

  // Tranzaksiyalarni guruhlash (Filterlangan ro'yxat bo'yicha)
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
    if (!date) return groups;

    const txDate = date.toDateString();
    const todayStr = today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // eslint-disable-next-line no-useless-assignment
    let groupTitle = "";
    if (txDate === todayStr) {
      groupTitle = `BUGUN, ${date.getDate()}-${monthNames[date.getMonth()].slice(0, 3).toUpperCase()}`;
    } else if (txDate === yesterdayStr) {
      groupTitle = `KECHA, ${date.getDate()}-${monthNames[date.getMonth()].slice(0, 3).toUpperCase()}`;
    } else {
      groupTitle = formatDateDisplay(date);
    }

    if (!groups[groupTitle]) {
      groups[groupTitle] = [];
    }
    groups[groupTitle].push(tx);
    return groups;
  }, {});

  const formatTime = (dateObj) => {
    if (!dateObj) return "";
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMins = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${strMins} ${ampm}`;
  };

  if (isLoading) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Container>
    );
  }

  return (
    <Container className="pb-24 font-sans px-4 relative mt-6">
      {/* Viewing Range Card */}
      <Card className="bg-white dark:bg-[#121212] p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              KO'RISH DAVRI
            </p>
            <h3 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {viewRangeTitle}
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </h3>
          </div>

          {/* Shadcn UI Popover and Calendar */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${selectedDate ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-[16px] shadow-2xl border-slate-100 dark:border-slate-800"
              align="end"
            >
              <ShadcnCalendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
                className="bg-white dark:bg-[#121212] rounded-[16px]"
              />
              {selectedDate && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121212] rounded-b-[16px]">
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setIsCalendarOpen(false);
                    }}
                    className="w-full h-10 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-[14px]"
                  >
                    <FilterX className="w-4 h-4" />
                    Filtrni tozalash
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </Card>

      {/* Total Movement Card */}
      <Card className="bg-[#1a1f2c] dark:bg-[#151a25] p-5 rounded-3xl border-0 shadow-lg mb-4 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-60">
          {totalMovement >= 0 ? (
            <TrendingUp className="w-10 h-10 text-green-600" />
          ) : (
            <TrendingDown className="w-10 h-10 text-red-500" />
          )}
        </div>
        <p className="text-[11px] font-medium text-slate-400 mb-1">
          Sof aylanma {selectedDate ? "(Kunda)" : "(Oyda)"}
        </p>
        <p className="text-[32px] font-bold tracking-tight">
          {totalMovement > 0 ? "+" : ""}
          {totalMovement.toLocaleString("fr-FR")}{" "}
          <span className="text-lg font-medium text-slate-400">UZS</span>
        </p>
      </Card>

      {/* Inflow / Outflow Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card className="bg-white dark:bg-[#121212] p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            Kirim (Tovar)
          </p>
          <p className="text-[18px] font-bold text-emerald-600 dark:text-emerald-500">
            +{inflow.toLocaleString("fr-FR")}
          </p>
        </Card>
        <Card className="bg-white dark:bg-[#121212] p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            Chiqim (To'lov)
          </p>
          <p className="text-[18px] font-bold text-red-600 dark:text-red-500">
            -{outflow.toLocaleString("fr-FR")}
          </p>
        </Card>
      </div>

      {/* Movement History */}
      <div className="flex justify-between items-end mb-4 px-1">
        <h3 className="text-[17px] font-bold text-[#1a1f2c] dark:text-white">
          Amaliyotlar tarixi
        </h3>
        <p className="text-[11px] font-medium text-slate-500">
          {filteredTransactions.length} ta operatsiya
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
            <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-[15px] font-bold text-slate-500">
              Hech qanday tarix yo'q
            </p>
            {selectedDate && (
              <p className="text-[12px] mt-1 text-slate-400">
                Bu sanada operatsiya bajarilmagan
              </p>
            )}
          </div>
        ) : (
          Object.keys(groupedTransactions).map((groupTitle) => (
            <div key={groupTitle}>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                {groupTitle}
              </p>
              <div className="flex flex-col gap-3">
                {groupedTransactions[groupTitle].map((tx) => (
                  <Card
                    key={tx.id}
                    className="relative bg-white dark:bg-[#121212] p-3.5 pr-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm flex items-center overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Left Colored Border */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${tx.type === "purchase" ? "bg-emerald-500" : "bg-red-500"}`}
                    ></div>

                    <div className="flex items-center gap-3 w-full pl-2">
                      {/* Avatar */}
                      <div className="w-10.5 h-10.5 rounded-full flex items-center justify-center bg-slate-900 dark:bg-slate-800 text-white font-bold text-[15px] shadow-sm shrink-0">
                        {getInitials(tx.firmName)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 truncate">
                          {tx.firmName}
                        </p>
                        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {tx.type === "purchase"
                            ? "Tovar olindi"
                            : "To'lov qilindi"}{" "}
                          {tx.note ? `• ${tx.note}` : ""}
                        </p>
                      </div>

                      {/* Amount and Time */}
                      <div className="text-right shrink-0">
                        <p
                          className={`text-[15px] font-bold ${tx.type === "purchase" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}
                        >
                          {tx.type === "purchase" ? "+" : "-"}
                          {tx.amount?.toLocaleString("fr-FR")}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                          {tx.createdAt?.toDate
                            ? formatTime(tx.createdAt.toDate())
                            : ""}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default Transactions;
