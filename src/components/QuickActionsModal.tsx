import React from "react";
import { Search, PlayCircle, Wallet, Bookmark, Ticket, Settings, X, CreditCard } from "lucide-react";

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onShowNotice?: (text: string) => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowNotice,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      label: "شحن المحفظة (DZD)",
      icon: Wallet,
      action: () => {
        onNavigate("wallet");
        onClose();
      },
    },
    {
      label: "الدورات المشتراة",
      icon: PlayCircle,
      action: () => {
        onNavigate("enrolled");
        onClose();
      },
    },
    {
      label: "تصفح كتالوج المواد",
      icon: Search,
      action: () => {
        onNavigate("courses");
        onClose();
      },
    },
    {
      label: "بطاقة تعبئة (Voucher)",
      icon: Ticket,
      action: () => {
        onNavigate("wallet");
        onClose();
      },
    },
    {
      label: "تحويل بريدي موب",
      icon: CreditCard,
      action: () => {
        onNavigate("wallet");
        onClose();
      },
    },
    {
      label: "إعدادات الحساب",
      icon: Settings,
      action: () => {
        onNavigate("profile");
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">إجراءات سريعة</h3>
            <p className="text-xs text-slate-500">منصة قرايتي DZ للتعليم الرقمي</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-100 transition text-right cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-xs shrink-0">
                  <Icon size={18} />
                </div>
                <span className="text-xs font-bold leading-tight">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
