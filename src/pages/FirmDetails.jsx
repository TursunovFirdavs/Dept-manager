import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import toast from "react-hot-toast";

const FirmDetails = () => {
  const { firmId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [firm, setFirm] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handlePurchase = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Summani to'g'ri kiriting");
      return;
    }
    setIsLoading(true);
    try {
      await addPurchase(user.uid, firmId, firm.name, Number(amount), "");
      await loadData();
      setAmount("");
      toast.success("Tovar qo'shildi (Yangi qarz)");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Summani to'g'ri kiriting");
      return;
    }
    setIsLoading(true);
    try {
      await addPayment(user.uid, firmId, firm.name, Number(amount), "");
      await loadData();
      setAmount("");
      toast.success("To'lov qilindi");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
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

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const monthNames = [
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Iyul",
      "Avg",
      "Sen",
      "Okt",
      "Noy",
      "Dek",
    ];
    return `${dateObj.getDate()}-${monthNames[dateObj.getMonth()]}, ${dateObj.getFullYear()}`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true;
    return tx.type === filterType;
  });

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
            className="rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-[19px] font-bold text-slate-900 dark:text-white truncate max-w-50">
            {firm.name}
          </h2>
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
          <div className="mb-4">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Summani kiriting
            </Label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">
                UZS
              </span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-4 pr-14 h-12 rounded-[14px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-[16px] font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              disabled={isLoading}
              onClick={handlePurchase}
              className="bg-black hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-200 text-white rounded-full h-12 flex items-center justify-center gap-2 font-bold text-[13px] shadow-md transition-transform active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4.5 h-4.5" />
              )}
              TOVAR QO'SHISH
            </Button>

            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={handlePayment}
              className="bg-blue-100/60 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full h-12 flex items-center justify-center gap-2 font-bold text-[13px] transition-transform active:scale-95"
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
        </Card>
      </div>

      {/* Transaction Ledger Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[16px] font-bold text-[#1a1f2c] dark:text-white">
            Arxiv
          </h3>
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

        <div className="flex flex-col gap-3">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-8">
              Hali hech qanday amaliyot yo'q
            </p>
          ) : (
            filteredTransactions.map((tx) => (
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
                      ? `${formatDate(tx.createdAt.toDate())} - ${formatTime(tx.createdAt.toDate())}`
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
            ))
          )}
        </div>

        {transactions.length > 0 && (
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
