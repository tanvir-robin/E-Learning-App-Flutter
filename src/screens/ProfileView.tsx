import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BiometricSecurityService } from "../services/BiometricSecurityService";
import {
  User,
  Wallet,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Shield,
  HelpCircle,
  LogOut,
  X,
  Check,
  CreditCard,
  Edit3,
  Layers,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import { ALGERIAN_WILAYAS } from "../data/coursesData";

interface ProfileViewProps {
  onSignOut: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onSignOut, onNavigateTab }) => {
  const { currentUser, enrolledCourses, wallet, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || "");
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || "0770 45 88 12");
  const [wilayaInput, setWilayaInput] = useState(currentUser?.wilaya || "16 - الجزائر العاصمة");
  const [branchInput, setBranchInput] = useState(currentUser?.branch || "شعبة علوم تجريبية");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      phone: phoneInput,
      wilaya: wilayaInput,
      branch: branchInput,
    });
    setIsEditing(false);
    setToastMessage("تم تحديث البيانات الشخصية بنجاح!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="pb-28 max-w-3xl mx-auto px-4 pt-4 space-y-6">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed top-4 left-4 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <h1 className="text-2xl font-extrabold text-slate-900">حسابي الشخصي</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800 font-black text-2xl flex items-center justify-center mb-3">
          {currentUser?.name?.slice(0, 2) || "قز"}
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          {currentUser?.name || "طالب قرايتي DZ"}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-mono" dir="ltr">
          {currentUser?.email || "student@qrayati.dz"}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            {currentUser?.wilaya || "16 - الجزائر العاصمة"}
          </span>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {currentUser?.branch || "بكالوريا 2026"}
          </span>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 px-4 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
        >
          <Edit3 size={14} />
          <span>{isEditing ? "إلغاء التعديل" : "تعديل المعلومات"}</span>
        </button>
      </div>

      {/* Edit Form Modal/Section */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">تعديل الملف الشخصي</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم واللقب</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف الجزائري</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0550 00 00 00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الولاية</label>
              <select
                value={wilayaInput}
                onChange={(e) => setWilayaInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {ALGERIAN_WILAYAS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الشعبة أو الطور</label>
              <input
                type="text"
                value={branchInput}
                onChange={(e) => setBranchInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            حفظ التغييرات
          </button>
        </form>
      )}

      {/* Account Stats & Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onNavigateTab?.("wallet")}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">رصيد المحفظة</span>
            <span className="text-base font-black text-emerald-800 font-mono">
              {wallet.balance.toLocaleString()} دج
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab?.("enrolled")}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">الدورات المشتراة</span>
            <span className="text-base font-black text-slate-800 font-mono">
              {enrolledCourses.length} دورة
            </span>
          </div>
        </div>
      </div>

      {/* Quick Settings & Security Details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 mb-2">إعدادات الأمان والحماية</h3>
        
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
          <div className="flex items-center gap-2.5">
            <Shield size={16} className="text-emerald-700" />
            <span className="font-bold text-slate-800">حماية حساب الطالب</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
            مفعّل
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
          <div className="flex items-center gap-2.5">
            <Phone size={16} className="text-slate-500" />
            <span className="font-bold text-slate-800">العلامة المائية المخصصة برقم الهاتف</span>
          </div>
          <span className="text-[11px] font-mono text-slate-600">
            {currentUser?.phone || "0770 45 88 12"}
          </span>
        </div>
      </div>

      {/* Biometric & Device Binding Controls */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
          <Fingerprint size={16} className="text-emerald-700" />
          <span>المصادقة البيومترية وربط الأجهزة</span>
        </h4>
        
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-800">
              الدخول السريع بالبصمة (Touch ID / Fingerprint)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              فتح حسابك بأمان بلمسة واحدة مثل تطبيقات الدفع الإلكتروني
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (BiometricSecurityService.isEnrolledOnDevice()) {
                BiometricSecurityService.disableBiometrics();
                setToastMessage("تم إلغاء تفعيل البصمة وإلغاء ارتباط الجهاز بنجاح");
              } else if (currentUser) {
                BiometricSecurityService.enrollBiometrics({
                  uid: currentUser.uid,
                  email: currentUser.email,
                  name: currentUser.name,
                  phone: currentUser.phone,
                  role: currentUser.role,
                });
                setToastMessage("تم تفعيل المصادقة بالبصمة وربط الجهاز بنجاح");
              }
              setTimeout(() => {
                setToastMessage(null);
              }, 3000);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              BiometricSecurityService.isEnrolledOnDevice()
                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {BiometricSecurityService.isEnrolledOnDevice() ? "تعطيل البصمة" : "تفعيل الآن"}
          </button>
        </div>

        <div className="flex items-center justify-between px-3 text-[11px] text-slate-500">
          <span>معرّف الجهاز الموثوق:</span>
          <span className="font-mono font-bold text-slate-700">
            {BiometricSecurityService.getOrCreateDeviceId()}
          </span>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          onClick={onSignOut}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={16} />
          <span>تسجيل الخروج من الحساب</span>
        </button>
      </div>
    </div>
  );
};
