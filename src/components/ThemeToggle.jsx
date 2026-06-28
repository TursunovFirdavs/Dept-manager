import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = (e) => {
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
      className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#121212] shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      {isDark ? (
        <Moon className="w-4.5 h-4.5" />
      ) : (
        <Sun className="w-4.5 h-4.5 text-amber-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
