import { useState, useEffect, useMemo } from 'react';
import { getAllTransactions } from '@/services/transaction.service';
import { useAuthStore } from '@/store/authStore';

export const useStatistics = () => {
  const user = useAuthStore((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('daily'); // 'daily', 'monthly', 'yearly', 'custom'
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTransactions(user.uid);
        setTransactions(data);
      } catch (error) {
        console.error("Tranzaksiyalarni yuklashda xatolik:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const filteredData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter((tx) => {
      // Handle Firebase Timestamp or standard Date string
      const date = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
      if (!date || isNaN(date.getTime())) return false;

      // Agar aynan bitta sana tanlangan bo'lsa (custom)
      if (filterType === 'custom' && selectedDate) {
        return date.getDate() === selectedDate.getDate() && 
               date.getMonth() === selectedDate.getMonth() && 
               date.getFullYear() === selectedDate.getFullYear();
      }

      if (filterType === 'daily') {
        return date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }
      if (filterType === 'monthly') {
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }
      if (filterType === 'yearly') {
        return date.getFullYear() === currentYear;
      }
      return true;
    });
  }, [transactions, filterType, selectedDate]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalPurchases = 0; // Tovar olingan
    let totalPayments = 0; // Pul berilgan
    const purchaseByFirm = {};
    const paymentByFirm = {};

    filteredData.forEach((tx) => {
      const amount = tx.amount || 0;
      const firmName = tx.firmName || "Noma'lum";

      if (tx.type === 'purchase') {
        totalPurchases += amount;
        purchaseByFirm[firmName] = (purchaseByFirm[firmName] || 0) + amount;
      } else if (tx.type === 'payment') {
        totalPayments += amount;
        paymentByFirm[firmName] = (paymentByFirm[firmName] || 0) + amount;
      }
    });

    const formatBreakdown = (obj) => {
      const total = Object.values(obj).reduce((sum, val) => sum + val, 0);
      return Object.keys(obj)
        .map(name => ({ 
          name, 
          value: obj[name],
          percent: total > 0 ? Math.round((obj[name] / total) * 100) : 0
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
    stats
  };
};
