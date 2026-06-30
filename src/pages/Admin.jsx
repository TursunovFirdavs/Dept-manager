import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import AdminUserCard from "@/components/admin/AdminUserCard";
import PaymentSettingsModal from "@/components/admin/PaymentSettingsModal";

import {
  getUsers,
  updateSubscriptionDate,
  updateUserStatus,
} from "../services/user.service";

const Admin = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      // Input date string is YYYY-MM-DD
      const newDate = new Date(date);
      // Ensure the time covers the whole day
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

  const filteredUsers = users.filter(
    (user) =>
      user.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen pb-24 font-sans px-4 md:px-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Admin Panel
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Foydalanuvchilar va obunalarni boshqarish markazi
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Do'kon nomi yoki UID orqali qidirish..."
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2"
          >
            <CreditCard className="w-4 h-4" /> To'lov Sozlamalari
          </Button>
        </div>
      </div>

      <PaymentSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <AdminUserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              handleStatusChange={handleStatusChange}
              handleSubscriptionDateChange={handleSubscriptionDateChange}
            />
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Hech qanday foydalanuvchi topilmadi
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default Admin;
