import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const FormField = forwardRef(function FormField(
  { label, actionLink, icon: Icon, error, type = "text", id, className, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label & Action Link row */}
      {(label || actionLink) && (
        <div className="flex items-center justify-between mb-0.5">
          {label && (
            <label
              htmlFor={id}
              className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {label}
            </label>
          )}
          {actionLink && (
            <div className="text-[12px] text-[#0f172a] hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              {actionLink}
            </div>
          )}
        </div>
      )}

      {/* Input container */}
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          className={cn(
            "flex h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-[15px] text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-slate-800 dark:bg-[#121212] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-300/10 dark:focus-visible:border-slate-700",
            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
            Icon && "pr-10",
            isPassword && "pr-10"
          )}
          {...props}
        />

        {/* Right Icon */}
        {Icon && !isPassword && (
          <div className="absolute right-3.5 flex items-center text-slate-400 pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error text */}
      <div className="min-h-[20px] mt-0.5">
        {error && (
          <p className="text-[13px] font-medium text-red-500" role="alert">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
});

export default FormField;
