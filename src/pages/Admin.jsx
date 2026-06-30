import { useEffect, useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  WalletCards,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import AdminUserCard from "@/components/admin/AdminUserCard";
import PaymentSettingsModal from "@/components/admin/PaymentSettingsModal";
import { differenceInDays } from "date-fns";

import {
  getUsers,
  updateSubscriptionDate,
  updateUserStatus,
} from "../services/user.service";

const Admin = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'active', 'expired'
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        toast.error("Foydalanuvchilarni yuklashda xatolik");
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleStatusChange = async (uid, status) => {
    try {
      await updateUserStatus(uid, status);
      toast.success(
        `Foydalanuvchi ${status === "active" ? "faollashtirildi" : "bloklandi"}`,
      );
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
      console.log(error);
    }
  };

  const handleSubscriptionDateChange = async (uid, date) => {
    if (!date) {
      toast.error("Sanani tanlang");
      return;
    }
    try {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      await updateSubscriptionDate(uid, newDate);
      toast.success("Muddat yangilandi");
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
      console.log(error);
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const today = new Date();
    let active = 0;
    let expiringSoon = 0;

    users.forEach((user) => {
      const isBlocked = user.status === "blocked";
      const endDate = user.subscription?.endDate?.toDate();
      const daysLeft = endDate ? differenceInDays(endDate, today) : -1;

      if (!isBlocked && daysLeft > 0) active++;
      if (!isBlocked && daysLeft > 0 && daysLeft <= 10) expiringSoon++;
    });

    return { active, total: users.length, expiringSoon };
  }, [users]);

  // Filtering
  const filteredUsers = users.filter((user) => {
    // Search
    const matchesSearch =
      user.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter Chips
    const isBlocked = user.status === "blocked";
    const endDate = user.subscription?.endDate?.toDate();
    const daysLeft = endDate ? differenceInDays(endDate, new Date()) : -1;

    if (filterType === "active") return !isBlocked && daysLeft > 0;
    if (filterType === "expired") return isBlocked || daysLeft <= 0;

    return true;
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-dvh flex flex-col font-sans pb-24">
      <Container className="px-4 pt-6">
        {/* Search & Filters */}

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="sm:col-span-2 bg-[#1a1f2c] dark:bg-[#151a25] rounded-[20px] p-5 relative overflow-hidden shadow-md">
            <div className="absolute -right-5 -bottom-5 opacity-10 pointer-events-none">
              <Activity className="w-40 h-40 text-white" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">
              Umumiy Faol Do'konlar
            </p>
            <div className="flex items-end gap-3 relative z-10">
              <h2 className="text-[40px] font-extrabold text-white leading-none">
                {metrics.active}
              </h2>
              <p className="text-[13px] text-emerald-400 font-medium mb-1.5">
                ta tasdiqlangan
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[16px] p-4 border border-blue-100/50 dark:border-blue-800/30">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Jami do'konlar
            </p>
            <h3 className="text-[22px] font-extrabold text-slate-900 dark:text-white">
              {metrics.total}
            </h3>
          </div>

          <div className="bg-slate-100 dark:bg-[#121212] rounded-[16px] p-4 border border-slate-200/50 dark:border-slate-800/50">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Yaqinda tugaydi
            </p>
            <h3 className="text-[22px] font-extrabold text-red-600 dark:text-red-500">
              {metrics.expiringSoon}
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-full mb-3 shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Do'kon nomi yoki foydalanuvchini izlang..."
              className="pl-12 h-12 rounded-2xl bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 text-[15px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["all", "active", "expired"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === type
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {type === "all"
                  ? "Barchasi"
                  : type === "active"
                    ? "Faol"
                    : "Tugagan"}
              </button>
            ))}
          </div>
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
            Do'konlarni Boshqarish
          </h2>
          <Button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 h-9 px-4 text-[12px] font-bold cursor-pointer"
          >
            <WalletCards className="w-4 h-4" /> Karta sozlamalari
          </Button>
        </div>

        {/* Merchants List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-[#121212] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
                Sorovga mos natija topilmadi.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <AdminUserCard
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  handleStatusChange={handleStatusChange}
                  handleSubscriptionDateChange={handleSubscriptionDateChange}
                />
              ))
            )}
          </div>
        )}
      </Container>

      <PaymentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Admin;
