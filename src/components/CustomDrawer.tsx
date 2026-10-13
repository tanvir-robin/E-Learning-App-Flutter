import React from "react";
import { Home, BookOpen, Layers, Info, LogOut, ShieldAlert, X, Wallet, Settings, Crown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { signOut, currentUser, wallet, enrolledCourses } = useAuth();

  if (!isOpen) return null;

  const handleNav = (tab: string) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Sidebar */}
      <div className="relative w-76 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-emerald-800 p-6 text-white flex flex-col items-center justify-center relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-white text-emerald-800 rounded-2xl shadow-lg flex flex-col items-center justify-center mb-2.5 font-black">
            <span className="text-2xl leading-none">DZ</span>
            <span className="text-[9px] tracking-wider mt-0.5">قرايتي</span>
          </div>

          <h2 className="text-lg font-black tracking-wide">قرايتي DZ</h2>
          <p className="text-[11px] text-emerald-100 font-semibold mt-0.5">
            المنصة التعليمية الجزائرية
          </p>

          {currentUser && (
            <div className="mt-3 text-xs bg-white/15 px-3 py-1 rounded-full text-emerald-50 font-bold">
              {currentUser.name}
            </div>
          )}
        </div>

        {/* Quick balance in Drawer */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs px-5">
          <span className="text-slate-600 font-semibold">رصيد المحفظة:</span>
          <span className="font-bold text-emerald-800 font-mono">
            {wallet.balance.toLocaleString()} دج
          </span>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-3 overflow-y-auto">
          <nav className="space-y-1 px-3">
            <button
              onClick={() => handleNav("home")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <Home size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">الصفحة الرئيسية</span>
            </button>

            <button
              onClick={() => handleNav("courses")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <BookOpen size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">كتالوج الدورات</span>
            </button>

            <button
              onClick={() => handleNav("enrolled")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <Layers size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">دوراتي المشتراة ({enrolledCourses.length})</span>
            </button>

            <button
              onClick={() => handleNav("wallet")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <Wallet size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">المحفظة والدفع الجزائري</span>
            </button>

            <button
              onClick={() => handleNav("profile")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <Settings size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">إعدادات الحساب</span>
            </button>

            <div className="pt-2 border-t border-slate-100 my-1" />

            <button
              onClick={() => handleNav("about")}
              className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
            >
              <Info size={18} className="text-emerald-700 shrink-0" />
              <span className="text-xs">عن منصة قرايتي DZ</span>
            </button>

            {/* Owner Sovereign Dashboard - ONLY for verified owner */}
            {currentUser?.role === "owner" && (
              <button
                onClick={() => handleNav("owner")}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-900 bg-slate-900/5 hover:bg-slate-900/10 rounded-xl font-bold transition text-right cursor-pointer border border-slate-200/80"
              >
                <Crown size={18} className="text-amber-500 shrink-0" />
                <span className="text-xs font-black">لوحة المالك العام (Owner Dashboard)</span>
              </button>
            )}

            {/* Admin Courses Dashboard - ONLY for admin or owner */}
            {(currentUser?.role === "admin" || currentUser?.role === "owner") && (
              <button
                onClick={() => handleNav("admin")}
                className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl font-bold transition text-right cursor-pointer"
              >
                <ShieldAlert size={18} className="text-emerald-700 shrink-0" />
                <span className="text-xs">لوحة نشر الدورات والمحتوى (Admin)</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer with sign out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
