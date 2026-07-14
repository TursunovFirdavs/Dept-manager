import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Building2, Phone, Coins, Loader2, Store, CalendarDays } from "lucide-react";

import { useSuppliers } from "@/hooks/useSuppliers";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";

const addSupplierSchema = z.object({
  name: z.string().min(2, "Firma nomi kamida 2 ta belgi bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqamini kiritish majburiy"),
  balance: z.string().optional(),
  visitDay: z.string().min(1, "Hafta kunini tanlang"),
});

const AddSupplier = () => {
  const navigate = useNavigate();
  const { handleCreateSupplier, isCreating } = useSuppliers();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSupplierSchema),
    defaultValues: {
      visitDay: "MON",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const success = await handleCreateSupplier({
        name: data.name,
        phone: data.phone,
        balance: data.balance ? Number(data.balance) : 0,
        visitDay: data.visitDay,
      });

      if (success) {
        navigate("/suppliers");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    { value: "MON", label: "Dushanba" },
    { value: "TUE", label: "Seshanba" },
    { value: "WED", label: "Chorshanba" },
    { value: "THU", label: "Payshanba" },
    { value: "FRI", label: "Juma" },
    { value: "SAT", label: "Shanba" },
    { value: "SUN", label: "Yakshanba" },
  ];

  return (
    <div className="min-h-dvh w-full bg-[#f8fafc] dark:bg-[#0c0a18] flex flex-col font-sans relative">
      {/* Top Header */}
      <div className="flex items-center justify-center p-4 relative border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121212] sticky top-0 z-20">
        <button
          onClick={() => navigate("/suppliers")}
          className="absolute left-4 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 dark:text-white">
          Yangi Firma Qo'shish
        </h1>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pb-24">
        {/* Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[16px] p-5 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[16px] font-bold text-blue-900 dark:text-blue-100 mb-2">
              Hamkor Tafsilotlari
            </h2>
            <p className="text-[13px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              Yangi hamkor bilan moliya va tovar aylanmasini boshlash uchun 
              kerakli asosiy ma'lumotlarni kiriting.
            </p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-100/50 dark:bg-blue-800/30 rounded-full blur-2xl" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Firma Nomi"
            icon={Building2}
            iconPosition="left"
            id="name"
            type="text"
            placeholder="Yuridik firma yoki do'kon nomi"
            error={errors.name}
            {...register("name")}
          />

          <FormField
            label="Telefon Raqami"
            icon={Phone}
            iconPosition="left"
            id="phone"
            type="tel"
            placeholder="+998 (90) 000-00-00"
            error={errors.phone}
            {...register("phone")}
          />

          <FormField
            label="Balans"
            icon={Coins}
            iconPosition="left"
            id="balance"
            type="number"
            placeholder="0.00 UZS"
            error={errors.balance}
            className="text-lg font-mono font-bold"
            {...register("balance")}
          />

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Hafta kuni
            </label>
            <div className="relative">
              <select
                {...register("visitDay")}
                className="w-full h-[52px] bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 rounded-[14px] px-4 text-[15px] font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors appearance-none"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.visitDay && (
              <span className="text-red-500 text-sm mt-1">{errors.visitDay.message}</span>
            )}
          </div>

          {/* Bottom Fixed Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <div className="w-full">
              <Button
                type="submit"
                disabled={isLoading || isCreating}
                className="w-full h-14 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-[16px] font-semibold text-[16px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading || isCreating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Store className="w-5 h-5" /> Firma Yaratish
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
