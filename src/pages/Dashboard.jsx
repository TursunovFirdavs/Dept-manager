import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Link, useNavigate } from "react-router-dom";
import { useFirms } from "@/hooks/useFirms";
import FirmCard from "@/components/FirmCard";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { firms, filteredFirms, searchQuery, setSearchQuery } = useFirms();

  const totalDebt = firms.reduce((sum, firm) => sum + (firm.balance || 0), 0);
  const totalPayment = firms.reduce(
    (sum, firm) => sum + (firm.totalPayment || 0),
    0,
  );
  
  const totalPaymentPercent = totalDebt > 0 ? (totalPayment / totalDebt) * 100 : 0;


  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18]">
      <div className="flex items-center justify-between py-5 px-1">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MOLIYAVIY HISOB</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Savdo daftar</h2>
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
          <p className="text-center text-slate-500 text-sm py-10 bg-white dark:bg-[#121212] rounded-[16px] border border-slate-100 dark:border-slate-800">Firmalar topilmadi</p>
        ) : (
          filteredFirms.map((firm) => (
            <FirmCard 
              key={firm.id} 
              firm={firm} 
              onClick={(id) => navigate(`/firms/${id}`)}
            />
          ))
        )}
      </div>
      
      <div className="h-20"></div>
    </Container>
  );
};

export default DashboardPage;
