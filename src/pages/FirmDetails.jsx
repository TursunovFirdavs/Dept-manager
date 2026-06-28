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
import { Card, CardTitle } from "@/components/ui/card";
import FormField from "@/components/FormField";
import { ArrowLeft, PackagePlus, Banknote, Loader2 } from "lucide-react";
import { formatDateUz } from "@/lib/utils";
import toast from "react-hot-toast";

const FirmDetails = () => {
  const { firmId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [firm, setFirm] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      await addPurchase(user.uid, firmId, firm.name, Number(amount), note);
      await loadData();
      setAmount("");
      setNote("");
      toast.success("Tovar qo'shildi");
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
      await addPayment(user.uid, firmId, firm.name, Number(amount), note);
      await loadData();
      setAmount("");
      setNote("");
      toast.success("To'lov qilindi");
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  if (!firm) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Container>
    );
  }

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            {firm.name}
          </h2>
          <p className="text-[12px] text-slate-500 font-medium">
            Firma tafsilotlari
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="px-4 py-4 bg-blue-600 dark:bg-blue-700 text-white border-0 col-span-2 shadow-md">
          <p className="text-[11px] font-medium text-blue-100 uppercase tracking-wide mb-1">
            QOLDIQ QARZ
          </p>
          <p className="text-[28px] font-bold">
            {firm.balance?.toLocaleString("fr-FR")}{" "}
            <span className="text-base font-medium text-blue-200">UZS</span>
          </p>
        </Card>

        <Card className="px-4 py-3 bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
            Jami tovar
          </p>
          <p className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
            {firm.totalPurchase?.toLocaleString("fr-FR")}
          </p>
        </Card>

        <Card className="px-4 py-3 bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
            Jami to'lov
          </p>
          <p className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
            {firm.totalPayment?.toLocaleString("fr-FR")}
          </p>
        </Card>
      </div>

      {/* Action Form */}
      <Card className="p-4 bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <CardTitle className="text-[15px] font-bold mb-4 text-slate-800 dark:text-slate-200">
          Amaliyot bajarish
        </CardTitle>
        <div className="flex flex-col gap-3">
          <FormField
            type="number"
            placeholder="Summani kiriting..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <FormField
            type="text"
            placeholder="Izoh (ixtiyoriy)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white h-11 rounded-[10px] font-medium text-[14px] transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PackagePlus className="w-4 h-4" />
              )}
              Tovar olish
            </button>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white h-11 rounded-[10px] font-medium text-[14px] transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Banknote className="w-4 h-4" />
              )}
              To'lov qilish
            </button>
          </div>
        </div>
      </Card>

      {/* History */}
      <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-3 px-1">
        Tranzaksiyalar tarixi
      </h3>

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-5">
            Hali tarix yo'q
          </p>
        ) : (
          transactions.map((tx) => (
            <Card
              key={tx.id}
              className="p-4 bg-white dark:bg-[#121212] border-slate-100 dark:border-slate-800/60 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "purchase" ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                >
                  {tx.type === "purchase" ? (
                    <PackagePlus className="w-5 h-5" />
                  ) : (
                    <Banknote className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
                    {tx.type === "purchase" ? "Tovar olindi" : "To'lov qilindi"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {tx.createdAt?.toDate
                      ? formatDateUz(tx.createdAt.toDate())
                      : "Sana yo'q"}
                  </p>
                  {tx.note && (
                    <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1">
                      {tx.note}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-[15px] font-bold ${tx.type === "purchase" ? "text-slate-900 dark:text-white" : "text-blue-600 dark:text-blue-400"}`}
                >
                  {tx.type === "purchase" ? "+" : "-"}
                  {tx.amount?.toLocaleString("fr-FR")}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};

export default FirmDetails;
