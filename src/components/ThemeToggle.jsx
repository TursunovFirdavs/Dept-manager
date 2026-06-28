import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = (e) => {
    // Agar onCLick event orqali kelayotgan bo'lsa propagation to'xtatish
    if (e) e.stopPropagation();

    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label="Toggle Dark Mode"
      className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${isDark ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isDark ? "translate-x-5.5" : "translate-x-0.5"}`}
      />
    </button>
  );
};
