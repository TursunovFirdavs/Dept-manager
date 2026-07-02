import { Lock, Headphones, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Blocked = () => {
  return (
    <div className="min-h-screen bg-[#f9f8f6] dark:bg-[#0c0a18] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-95 flex flex-col items-center">
        {/* Ikonka (Qulf) */}
        <div className="w-17 h-17 rounded-full bg-[#fef2f2] dark:bg-red-950/30 flex items-center justify-center mb-5">
          <Lock
            className="w-7 h-7 text-[#7f1d1d] dark:text-red-400"
            strokeWidth={2}
          />
        </div>

        {/* Sarlavha va matn */}
        <h1 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2.5 text-center leading-tight">
          Profilingiz bloklangan
        </h1>
        <p className="text-[14px] text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-7 px-2">
          Tizimdan foydalanish huquqiga ega emassiz. Iltimos, sababini bilish uchun administrator bilan bog'laning.
        </p>

        {/* Tugmalar */}
        <Link
          to={"https://t.me/FRDV001"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mb-3"
        >
          <Button variant="outline" size="lg" className={"w-full py-5"}>
            <Headphones className="w-4.5 h-4.5" strokeWidth={2.5} />
            <span>Admin bilan bog'lanish</span>
          </Button>
        </Link>

        <Link reloadDocument className="w-full">
          <Button variant="default" size="lg" className={"w-full py-5"}>
            <RefreshCcw className="w-4.5 h-4.5" strokeWidth={2.5} />
            <span>Qayta yuklash</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Blocked;
