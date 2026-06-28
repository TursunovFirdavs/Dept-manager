import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { useFirms } from "@/hooks/useFirms";
import FirmCard from "@/components/FirmCard";

const FirmsPage = () => {
  const navigate = useNavigate();
  const {
    filteredFirms,
    searchQuery,
    setSearchQuery,
    isLoading,
    isCreating,
    handleCreateFirm,
  } = useFirms();

  const [newFirmName, setNewFirmName] = useState("");

  const onAddFirm = async (e) => {
    e.preventDefault();
    const success = await handleCreateFirm(newFirmName);
    if (success) {
      setNewFirmName("");
    }
  };

  return (
    <Container className="bg-[#f8fafc] dark:bg-[#0c0a18] min-h-screen pb-24 font-sans px-4">
      {/* Header */}
      <div className="flex items-center gap-3 py-6">
        <h2 className="text-[20px] font-bold text-slate-900 dark:text-white">
          Barcha Firmalar
        </h2>
      </div>

      {/* Add Firm Section */}
      <div className="mb-6">
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
          Yangi Firma Qo'shish
        </p>
        <form onSubmit={onAddFirm} className="flex gap-2">
          <Input
            type="text"
            placeholder="Firma nomi..."
            value={newFirmName}
            onChange={(e) => setNewFirmName(e.target.value)}
            className="h-12 rounded-[14px] bg-white dark:bg-[#121212] border-slate-200 dark:border-slate-800 text-[15px]"
            disabled={isCreating}
          />
          <Button
            type="submit"
            disabled={!newFirmName.trim() || isCreating}
            className="h-12 w-12 rounded-[14px] shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </Button>
        </form>
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
