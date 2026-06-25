import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable FormField component
 *
 * Props:
 * - label?: string        — optional label text above input
 * - icon?: LucideIcon     — icon shown on the left inside input
 * - error?: FieldError    — react-hook-form error object
 * - type?: string         — input type; "password" enables eye toggle
 * - id?: string           — id for label htmlFor association
 * - className?: string    — extra wrapper classes
 * + all native <input> props spread (from react-hook-form register)
 */
const FormField = forwardRef(function FormField(
  { label, icon: Icon, error, type = "text", id, className, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Optional label */}
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </label>
      )}

      {/* Input row */}
      <div className="field-input-wrap">
        {Icon && (
          <span className="field-icon" aria-hidden="true">
            <Icon size={17} />
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          className={cn(
            "field-input",
            Icon && "field-input--icon-left",
            isPassword && "field-input--icon-right"
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            onClick={() => setShowPassword((v) => !v)}
            className="field-eye-btn"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>

      {/* Zod / react-hook-form error */}
      {error && (
        <p className="field-error" role="alert">
          <span aria-hidden="true">⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
});

export default FormField;
