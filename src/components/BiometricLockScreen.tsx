import React, { useState, useEffect } from "react";
import { BiometricSecurityService, SecureDeviceBinding } from "../services/BiometricSecurityService";
import { Fingerprint, Lock, ShieldCheck, AlertCircle, ArrowLeft, KeyRound, Smartphone, CheckCircle2 } from "lucide-react";

interface BiometricLockScreenProps {
  binding: SecureDeviceBinding;
  onSuccess: () => void;
  onFallbackPassword: () => void;
  onUnlinkDevice: () => void;
}

export const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({
  binding,
  onSuccess,
  onFallbackPassword,
  onUnlinkDevice,
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [showConfirmUnlink, setShowConfirmUnlink] = useState<boolean>(false);

  // Auto trigger biometric scan on initial render like modern banking apps
  useEffect(() => {
    handleScanBiometric();
  }, []);

  const handleScanBiometric = async () => {
    setErrorMessage(null);
    setIsVerifying(true);
    try {
      const res = await BiometricSecurityService.authenticateWithBiometrics();
      if (res.success) {
        onSuccess();
      } else {
        setAttemptCount((prev) => prev + 1);
        setErrorMessage(res.message || "لم يتم التعرف على البصمة. يرجى إعادة المحاولة.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ أثناء المصادقة البيومترية.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-6 sm:p-8 font-sans select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>مصادقة أمان بنكية مشفرة</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
          <Smartphone size={13} />
          <span>{binding.deviceId}</span>
        </div>
      </div>

      {/* Center Biometric Interactive Zone */}
      <div className="flex flex-col items-center justify-center my-auto max-w-sm mx-auto text-center w-full">
        {/* Brand Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/30">
          <span className="text-emerald-400 text-xl font-black">DZ</span>
        </div>

        {/* Account Info: Name, Role & Email (Protected Data hidden until authenticated) */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 mb-1">
          {binding.enrolledName}
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-2">
          {binding.enrolledEmail}
        </p>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-medium mb-8">
          <Lock size={11} className="text-amber-400" />
          <span>الحساب مقفل بحماية البصمة البيومترية</span>
        </div>

        {/* Biometric Touch Sensor Button (Pulse Effect) */}
        <div className="relative my-4">
          {isVerifying && (
            <div className="absolute inset-0 rounded-full border-4 border-emerald-400/30 animate-ping pointer-events-none" />
          )}
          
          <button
            type="button"
            onClick={handleScanBiometric}
            disabled={isVerifying}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
              isVerifying
                ? "bg-emerald-600 text-white scale-105 shadow-emerald-500/40"
                : errorMessage
                ? "bg-rose-950/70 border-2 border-rose-500 text-rose-300 hover:scale-105 shadow-rose-900/40"
                : "bg-emerald-950/80 border-2 border-emerald-400/40 text-emerald-400 hover:scale-105 hover:border-emerald-300 shadow-emerald-900/50"
            }`}
          >
            <Fingerprint
              size={56}
              className={`transition-transform duration-300 ${
                isVerifying ? "animate-pulse" : ""
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-slate-300 font-bold mt-4">
          {isVerifying
            ? "جاري التحقق من البصمة مع معالج الجهاز الآمن..."
            : "المس مستشعر البصمة أو انقر للدخول"}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          {binding.deviceModel}
        </p>

        {/* Error notification if verification fails */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 max-w-xs animate-shake">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Bottom Actions: Fallback to Password or Unlink Device */}
      <div className="max-w-sm mx-auto w-full space-y-3 pb-4">
        {attemptCount >= 2 && (
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] text-center font-medium">
            هل تواجه صعوبة في التعرف على البصمة؟ يمكنك الدخول بكلمة المرور الأصلية.
          </div>
        )}

        <button
          type="button"
          onClick={onFallbackPassword}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer shadow-md"
        >
          <KeyRound size={15} className="text-emerald-400" />
          <span>الدخول بكلمة المرور التقليدية</span>
        </button>

        {!showConfirmUnlink ? (
          <button
            type="button"
            onClick={() => setShowConfirmUnlink(true)}
            className="w-full py-2 text-slate-500 hover:text-slate-300 text-[11px] font-semibold transition cursor-pointer"
          >
            إلغاء ربط هذا الحساب بالجهاز وتسجيل الخروج
          </button>
        ) : (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-2">
            <p className="text-[11px] text-rose-300 font-bold">
              هل أنت متأكد من رغبتك في إلغاء ربط الحساب وحذف مفاتيح البصمة من هذا الهاتف؟
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onUnlinkDevice}
                className="flex-1 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                نعم، فك الارتباط
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmUnlink(false)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                تراجع
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
