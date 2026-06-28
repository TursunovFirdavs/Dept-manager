import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, User, Phone, Save, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";

import FormField from "@/components/FormField";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";

// Validatsiya sxemasi
const profileSchema = z.object({
  ownerName: z.string().min(3, "Ism kamida 3 ta harfdan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri kiritildi"),
  email: z.string().email("Noto'g'ri email formati").optional().or(z.literal('')),
});

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { userData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form hook'ini initsializatsiya qilish
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ownerName: userData?.ownerName || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
    },
  });

  // Saqlash funksiyasi
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Bu yerda API ga yuborish mantiqi bo'ladi
      // masalan: await updateDoc(doc(db, "users", userData.uid), data);
      
      // Simulyatsiya (1.5 soniya)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Saqlangan ma'lumotlar:", data);
      toast.success("Ma'lumotlar muvaffaqiyatli saqlandi");
      navigate("/profile");
    } catch {
      toast.error("Ma'lumotlarni saqlashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full px-4 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate("/profile")}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white">
            Profilni tahrirlash
          </h1>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 w-full flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-[400px]">
          
          <Card className="w-full rounded-xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-card overflow-hidden">
            <CardContent className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                
                <FormField
                  label="Ism va familiya"
                  icon={User}
                  id="ownerName"
                  placeholder="Ismingizni kiriting"
                  error={errors.ownerName}
                  {...register("ownerName")}
                />

                <FormField
                  label="Telefon raqam"
                  icon={Phone}
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  error={errors.phone}
                  {...register("phone")}
                />

                <FormField
                  label="Email (Ixtiyoriy)"
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="misol@gmail.com"
                  error={errors.email}
                  {...register("email")}
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className={`cursor-pointer w-full flex items-center justify-center gap-2 p-3.5 rounded-xl transition-colors font-semibold text-[15px] shadow-sm
                      ${isLoading || !isDirty 
                        ? 'bg-blue-100 text-blue-400 dark:bg-blue-900/20 dark:text-blue-700 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500'
                      }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{isLoading ? "Saqlanmoqda..." : "Saqlash"}</span>
                  </button>
                </div>
                
              </form>
            </CardContent>
          </Card>
          
        </div>
      </main>
    </div>
  );
};

export default ProfileEdit;
