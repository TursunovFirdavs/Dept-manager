import { useState } from 'react';
import { ListFilter, Building2, Calendar, Plus, CalendarCheck, BarChart2, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useAuthStore } from "@/store/authStore";
import { addSupplierPayment } from "@/services/transaction.service";
import toast from "react-hot-toast";

const daysList = [
  { day: 'MON', label: 'Dushanba' },
  { day: 'TUE', label: 'Seshanba' },
  { day: 'WED', label: 'Chorshanba' },
  { day: 'THU', label: 'Payshanba' },
  { day: 'FRI', label: 'Juma' },
  { day: 'SAT', label: 'Shanba' },
  { day: 'SUN', label: 'Yakshanba' },
];

const SuppliersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const {
    filteredSuppliers,
    searchQuery,
    setSearchQuery,
    selectedDay,
    setSelectedDay,
    isLoading,
    refreshSuppliers
  } = useSuppliers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (firm) => {
    setSelectedFirm(firm);
    setAmount("");
    setNote("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFirm(null);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      toast.error("Iltimos to'g'ri summa kiriting");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addSupplierPayment(user.uid, selectedFirm.id, selectedFirm.name, Number(amount), note);
      toast.success("To'lov muvaffaqiyatli saqlandi");
      closeModal();
      refreshSuppliers();
    } catch (error) {
      console.error(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen pb-24 font-sans px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700">
             <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <h2 className="text-[19px] font-bold text-slate-900 dark:text-white">
            Visit Schedule
          </h2>
        </div>
        <button 
          onClick={() => navigate("/supplier-statistics")}
          className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[14px] bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full"
        >
          <BarChart2 className="w-4 h-4" />
          Statistika
        </button>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3.5 rounded-[14px] mb-8 shadow-sm">
        <ListFilter className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Firmalarni qidirish..."
          className="bg-transparent border-none outline-none w-full text-[14px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Weekly Overview */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">Haftalik Reja</h3>
      </div>

      {/* Dates Row */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-8 -mx-4 px-4">
        {daysList.map((item, index) => {
          const isSelected = selectedDay === item.day;
          return (
            <div 
              key={index} 
              onClick={() => setSelectedDay(item.day)}
              className={`flex-shrink-0 w-[4.5rem] h-[5.5rem] ${isSelected ? 'bg-[#161c2d] dark:bg-slate-800 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm'} rounded-[18px] flex flex-col items-center justify-center cursor-pointer transition-all`}
            >
              <span className={`text-[11px] font-bold ${isSelected ? 'text-slate-300' : 'text-slate-400'} mb-0.5 tracking-wide`}>{item.day}</span>
              <span className="text-[20px] font-bold leading-none mt-1">{item.label.slice(0, 3)}</span>
              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mt-2"></div>}
            </div>
          );
        })}
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-1.5 h-5 bg-[#161c2d] dark:bg-slate-400 rounded-full"></div>
        <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">{daysList.find(d => d.day === selectedDay)?.label} firmalari</h3>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 mb-10">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 opacity-60">
            <div className="w-12 h-12 border-2 border-slate-400 rounded-[14px] flex items-center justify-center mb-4">
              <CalendarCheck className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[14px] font-medium text-slate-500">Bu kunga firmalar yo'q</p>
          </div>
        ) : (
          filteredSuppliers.map((firm, index) => (
            <div key={firm.id} className="bg-white dark:bg-slate-800 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[20px] ${index % 2 === 0 ? 'bg-[#161c2d] dark:bg-slate-500' : 'bg-[#0284c7]'}`}></div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2">{firm.name}</h4>
                  <span className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full ${index % 2 === 0 ? 'bg-[#e0e7ff] dark:bg-blue-900/30 text-[#4f46e5] dark:text-blue-400' : 'bg-[#e0f2fe] dark:bg-blue-900/30 text-[#0284c7] dark:text-blue-400'}`}>
                    Balans: {firm.balance?.toLocaleString()} UZS
                  </span>
                </div>
                <div className="text-right">
                  <button 
                    onClick={() => openModal(firm)}
                    className="w-10 h-10 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-6 text-[12px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {firm.phone || "Telefon kiritilmagan"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => navigate("/suppliers/add")}
        className="fixed bottom-20 right-6 w-[3.5rem] h-[3.5rem] bg-[#161c2d] dark:bg-white text-white dark:text-black rounded-[18px] shadow-lg flex items-center justify-center hover:bg-black/90 transition-all z-50"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[24px] p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full bg-slate-50 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">To'lov qo'shish</h3>
            <p className="text-sm text-slate-500 mb-6">{selectedFirm?.name} uchun</p>

            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Summa (UZS)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-[52px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[14px] px-4 text-[16px] font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Izoh (ixtiyoriy)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nima uchun to'lov?"
                  className="w-full h-[52px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[14px] px-4 text-[15px] font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[52px] mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[14px] font-semibold text-[16px] shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Saqlash"}
              </button>
            </form>
          </div>
        </div>
      )}

    </Container>
  );
};

export default SuppliersPage;
