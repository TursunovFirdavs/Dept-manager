import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowRight,
  Loader2,
  Store,
  User,
  Phone,
  Lock,
  AtSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { createUserProfile, registerUser } from "@/services/auth.service";

const registerSchema = z.object({
  shopName: z.string().min(2, "Do'kon nomi kamida 2 ta belgi bo'lishi kerak"),
  username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi kerak"),
  email: z.string().email("Yaroqsiz email manzili"),
  phone: z.string().min(9, "Telefon raqami kiritilishi shart"),
  password: z.string().min(8, "Parol kamida 8 ta belgi bo'lishi kerak"),
  description: z.string().optional(),
});

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const credential = await registerUser(data.email, data.password);

      const userProfile = await createUserProfile(credential.user.uid, data);
      console.log(userProfile);

      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");

      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <div className="w-full bg-white dark:bg-[#121212] rounded-[24px] p-8 shadow-sm border border-slate-200/60 dark:border-slate-800/60 mb-6">
        <h2 className="text-[20px] font-bold text-[#0f172a] dark:text-white mb-6 text-center">
          Yangi hisob ochish
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormField
            label="Shop Name"
            icon={Store}
            iconPosition="left"
            id="shopName"
            type="text"
            placeholder="Enter your business name"
            error={errors.shopName}
            className="mb-1"
            {...register("shopName")}
          />

          <FormField
            label="Username"
            icon={User}
            iconPosition="left"
            id="username"
            type="text"
            placeholder="Choose a unique username"
            error={errors.username}
            className="mb-1"
            {...register("username")}
          />

          <FormField
            label="Email address"
            icon={AtSign}
            id="email"
            type="email"
            placeholder="name@gmail.com"
            error={errors.email}
            {...register("email")}
          />

          <FormField
            label="Phone Number"
            icon={Phone}
            iconPosition="left"
            id="phone"
            type="text"
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            className="mb-1"
            {...register("phone")}
          />

          <FormField
            label="Password"
            icon={Lock}
            iconPosition="left"
            id="password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password}
            className="mb-1"
            {...register("password")}
          />

          <FormField
            label="Shop Description"
            id="description"
            type="textarea"
            placeholder="Tell us a little bit about your shop or financial goals..."
            error={errors.description}
            className="mb-2"
            {...register("description")}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white rounded-[12px] font-semibold text-[15px] mt-2 shadow-md transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign Up <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-[13px] text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
        <span className="text-[12px] text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Savdo daftar. All rights reserved.
        </span>
      </div>

      {/* Overlay Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-[#0c0a18]/70 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-500 mb-3" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 animate-pulse">
            Iltimos kuting...
          </p>
        </div>
      )}
    </>
  );
};

export default Register;
