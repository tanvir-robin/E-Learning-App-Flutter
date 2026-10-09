import React, { useState } from "react";
import { Fingerprint, ShieldCheck, X, CheckCircle2, AlertCircle } from "lucide-react";
import { BiometricSecurityService } from "../services/BiometricSecurityService";
import { User } from "../types";

interface BiometricEnrollmentModalProps {
  user: User;
  onEnrolled: () => void;
  onDismiss: () => void;
}

export const BiometricEnrollmentModal: React.FC<BiometricEnrollmentModalProps> = ({
  user,
  onEnrolled,
  onDismiss,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await BiometricSecurityService.enrollBiometrics({
        uid: user.uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      });

      if (res.success) {
        onEnrolled();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تفعيل البصمة");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 relative">
        <button
          onClick={onDismiss}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Fingerprint size={36} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 text-emerald-800 rounded-full text-[11px] font-bold mb-2">
          <ShieldCheck size={13} />
          <span>حماية بنكية متقدمة</span>
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1.5">
          تفعيل الدخول بالبصمة البيومترية؟
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          يمكنك الآن فتح حسابك في <span className="font-bold text-emerald-700">قرايتي DZ</span> بسرعة وأمان عالي بلمسة واحدة مثل تطبيقات الدفع الإلكتروني، دون الحاجة لإعادة كتابة كلمة المرور كل مرة.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleEnable}
            disabled={isProcessing}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Fingerprint size={16} />
            <span>{isProcessing ? "جاري ربط البصمة المشفرة بالجهاز..." : "نعم، تفعيل الدخول بالبصمة الآن"}</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            ليس الآن (المتابعة بدون بصمة)
          </button>
        </div>
      </div>
    </div>
  );
};
