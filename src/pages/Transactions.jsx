/* eslint-disable react-hooks/static-components */
import { getAllTransactions } from "@/services/transaction.service";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { PackagePlus, Banknote, CalendarDays, Loader2 } from "lucide-react";
import { formatDateUz } from "@/lib/utils";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

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

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Helper function to safely process dates
  const isToday = (date) =>
    date && date.toDateString() === today.toDateString();
  const isThisMonth = (date) =>
    date &&
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear;
  const isThisYear = (date) => date && date.getFullYear() === currentYear;

  const calculateStats = (filterFn) => {
    return transactions.reduce(
      (acc, tx) => {
        const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
        if (!filterFn(date)) return acc;

        if (tx.type === "purchase") acc.purchase += tx.amount;
        if (tx.type === "payment") acc.payment += tx.amount;
        return acc;
      },
      { purchase: 0, payment: 0 },
    );
  };

  const todayStats = calculateStats(isToday);
  const monthStats = calculateStats(isThisMonth);
  const yearStats = calculateStats(isThisYear);

  if (isLoading) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Container>
    );
  }

  const StatBlock = ({ title, purchase, payment }) => (
    <Card className="p-4 bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-slate-500" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[14px]">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
            Olingan tovar
          </p>
          <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
            {purchase.toLocaleString("fr-FR")}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-medium mb-1">
            Qilingan to'lov
          </p>
          <p className="text-[14px] font-bold text-blue-600 dark:text-blue-400">
            {payment.toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen pb-20 pt-6">
      <div className="mb-6 px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tranzaksiyalar
        </h1>
        <p className="text-slate-500 text-[13px] mt-1">
          Barcha kirim va chiqimlar tarixi
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <StatBlock
          title="Bugungi statistika"
          purchase={todayStats.purchase}
          payment={todayStats.payment}
        />
        <StatBlock
          title="Joriy oydagi statistika"
          purchase={monthStats.purchase}
          payment={monthStats.payment}
        />
        <StatBlock
          title="Joriy yildagi statistika"
          purchase={yearStats.purchase}
          payment={yearStats.payment}
        />
      </div>

      <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-3 px-1">
        Barcha amaliyotlar
      </h2>

      <div className="flex flex-col gap-3">
        {transactions.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-10">
            Tarix topilmadi
          </p>
        ) : (
          transactions.map((tx) => (
            <Card
              key={tx.id}
              className="p-4 bg-white dark:bg-[#121212] border-slate-100 dark:border-slate-800/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
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
                    {tx.firmName}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {tx.type === "purchase" ? "Tovar olindi" : "To'lov qilindi"}{" "}
                    •{" "}
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

export default Transactions;
