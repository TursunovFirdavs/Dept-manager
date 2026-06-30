import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSuppliersStore } from "../store/dataStore";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Loader2 } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import FirmCard from "@/components/FirmCard";
import { StatTabs } from "@/components/statistics/StatTabs";
import { StatCard } from "@/components/statistics/StatCard";
import { BreakdownChart } from "@/components/statistics/BreakdownChart";
import { useStatistics } from "@/hooks/useStatistics";

const SuppliersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { isSuppliersLoading: loading, fetchSuppliers } = useSuppliersStore();
  const {
    // isLoading: statsLoading,
    filterType,
    setFilterType,
    selectedDate,
    setSelectedDate,
    stats,
  } = useStatistics("supplier");

  const {
    filteredSuppliers,
    searchQuery,
    setSearchQuery,
    isLoading,
    isCreating,
    handleCreateSupplier,
  } = useSuppliers();

  const [newSupplierName, setNewSupplierName] = useState("");
  const purchaseColors = ["#0284c7", "#38bdf8", "#7dd3fc", "#bae6fd"]; // Blue shades

  useEffect(() => {
    if (user) {
      fetchSuppliers(user.uid);
    }
  }, [user, fetchSuppliers]);

  const onAddSupplier = async (e) => {
    e.preventDefault();
    const success = await handleCreateSupplier(newSupplierName);
    if (success) {
      setNewSupplierName("");
    }
  };

  if (loading) {
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
        {/* <StatCard
          title="Umumiy qilingan to'lovlar"
          amount={stats.totalPayments}
          type="payment"
        /> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <BreakdownChart
          title="Tovarlar kesimida (Olingan)"
          totalAmount={stats.totalPurchases}
          data={stats.purchaseBreakdown}
          colors={purchaseColors}
        />
        {/* <BreakdownChart
          title="To'lovlar kesimida (Berilgan)"
          totalAmount={stats.totalPayments}
          data={stats.paymentBreakdown}
          colors={paymentColors}
        /> */}
      </div>

      {/* Add Firm Section */}
      <div className="my-6">
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
          Yangi Firma Qo'shish
        </p>
        <form onSubmit={onAddSupplier} className="flex gap-2">
          <Input
            type="text"
            placeholder="Firma nomi..."
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
            className="h-12 rounded-[14px] bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 text-[15px]"
            disabled={isCreating}
          />
          <Button
            type="submit"
            disabled={!newSupplierName.trim() || isCreating}
            className="h-12 w-12 rounded-[14px] shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
      {/* Search Section */}
      <div className="relative flex items-center gap-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-[14px] mb-6 shadow-sm">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Firmalarni qidirish..."
          className="bg-transparent border-none outline-none w-full text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Firms List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            Ro'yxat
          </p>
          <p className="text-[12px] font-medium text-slate-500">
            {filteredSuppliers.length} ta firma
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredSuppliers.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-10 bg-white dark:bg-[#121212] rounded-[16px] border border-slate-100 dark:border-slate-800">
                Firmalar topilmadi
              </p>
            ) : (
              filteredSuppliers.map((firm) => (
                <FirmCard
                  key={firm.id}
                  firm={firm}
                  onClick={(id) => navigate(`/firms/${id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default SuppliersPage;
