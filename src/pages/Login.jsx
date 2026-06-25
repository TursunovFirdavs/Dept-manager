import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Loader2, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import FormField from "@/components/FormField";
import { loginUser } from "../services/auth.service";

/* ── Zod Schema ─────────────────────────────────────────────── */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email kiritish shart")
    .email("Email noto'g'ri formatda"),
  password: z
    .string()
    .min(1, "Parol kiritish shart")
    .min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

/* ── Firebase xatolik xabarlari ─────────────────────────────── */
const firebaseErrors = {
  "auth/user-not-found": "Foydalanuvchi topilmadi",
  "auth/wrong-password": "Noto'g'ri parol",
  "auth/invalid-email": "Email noto'g'ri formatda",
  "auth/invalid-credential": "Email yoki parol noto'g'ri",
  "auth/too-many-requests": "Ko'p urinish. Biroz kuting",
  "auth/user-disabled": "Bu hisob bloklangan",
  "auth/network-request-failed": "Internet aloqasi yo'q",
};

/* ── Component ──────────────────────────────────────────────── */
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await loginUser(data.email, data.password);
    } catch (error) {
      const message = firebaseErrors[error.code] || "Xatolik yuz berdi";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* loading overlay */}
      {isLoading && (
        <div
          className="login-overlay"
          aria-live="polite"
          aria-label="Yuklanmoqda"
        >
          <div className="login-overlay__spinner" />
          <p className="login-overlay__text">Loading...</p>
        </div>
      )}

      {/* glow blobs */}
      <div className="login-glow login-glow--top" aria-hidden="true" />
      <div className="login-glow login-glow--bottom" aria-hidden="true" />

      <div className="login-wrapper">
        {/* Icon */}
        <div className="login-icon-wrap">
          <UserCircle2 className="login-icon" />
        </div>

        {/* Heading */}
        <h1 className="login-title">Tizimga kirish</h1>
        <p className="login-subtitle">
          Hisobingizga kiring va boshqaruvni davom ettiring.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="login-form"
        >
          <FormField
            id="login-email"
            icon={Mail}
            type="email"
            placeholder="Email manzil"
            autoComplete="email"
            error={errors.email}
            {...register("email")}
          />

          <FormField
            id="login-password"
            icon={Lock}
            type="password"
            placeholder="Parol"
            autoComplete="current-password"
            error={errors.password}
            {...register("password")}
          />

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="login-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="login-btn__spinner" />
                Kirish...
              </>
            ) : (
              "Kirish"
            )}
          </button>
        </form>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Dept Manager
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
