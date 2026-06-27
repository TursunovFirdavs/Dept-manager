import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AtSign, ArrowRight, Loader2, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import FormField from "@/components/FormField";
import { loginUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Yaroqsiz email manzili"),
  password: z.string().min(6, "Parol kamida 6ta belgi bo'lishi kerak"),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await loginUser(data.email, data.password);
      toast.success("Muvaffaqiyatli kirdingiz!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#f8fafc] dark:bg-[#0c0a18] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="w-full max-w-100 flex flex-col items-center z-10">
        {/* Logo and Headings */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link
            reloadDocument
            className="w-13 h-13 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-blue-200 dark:border-blue-800"
          >
            <Wallet
              className="w-6 h-6 text-blue-900 dark:text-blue-400"
              strokeWidth={2.5}
            />
          </Link>
          <h1 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2">
            Savdo daftar
          </h1>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 px-4 leading-relaxed max-w-70">
            Moliyaviy jarayonlaringizni tizimli va xotirjam boshqaring.
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white dark:bg-[#121212] rounded-[20px] p-7 shadow-sm border border-slate-200/60 dark:border-slate-800/60 mb-6">
          <h2 className="text-[20px] font-bold text-[#0f172a] dark:text-white mb-6">
            Welcome Back
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              label="Email address"
              icon={AtSign}
              id="email"
              type="email"
              placeholder="name@company.com"
              error={errors.email}
              {...register("email")}
            />

            <FormField
              label="Password"
              actionLink={
                <a href="#" className="hover:underline">
                  Forgot?
                </a>
              }
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register("password")}
            />

            <Button
              type="submit"
              disabled={isLoading}
              variant="default"
              className={"w-full p-5"}
              // className="mt-1 w-full flex items-center justify-center gap-2 h-11.5 bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-[10px] transition-colors font-semibold text-[15px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              Yangi foydalanuvchimisiz?{" "}
              <a
                href="#"
                className="text-[#0f172a] dark:text-blue-400 font-semibold hover:underline"
              >
                Ro'yxatdan o'tish
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center text-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 mt-2">
          <span>
            &copy; {new Date().getFullYear()} Savdo daftar. All rights reserved.
          </span>
        </div>
      </div>

      {/* Login Overlay Loader */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-[#0c0a18]/70 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-500 mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 animate-pulse">
            Tizimga kirilmoqda...
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
