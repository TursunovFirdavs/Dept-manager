import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDataStore } from "../store/dataStore";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Loader2 } from "lucide-react";
import { useFirms } from "@/hooks/useFirms";
import FirmCard from "@/components/FirmCard";

const FirmsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { isFirmsLoading: loading, fetchFirms } = useDataStore();
  
  const {
    filteredFirms,
    searchQuery,
    setSearchQuery,
    isLoading,
  } = useFirms();

  useEffect(() => {
    if (user) {
      fetchFirms(user.uid);
    }
  }, [user, fetchFirms]);



  if (loading) {
    return (
      <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4 p-4 flex flex-col gap-6">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[88px] w-full rounded-2xl" />
          <Skeleton className="h-[88px] w-full rounded-2xl" />
          <Skeleton className="h-[88px] w-full rounded-2xl" />
          <Skeleton className="h-[88px] w-full rounded-2xl" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] pb-24 font-sans px-4">
      {/* Add Firm Section */}
      <div className="my-6">
        <Button
          onClick={() => navigate("/firms/add")}
          className="w-full h-13 rounded-[16px] bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-semibold text-[15px] shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} /> Yangi Firma Qo'shish
        </Button>
      </div>
      {/* Search Section */}
      <div className="relative flex items-center gap-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-[14px] mb-6 shadow-sm">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Firmalarni qidirish..."
          className="bg-transparent border-none outline-none w-full text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Firms List */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <p className="font-bold text-slate-800 dark:text-slate-200">
            Ro'yxat
          </p>
          <p className="text-[12px] font-medium text-slate-500">
            {filteredFirms.length} ta firma
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredFirms.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-10 bg-white dark:bg-[#121212] rounded-[16px] border border-slate-100 dark:border-slate-800">
                Firmalar topilmadi
              </p>
            ) : (
              filteredFirms.map((firm) => (
                <FirmCard
                  key={firm.id}
                  firm={firm}
                  onClick={(id) => navigate(`/firms/${id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default FirmsPage;
