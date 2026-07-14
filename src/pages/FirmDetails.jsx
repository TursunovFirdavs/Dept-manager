import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../store/authStore";
import { getFirmById } from "../services/firm.service";
import {
  addPurchase,
  addPayment,
  getTransactions,
} from "../services/transaction.service";

import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  MoreVertical,
  PlusCircle,
  MinusCircle,
  ListFilter,
  TrendingUp,
  Loader2,
  Calendar as CalendarIcon,
  FilterX,
} from "lucide-react";
import toast from "react-hot-toast";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";

const transactionSchema = z.object({
  amount: z.preprocess(
    (val) => Number(String(val).replace(/\D/g, "")),
    z.number().min(1, "Summani to'g'ri kiriting"),
  ),
  note: z.string().optional(),
});

const FirmDetails = () => {
  const { firmId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [firm, setFirm] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      note: "",
    },
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calendar states
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(new Date());

  const handleSelectFilter = (type) => {
    setFilterType(type);
    setIsFilterOpen(false);
  };

  const loadData = async () => {
    try {
      const [firmData, txData] = await Promise.all([
        getFirmById(user.uid, firmId),
        getTransactions(user.uid, firmId),
      ]);
      setFirm(firmData);
      setTransactions(txData);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.uid) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, firmId]);

  const handlePurchase = async (data) => {
    setIsLoading(true);
    try {
      await addPurchase(
        user.uid,
        firmId,
        firm.name,
        data.amount,
        data.note || "",
      );
      await loadData();
      reset();
      toast.success("Tovar qo'shildi (Yangi qarz)");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (data) => {
    setIsLoading(true);
    if (data.amount <= firm.balance) {
      try {
        await addPayment(
          user.uid,
          firmId,
          firm.name,
          data.amount,
          data.note || "",
        );
        await loadData();
        reset();
        toast.success("To'lov qilindi");
      } catch {
        toast.error("Xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Noto'ri mablag' kirityabsiz");
      setIsLoading(false);
    }
  };

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

  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return "";
    return `${dateObj.getDate()}-${monthNames[dateObj.getMonth()].slice(0, 3).toUpperCase()}, ${dateObj.getFullYear()}`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    let matchesType = true;
    if (filterType !== "all") {
      matchesType = tx.type === filterType;
    }

    let matchesDate = false;
    const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
    if (date) {
      if (selectedDate) {
        matchesDate = date.toDateString() === selectedDate.toDateString();
      } else {
        matchesDate =
          date.getMonth() === viewMonth.getMonth() &&
          date.getFullYear() === viewMonth.getFullYear();
      }
    }

    return matchesType && matchesDate;
  });

  const today = new Date();
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

  if (!firm) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800 dark:text-white" />
      </Container>
    );
  }

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-[19px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {firm.name}
            </h2>
            {firm.phone && (
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                {firm.phone}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card className="bg-white dark:bg-[#121212] p-4 rounded-[18px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Umumiy Summa
          </p>
          <p className="text-[18px] font-extrabold text-slate-900 dark:text-white truncate">
            {firm.totalPurchase?.toLocaleString("fr-FR")}
          </p>
        </Card>

        <Card className="bg-white dark:bg-[#121212] p-4 rounded-[18px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Qilingan To'lov
          </p>
          <p className="text-[18px] font-extrabold text-emerald-600 dark:text-emerald-500 truncate">
            {firm.totalPayment?.toLocaleString("fr-FR")}
          </p>
        </Card>

        <Card className="col-span-2 bg-[#1a1f2c] dark:bg-[#151a25] p-5 rounded-[18px] border-0 shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-50 pointer-events-none">
            <TrendingUp className="w-24 h-24 mr-1 -mt-2 text-green-600" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Qoldiq Qarz
          </p>
          <p className="text-[28px] font-extrabold text-white truncate relative z-10">
            {firm.balance?.toLocaleString("fr-FR")}{" "}
            <span className="text-[14px] text-slate-500 font-medium">UZS</span>
          </p>
        </Card>
      </div>

      {/* Manage Ledger Section */}
      <div className="mb-8">
        <h3 className="text-[16px] font-bold text-[#1a1f2c] dark:text-white mb-3">
          Amaliyot Bajarish
        </h3>
        <Card className="bg-white dark:bg-[#121212] p-5 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <form>
            <div className="mb-3">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Summani kiriting
              </Label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">
                  UZS
                </span>
                <Input
                  type="text"
                  placeholder="0"
                  className={`pl-4 pr-14 h-12 rounded-[14px] bg-slate-50 dark:bg-slate-900/50 text-[16px] font-bold placeholder:text-slate-300 ${errors.amount ? "border-red-500" : "border-slate-200 dark:border-slate-800"}`}
                  {...register("amount", {
                    onChange: (e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      e.target.value = rawValue.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ".",
                      );
                    },
                  })}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-[11px] mt-1 font-medium">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Izoh (Ixtiyoriy)
              </Label>
              <Input
                type="text"
                placeholder="Nima uchun?"
                className="h-12 rounded-[14px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-[14px] font-medium placeholder:text-slate-400"
                {...register("note")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit(handlePurchase)}
                className="bg-black hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white rounded-full h-12 flex items-center justify-center gap-2 font-bold text-[13px] shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4.5 h-4.5" />
                )}
                TOVAR QO'SHISH
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={handleSubmit(handlePayment)}
                className="bg-blue-100/60 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full h-12 flex items-center justify-center gap-2 font-bold text-[13px] transition-transform active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MinusCircle className="w-4.5 h-4.5" />
                )}
                TO'LOV QILISH
              </Button>
            </div>
            <p className="text-center text-[11px] font-medium text-slate-500 italic px-2">
              "To'lov qilganda qarzdan ayriladi; yangi tovar kelganda qarzga
              qo'shiladi."
            </p>
          </form>
        </Card>
      </div>

      {/* Transaction Ledger Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[16px] font-bold text-[#1a1f2c] dark:text-white">
            Transactions
          </h3>
          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 gap-1.5 text-[12px] font-medium px-2 cursor-pointer ${
                    selectedDate ||
                    viewMonth.getMonth() !== new Date().getMonth() ||
                    viewMonth.getFullYear() !== new Date().getFullYear()
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Sana {selectedDate && "•"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-auto p-0 rounded-[16px] shadow-2xl border-slate-100 dark:border-slate-800"
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
                  month={viewMonth}
                  onMonthChange={(newMonth) => {
                    setViewMonth(newMonth);
                    setSelectedDate(null);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                  className="bg-white dark:bg-[#121212] rounded-[16px]"
                />
                {(selectedDate ||
                  viewMonth.getMonth() !== new Date().getMonth() ||
                  viewMonth.getFullYear() !== new Date().getFullYear()) && (
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121212] rounded-b-[16px]">
                    <button
                      onClick={() => {
                        setSelectedDate(null);
                        setViewMonth(new Date());
                        setIsCalendarOpen(false);
                      }}
                      className="w-full h-10 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-[14px] cursor-pointer"
                    >
                      <FilterX className="w-4 h-4" />
                      Filtrni tozalash
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 gap-1.5 text-[12px] font-medium ${
                    filterType !== "all"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  Filtr {filterType !== "all" && "•"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-44 p-1.5 rounded-[14px] shadow-lg border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121212]"
              >
                <button
                  onClick={() => handleSelectFilter("all")}
                  className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    filterType === "all"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  Barchasi
                </button>
                <button
                  onClick={() => handleSelectFilter("purchase")}
                  className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    filterType === "purchase"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  Yangi Tovar - Qarz
                </button>
                <button
                  onClick={() => handleSelectFilter("payment")}
                  className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    filterType === "payment"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  To'lov - Naqd
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-8">
              Hali hech qanday amaliyot yo'q
            </p>
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
                      className="bg-white dark:bg-[#121212] p-4 rounded-[16px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                          {tx.type === "purchase"
                            ? "Yangi Tovar - Qarz"
                            : "Qisman to'lov - Naqd"}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {tx.createdAt?.toDate
                            ? formatTime(tx.createdAt.toDate())
                            : "Sana yo'q"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[15px] font-bold ${tx.type === "purchase" ? "text-red-600 dark:text-red-500" : "text-blue-600 dark:text-teal-500"}`}
                        >
                          {tx.type === "purchase" ? "+" : "-"}
                          {tx.amount?.toLocaleString("fr-FR")}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {tx.type === "purchase"
                            ? "Qarz ko'paydi"
                            : "To'lov qabul qilindi"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {Object.keys(groupedTransactions).length > 0 && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider h-12 rounded-[14px]"
          >
            Eskiroq tarixni yuklash
          </Button>
        )}
      </div>
    </Container>
  );
};

export default FirmDetails;
