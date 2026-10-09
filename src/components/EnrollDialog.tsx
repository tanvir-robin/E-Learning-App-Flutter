import React, { useState } from "react";
import { CourseModel } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  Wallet,
  CreditCard,
  Ticket,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Copy,
  Check,
  ShieldCheck
} from "lucide-react";

interface EnrollDialogProps {
  course: CourseModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: CourseModel) => void;
}

export const EnrollDialog: React.FC<EnrollDialogProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    wallet,
    purchaseCourseWithWallet,
    purchaseCourseWithBaridimob,
    redeemVoucher,
    currentUser,
  } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "baridimob" | "voucher">("wallet");
  const [voucherCode, setVoucherCode] = useState("");
  const [ripCopySuccess, setRipCopySuccess] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen || !course) return null;

  const BARIDIMOB_RIP = "007 99999 0023456789 44";
  const BARIDIMOB_NAME = "منصة قرايتي DZ للتعليم الرقمي (QRAYATI DZ)";

  const handleCopyRip = () => {
    navigator.clipboard?.writeText(BARIDIMOB_RIP.replace(/\s+/g, ""));
    setRipCopySuccess(true);
    setTimeout(() => setRipCopySuccess(false), 2000);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptUploaded(true);
      setReceiptFileName(e.target.files[0].name);
    }
  };

  const handleConfirmPurchase = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      if (paymentMethod === "wallet") {
        const res = await purchaseCourseWithWallet(course);
        if (!res.success) {
          setErrorMsg(res.message);
          setLoading(false);
          return;
        }
      } else if (paymentMethod === "baridimob") {
        if (!receiptUploaded) {
          setErrorMsg("يرجى إرفاق صورة أو ملف وصل التحويل عبر بريدي موب لتأكيد الطلب.");
          setLoading(false);
          return;
        }
        const res = await purchaseCourseWithBaridimob(course, BARIDIMOB_RIP);
        if (!res.success) {
          setErrorMsg(res.message);
          setLoading(false);
          return;
        }
      } else if (paymentMethod === "voucher") {
        if (!voucherCode.trim()) {
          setErrorMsg("يرجى كتابة رمز بطاقة التعبئة.");
          setLoading(false);
          return;
        }
        const vRes = await redeemVoucher(voucherCode);
        if (!vRes.success) {
          setErrorMsg(vRes.message);
          setLoading(false);
          return;
        }
        // Then purchase from wallet
        const pRes = await purchaseCourseWithWallet(course);
        if (!pRes.success) {
          setErrorMsg(pRes.message);
          setLoading(false);
          return;
        }
      }

      setSuccessMsg(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(false);
        onSuccess(course);
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء معالجة الطلب.");
      setLoading(false);
    }
  };

  const hasEnoughBalance = wallet.balance >= course.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">إتمام شراء الدورة التعليمية</h3>
            <p className="text-xs text-slate-500">اختر طريقة الدفع الجزائرية المناسبة لك</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={64} className="text-emerald-600 mb-3 animate-bounce" />
            <h4 className="text-xl font-bold text-slate-900">تم تفعيل الدورة بنجاح!</h4>
            <p className="text-sm text-slate-600 mt-1">
              أهلاً بك في الدورة! أصبحت جميع الدروس والمرفقات متاحة لك الآن.
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-4">
            {/* Course Summary Card */}
            <div className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={course.cover}
                alt={course.title}
                className="w-24 h-24 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {course.levelLabel}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  المادة: <span className="font-semibold text-slate-700">{course.subjectName}</span>
                </p>
                <div className="mt-2 text-base font-extrabold text-emerald-700">
                  السعر: {course.price.toLocaleString()} دج
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                اختر وسيلة الدفع:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Method 1: Wallet */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("wallet");
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === "wallet"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Wallet size={18} className={paymentMethod === "wallet" ? "text-emerald-700" : "text-slate-400"} />
                    <span className="text-[10px] font-bold text-slate-400">فوري</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">المحفظة الرقمية</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    الرصيد: {wallet.balance.toLocaleString()} دج
                  </span>
                </button>

                {/* Method 2: BaridiMob */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("baridimob");
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === "baridimob"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <CreditCard size={18} className={paymentMethod === "baridimob" ? "text-emerald-700" : "text-slate-400"} />
                    <span className="text-[10px] font-bold text-slate-400">وصل تحويل</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">بريدي موب (BaridiMob)</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    تحويل إلى حساب المنصة
                  </span>
                </button>

                {/* Method 3: Voucher */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("voucher");
                    setErrorMsg(null);
                  }}
                  className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between ${
                    paymentMethod === "voucher"
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Ticket size={18} className={paymentMethod === "voucher" ? "text-emerald-700" : "text-slate-400"} />
                    <span className="text-[10px] font-bold text-slate-400">تعبئة</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">بطاقة تعبئة</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    كود من المكتبة
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Details Container */}
            {paymentMethod === "wallet" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">رصيدك الحالي في المحفظة:</span>
                  <span className="font-bold text-slate-900">{wallet.balance.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">سعر الدورة المطلوب:</span>
                  <span className="font-bold text-emerald-700">{course.price.toLocaleString()} دج</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-slate-600">الرصيد المتبقي بعد الشراء:</span>
                  <span className={`font-bold ${hasEnoughBalance ? "text-slate-900" : "text-rose-600"}`}>
                    {hasEnoughBalance ? `${(wallet.balance - course.price).toLocaleString()} دج` : "رصيد غير كافٍ"}
                  </span>
                </div>
                {!hasEnoughBalance && (
                  <p className="text-rose-600 font-semibold pt-1">
                    * رصيدك لا يكفي. يمكنك اختيار طريقة "بريدي موب" أو شحن المحفظة ببطاقة تعبئة.
                  </p>
                )}
              </div>
            )}

            {paymentMethod === "baridimob" && (
              <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">
                    خطوات الدفع عبر تطبيق BaridiMob:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    1. قم بفتح تطبيق بريدي موب وأرسل مبلغ <strong className="text-slate-900 font-bold">{course.price.toLocaleString()} دج</strong> إلى الحساب البريدي التالي:
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">رقم الحساب البريدي RIP:</span>
                    <span className="font-mono font-bold text-sm text-slate-800" dir="ltr">
                      {BARIDIMOB_RIP}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">{BARIDIMOB_NAME}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRip}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-bold text-xs transition"
                  >
                    {ripCopySuccess ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{ripCopySuccess ? "تم النسخ" : "نسخ RIP"}</span>
                  </button>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">
                    2. أرفق صورة وصل التحويل (Capture d'écran):
                  </span>
                  <label className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:bg-amber-50/50 transition">
                    <Upload size={16} className="text-amber-700" />
                    <span className="text-xs font-semibold text-slate-700">
                      {receiptUploaded ? `تم اختيار: ${receiptFileName}` : "اضغط لاختيار صورة الوصل أو الـ PDF"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleSimulateUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {paymentMethod === "voucher" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    أدخل كود بطاقة التعبئة (Voucher):
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    تتوفر البطاقات لدى المكتبات المعتمدة (جرب تجريبياً: BAC5000 أو DZ2500 أو QRAYATI1000)
                  </p>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="مثال: BAC5000-8842-DZ"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Security Guarantee badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>
                وصول دائم للدورة طوال العام الدراسي + حماية كاملة لحسابك ومعاملاتك الرقمية.
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={loading || (paymentMethod === "wallet" && !hasEnoughBalance)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-xl shadow-md transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري التأكيد...</span>
                  </>
                ) : (
                  <span>تأكيد الشراء والتسجيل ({course.price.toLocaleString()} دج)</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
