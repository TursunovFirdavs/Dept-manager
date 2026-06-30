import { useState, useEffect } from "react";
import { X, CreditCard, User, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import { getPaymentSettings, updatePaymentSettings } from "../../services/settings.service";

const PaymentSettingsModal = ({ isOpen, onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadSettings = async () => {
        setIsLoading(true);
        const data = await getPaymentSettings();
        if (data) {
          setCardNumber(data.cardNumber || "");
          setOwnerName(data.ownerName || "");
        }
        setIsLoading(false);
      };
      loadSettings();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (cardNumber.trim().length < 16) {
      toast.error("Karta raqami to'liq emas");
      return;
    }
    if (!ownerName.trim()) {
      toast.error("Ism kiritilishi shart");
      return;
    }
    
    setIsSaving(true);
    try {
      await updatePaymentSettings(cardNumber, ownerName);
      toast.success("To'lov sozlamalari yangilandi!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            To'lov Sozlamalari
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <FormField
                label="Karta Raqami"
                icon={CreditCard}
                iconPosition="left"
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="8600 0000 0000 0000"
              />
              
              <FormField
                label="Karta Egasi (Ism Familiya)"
                icon={User}
                iconPosition="left"
                id="ownerName"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Alisher Navoiy"
              />
            </>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Bekor qilish
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            onClick={handleSave} 
            disabled={isLoading || isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Saqlash
              </span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSettingsModal;
