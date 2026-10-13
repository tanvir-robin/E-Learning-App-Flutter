import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Fingerprint, ShieldCheck } from "lucide-react";
import { SecureDeviceBinding } from "../services/BiometricSecurityService";

interface AuthViewProps {
  enrolledBinding?: SecureDeviceBinding | null;
  onTriggerBiometric?: () => void;
}
import { ALGERIAN_WILAYAS } from "../data/coursesData";

export const AuthView: React.FC<AuthViewProps> = ({ enrolledBinding, onTriggerBiometric }) => {
  const { signIn, signUp, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("16 - الجزائر العاصمة");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password || (isSignUp && !name)) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة للمتابعة.");
      return;
    }
    try {
      if (isSignUp) {
        await signUp(email, password, name, phone, wilaya);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مجدداً.");
    }
  };

  const handleDemoLogin = async () => {
    await signIn("aymen.belhadj@qrayati.dz");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
        {/* Logo Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-emerald-700 text-white rounded-3xl shadow-xl shadow-emerald-700/20 flex flex-col items-center justify-center font-black">
            <span className="text-2xl leading-none">DZ</span>
            <span className="text-[10px] tracking-wider mt-0.5">قرايتي</span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">
            {isSignUp ? "إنشاء حساب طالب جديد" : "تسجيل الدخول إلى قرايتي DZ"}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            {isSignUp
              ? "انضم الآن إلى آلاف تلاميذ البكالوريا والتعليم المتوسط في الجزائر"
              : "سجّل الدخول للوصول إلى دوراتك ومحفظتك الرقمية"}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم واللقب
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أيمن بلحاج"
                      className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <User className="absolute right-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف (لحماية حسابك وتفعيل الدروس)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0550 12 34 56"
                      className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <Phone className="absolute right-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الولاية
                  </label>
                  <div className="relative">
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                    <MapPin className="absolute right-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@qrayati.dz"
                  className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Mail className="absolute right-3 top-3 text-slate-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Lock className="absolute right-3 top-3 text-slate-400" size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>جاري معالجة الطلب...</span>
              ) : (
                <span>{isSignUp ? "تسجيل الحساب والمتابعة" : "دخول المنصة"}</span>
              )}
            </button>
          </form>

          {/* Quick Biometric Access if device is enrolled */}
          {enrolledBinding && onTriggerBiometric && (
            <div className="mb-4 p-3.5 bg-emerald-950 text-white rounded-2xl border border-emerald-500/30 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-100">{enrolledBinding.enrolledName}</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>جاهز للفتح بالبصمة البيومترية</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onTriggerBiometric}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-sm"
              >
                فتح بالبصمة
              </button>
            </div>
          )}

          {/* Demo account logins with clear separation */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 text-center mb-1">
              حسابات تجريبية لاختبار المنظومة والصلاحيات:
            </div>
            <button
              type="button"
              onClick={async () => {
                await signIn("student@qrayati.dz", "password123");
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap size={15} className="text-emerald-700" />
              <span>دخول بحساب تلميذ (واجهة تعليمية نقية بدون إدارة)</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await signIn("aymen.belhadj@qrayati.dz", "ownerpass123");
              }}
              className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={15} className="text-amber-600" />
              <span>دخول بحساب المالك العام (تفعيل لوحة القيادة الموحدة)</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
              }}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 transition"
            >
              {isSignUp
                ? "لديك حساب بالفعل؟ تسجيل الدخول"
                : "ليس لديك حساب بعد؟ إنشاء حساب طالب"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
