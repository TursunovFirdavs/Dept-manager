import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useSuppliersStore } from "../store/dataStore";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock } from "lucide-react";
import { StatTabs } from "@/components/statistics/StatTabs";
import { StatCard } from "@/components/statistics/StatCard";
import { BreakdownChart } from "@/components/statistics/BreakdownChart";
import { useStatistics } from "@/hooks/useStatistics";
import { format } from "date-fns";

const SupplierStatistics = () => {
  const user = useAuthStore((state) => state.user);
  const { fetchSuppliers } = useSuppliersStore();

  const {
    isLoading,
    filterType,
    setFilterType,
    selectedDate,
    setSelectedDate,
    viewMonth,
    setViewMonth,
    stats,
    transactions,
  } = useStatistics("supplier");

  const today = new Date();

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

  const groupedTransactions = transactions.reduce((groups, tx) => {
    const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
    if (!date) return groups;

    const txDate = date.toDateString();
    const todayStr = today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

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

  useEffect(() => {
    if (user) {
      fetchSuppliers(user.uid);
    }
  }, [user, fetchSuppliers]);

  if (isLoading) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4 p-4 flex flex-col gap-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-22 w-full rounded-2xl" />
          <Skeleton className="h-22 w-full rounded-2xl" />
          <Skeleton className="h-22 w-full rounded-2xl" />
          <Skeleton className="h-22 w-full rounded-2xl" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white">
            Moliyaviy Analitika
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Ta'minotchilarga qilingan to'lovlar va olingan mollar hisoboti
          </p>
        </div>
        <StatTabs
          activeTab={filterType}
          onTabChange={setFilterType}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMonth={viewMonth}
          onMonthChange={setViewMonth}
        />
      </div>

      {/* Top Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <StatCard
          title="Umumiy olingan tovarlar"
          amount={stats.totalPayments}
          type="purchase"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <BreakdownChart
          title="To'lovlar kesimida (Berilgan)"
          totalAmount={stats.totalPayments}
          data={stats.paymentBreakdown}
          colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]}
        />
      </div>

      {/* Transactions List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            Tranzaksiyalar Ro'yxati
          </p>
          <p className="text-[12px] font-medium text-slate-500">
            {transactions.length} ta
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {Object.keys(groupedTransactions).length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-10 bg-white dark:bg-[#121212] rounded-[16px] border border-slate-100 dark:border-slate-800">
              Tranzaksiyalar topilmadi
            </p>
          ) : (
            Object.keys(groupedTransactions).map((groupTitle) => (
              <div key={groupTitle}>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                  {groupTitle}
                </p>
                <div className="flex flex-col gap-3">
                  {groupedTransactions[groupTitle].map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-white dark:bg-slate-800 rounded-[16px] p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[16px] text-slate-900 dark:text-white">
                            {tx.supplierName || tx.firmName || "Noma'lum"}
                          </h4>
                          <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1 mt-1">
                            <CalendarClock className="w-3.5 h-3.5" />
                            {tx.createdAt?.toDate
                              ? format(tx.createdAt.toDate(), "HH:mm")
                              : ""}
                          </span>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-[16px] ${tx.type === "payment" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}
                          >
                            {tx.type === "payment" ? "+" : "-"}
                            {tx.amount?.toLocaleString()} UZS
                          </p>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${tx.type === "payment" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                          >
                            {tx.type === "payment" ? "To'lov" : "Kirim"}
                          </span>
                        </div>
                      </div>
                      {tx.note && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg text-[13px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold mr-1">Izoh:</span>{" "}
                          {tx.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
};

export default SupplierStatistics;
