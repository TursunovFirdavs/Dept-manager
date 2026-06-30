import { useState, useEffect, useMemo } from "react";
import { getTransactionsByDateRange } from "@/services/transaction.service";
import { useAuthStore } from "@/store/authStore";
import { getSupplierTransactionsByDate } from "@/services/supplier.service";

export const useStatistics = (type) => {
  const user = useAuthStore((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("daily"); // 'daily', 'monthly', 'yearly', 'custom'
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        let start = new Date();
        let end = new Date();

        if (filterType === "custom" && selectedDate) {
          start = new Date(selectedDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(selectedDate);
          end.setHours(23, 59, 59, 999);
        } else if (filterType === "daily") {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        } else if (filterType === "monthly") {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
        } else if (filterType === "yearly") {
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        }

        const allTransactionsData = await getTransactionsByDateRange(
          user.uid,
          start,
          end,
        );
        const supplierTransactionsData = await getSupplierTransactionsByDate(
          user.uid,
          start,
          end,
        );

        if (type === "supplier") {
          setTransactions(supplierTransactionsData);
        } else {
          setTransactions(allTransactionsData);
        }
      } catch (error) {
        console.error("Tranzaksiyalarni yuklashda xatolik:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, filterType, selectedDate]);

  // Biz backenddan allaqachon filtrlangan ma'lumotni oldik, shuning uchun filteredData shunchaki transactions ning o'zi
  const filteredData = transactions;

  // Aggregate stats
  const stats = useMemo(() => {
    let totalPurchases = 0; // Tovar olingan
    let totalPayments = 0; // Pul berilgan
    const purchaseByFirm = {};
    const paymentByFirm = {};

    filteredData.forEach((tx) => {
      const amount = tx.amount || 0;
      const firmName = tx.firmName || "Noma'lum";

      if (tx.type === "purchase") {
        totalPurchases += amount;
        purchaseByFirm[firmName] = (purchaseByFirm[firmName] || 0) + amount;
      } else if (tx.type === "payment") {
        totalPayments += amount;
        paymentByFirm[firmName] = (paymentByFirm[firmName] || 0) + amount;
      }
    });

    const formatBreakdown = (obj) => {
      const total = Object.values(obj).reduce((sum, val) => sum + val, 0);
      return Object.keys(obj)
        .map((name) => ({
          name,
          value: obj[name],
          percent: total > 0 ? Math.round((obj[name] / total) * 100) : 0,
        }))
        .sort((a, b) => b.value - a.value);
    };

    return {
      totalPurchases,
      totalPayments,
      purchaseBreakdown: formatBreakdown(purchaseByFirm),
      paymentBreakdown: formatBreakdown(paymentByFirm),
    };
  }, [filteredData]);

  return {
    isLoading,
    filterType,
    setFilterType,
    selectedDate,
    setSelectedDate,
    stats,
  };
};
