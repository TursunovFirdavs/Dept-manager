import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getFirms } from "../services/firm.service";

import { Card, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/services/auth.service";
import { Bell, Search, LogOut } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Link } from "react-router-dom";
import { formatDateUz } from "@/lib/utils";

const DashboardPage = () => {
  const [firms, setFirms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.uid) return;

    const loadDashboard = async () => {
      const firmsData = await getFirms(user.uid);
      setFirms(firmsData);
    };

    loadDashboard();
  }, [user?.uid]);

  const totalDebt = firms.reduce((sum, firm) => sum + (firm.balance || 0), 0);
  const totalPayment = firms.reduce(
    (sum, firm) => sum + (firm.totalPayment || 0),
    0,
  );
  
  // NaN xatosini oldini olish
  const totalPaymentPercent = totalDebt > 0 ? (totalPayment / totalDebt) * 100 : 0;

  const filteredFirms = firms.filter((firm) => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "";
    const w = name.trim().split(/\s+/);
    return w
      .slice(0, w.length >= 3 ? 2 : w.length)
      .map((x) => x[0].toUpperCase())
      .join("");
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen">
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MOLIYAVIY HISOB</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Savdo daftar</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-[18px] text-slate-600 dark:text-slate-300" />
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            title="Tizimdan chiqish"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <Card className="px-5 py-5 bg-blue-600 dark:bg-blue-700 text-white border-0 shadow-md">
        <p className="text-[11px] font-medium text-blue-100 uppercase tracking-wide mb-1">UMUMIY QARZ</p>
        <p className="text-[32px] font-bold pb-4">
          {totalDebt.toLocaleString("fr-FR")} <span className="text-xl font-medium text-blue-200">UZS</span>
        </p>
        <div className="flex justify-between items-center bg-blue-700/50 dark:bg-blue-800/50 p-3 rounded-xl border border-blue-500/30">
          <div>
            <p className="text-[11px] text-blue-200">Firmalar soni</p>
            <p className="text-[14px] font-bold">{firms.length} ta</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[11px] text-blue-200">To'langan foiz</p>
            <p className="text-[14px] font-bold">
              {Math.floor(totalPaymentPercent).toLocaleString("fr-FR")} %
            </p>
          </div>
        </div>
      </Card>

      <div className="relative flex items-center gap-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-[14px] mt-8 mb-6 shadow-sm">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Firmalarni qidirish..." 
          className="bg-transparent border-none outline-none w-full text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mb-4 font-semibold px-1">
        <p className="text-slate-800 dark:text-slate-200">Firmalar ro'yxati</p>
        <Link to="/firms" className="text-blue-600 dark:text-blue-400 text-[13px] hover:underline">
          Barchasini ko'rish
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {filteredFirms.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-10">Firmalar topilmadi</p>
        ) : (
          filteredFirms.map((item) => {
            const firmPercent = item.totalPurchase > 0 
              ? Math.floor((item.balance / item.totalPurchase) * 100) 
              : 0;
            
            return (
              <Card
                key={item.id}
                className="flex justify-between items-center gap-4 w-full px-4 py-4 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-[#121212]"
              >
                <div className="w-[46px] h-[46px] rounded-[14px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300">
                  {getInitials(item.name)}
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <div>
                    <CardTitle className="font-bold text-[16px] text-slate-900 dark:text-slate-100 mb-0.5">
                      {capitalize(item.name)}
                    </CardTitle>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.updatedAt?.toDate ? formatDateUz(item.updatedAt.toDate()) : "Sana yo'q"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                      {item.balance.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                      {firmPercent}%
                    </p>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
      
      <div className="h-20"></div>
    </Container>
  );
};

export default DashboardPage;
