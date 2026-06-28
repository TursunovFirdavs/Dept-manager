import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatistics } from "@/hooks/useStatistics";
import { StatTabs } from "@/components/statistics/StatTabs";
import { StatCard } from "@/components/statistics/StatCard";
import { BreakdownChart } from "@/components/statistics/BreakdownChart";

const StatisticsPage = () => {
  const { 
    isLoading, 
    filterType, 
    setFilterType, 
    selectedDate, 
    setSelectedDate, 
    stats 
  } = useStatistics();

  if (isLoading) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4 md:px-8 p-4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 py-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-full md:w-[350px] rounded-xl" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="flex-1 h-[120px] rounded-2xl" />
          <Skeleton className="flex-1 h-[120px] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      </Container>
    );
  }

  // Diagramma ranglari
  const purchaseColors = ["#0284c7", "#38bdf8", "#7dd3fc", "#bae6fd"]; // Blue shades
  const paymentColors = ["#dc2626", "#ef4444", "#f87171", "#fca5a5"]; // Red shades

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4 md:px-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white">
            Moliyaviy Analitika
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Moliya va qarzlar holati bo'yicha hisobot
          </p>
        </div>
        <StatTabs 
          activeTab={filterType} 
          onTabChange={setFilterType} 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* Top Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <StatCard 
          title="Umumiy olingan tovarlar" 
          amount={stats.totalPurchases} 
          type="purchase" 
        />
        <StatCard 
          title="Umumiy qilingan to'lovlar" 
          amount={stats.totalPayments} 
          type="payment" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <BreakdownChart 
          title="Tovarlar kesimida (Olingan)" 
          totalAmount={stats.totalPurchases}
          data={stats.purchaseBreakdown}
          colors={purchaseColors}
        />
        <BreakdownChart 
          title="To'lovlar kesimida (Berilgan)" 
          totalAmount={stats.totalPayments}
          data={stats.paymentBreakdown}
          colors={paymentColors}
        />
      </div>
    </Container>
  );
};

export default StatisticsPage;
