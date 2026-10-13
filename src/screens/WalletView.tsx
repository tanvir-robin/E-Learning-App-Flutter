import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Ticket,
  CreditCard,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

interface WalletViewProps {
  onBack: () => void;
  onExploreCourses: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onBack, onExploreCourses }) => {
  const { wallet, redeemVoucher, topUpWalletBaridimob } = useAuth();

  const [activeTab, setActiveTab] = useState<"history" | "topup_voucher" | "topup_baridimob">("history");
  const [voucherInput, setVoucherInput] = useState("");
  const [baridimobAmount, setBaridimobAmount] = useState("3000");
  const [copiedRip, setCopiedRip] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [proofFileName, setProofFileName] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const BARIDIMOB_RIP = "007 99999 0023456789 44";

  const handleCopyRip = () => {
    navigator.clipboard?.writeText(BARIDIMOB_RIP.replace(/\s+/g, ""));
    setCopiedRip(true);
    setTimeout(() => setCopiedRip(false), 2000);
  };

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) {
      setStatusMsg({ type: "error", text: "يرجى كتابة رمز بطاقة التعبئة." });
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await redeemVoucher(voucherInput);
      if (res.success) {
        setStatusMsg({ type: "success", text: res.message });
        setVoucherInput("");
        setTimeout(() => setActiveTab("history"), 1500);
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "فشلت عملية شحن البطاقة." });
    } finally {
      setLoading(false);
    }
  };

  const handleBaridimobTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(baridimobAmount);
    if (!amountNum || amountNum < 500) {
      setStatusMsg({ type: "error", text: "الحد الأدنى للشحن عبر بريدي موب هو 500 دج." });
      return;
    }
    if (!proofUploaded) {
      setStatusMsg({ type: "error", text: "يرجى إرفاق صورة وصل التحويل البريدي." });
      return;
    }
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await topUpWalletBaridimob(amountNum);
      if (res.success) {
        setStatusMsg({ type: "success", text: res.message });
        setProofUploaded(false);
        setProofFileName("");
        setTimeout(() => setActiveTab("history"), 1500);
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "فشلت عملية الإيداع." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">المحفظة الرقمية</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة رصيدك بالدينار الجزائري، شحن الحساب، وسجل المعاملات
          </p>
        </div>
      </div>

      {/* Main Balance Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold mb-2">
              <Wallet size={16} />
              <span>الرصيد المتاح للدورات</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                {wallet.balance.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-200">دج</span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-2">
              العملة الرسمية: الدينار الجزائري (DZD) - آمن ومعتمد
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab("topup_voucher")}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Ticket size={16} />
              <span>شحن ببطاقة تعبئة</span>
            </button>
            <button
              onClick={() => setActiveTab("topup_baridimob")}
              className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white border border-emerald-400/30 text-xs font-bold transition flex items-center gap-1.5"
            >
              <CreditCard size={16} />
              <span>تحويل BaridiMob</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 transition relative ${
            activeTab === "history"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          سجل المعاملات ({wallet.transactions.length})
        </button>
        <button
          onClick={() => setActiveTab("topup_voucher")}
          className={`pb-3 transition relative ${
            activeTab === "topup_voucher"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          شحن بكود التعبئة
        </button>
        <button
          onClick={() => setActiveTab("topup_baridimob")}
          className={`pb-3 transition relative ${
            activeTab === "topup_baridimob"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          شحن عبر بريدي موب
        </button>
      </div>

      {/* Tab: Voucher Topup */}
      {activeTab === "topup_voucher" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Ticket size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">تعبئة الرصيد ببطاقة قرايتي DZ</h3>
              <p className="text-xs text-slate-500">
                أدخل الكود المطبوع على بطاقة التعبئة لشحن محفظتك فورياً
              </p>
            </div>
          </div>

          <form onSubmit={handleRedeemVoucher} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كود بطاقة التعبئة (Voucher Code):
              </label>
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="مثال: BAC5000 أو DZ2500 أو QRAYATI1000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                تتوفر البطاقات بفئات: 1,000 دج | 2,000 دج | 2,500 دج | 5,000 دج
              </p>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {statusMsg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جاري معالجة الكود...</span>
              ) : (
                <span>تأكيد شحن البطاقة الآن</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab: BaridiMob Topup */}
      {activeTab === "topup_baridimob" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">شحن الرصيد عبر تطبيق بريدي موب</h3>
              <p className="text-xs text-slate-500">
                قم بالتحويل عبر BaridiMob لحساب المنصة وارفاق صورة الوصل
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">حساب المنصة البريدي (RIP):</span>
              <span className="font-mono font-bold text-sm text-slate-800" dir="ltr">
                {BARIDIMOB_RIP}
              </span>
              <span className="text-xs text-slate-600 block mt-0.5">
                منصة قرايتي DZ للتعليم الرقمي
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyRip}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              {copiedRip ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedRip ? "تم النسخ" : "نسخ RIP"}</span>
            </button>
          </div>

          <form onSubmit={handleBaridimobTopUp} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المبلغ المراد شحنه (بالدينار الجزائري):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="500"
                  value={baridimobAmount}
                  onChange={(e) => setBaridimobAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">دج</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                وصل العملية من تطبيق بريدي موب:
              </label>
              <label className="flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                <Upload size={18} className="text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">
                  {proofUploaded ? `تم إرفاق: ${proofFileName}` : "اضغط لرفع لقطة شاشة وصل التحويل"}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProofUploaded(true);
                      setProofFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  statusMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {statusMsg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جاري إرسال طلب الشحن...</span>
              ) : (
                <span>تأكيد إيداع الرصيد</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Transaction History */}
      {activeTab === "history" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">العمليات السابقة</h3>
            <span className="text-xs text-slate-400">آخر التحديثات</span>
          </div>

          {wallet.transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
              <Clock size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">لا توجد عمليات سابقة</p>
              <p className="text-xs text-slate-400 mt-1">
                عند شحن رصيدك أو شراء الدورات ستظهر تفاصيل كل معاملة هنا.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {wallet.transactions.map((tx) => {
                const isDeposit = tx.type === "deposit" || tx.type === "voucher_redeem";
                return (
                  <div
                    key={tx.id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isDeposit ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {tx.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{new Date(tx.date).toLocaleDateString("ar-DZ")}</span>
                          {tx.referenceNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{tx.referenceNumber}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">مكتملة</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono font-bold text-sm">
                      <span className={isDeposit ? "text-emerald-700" : "text-slate-800"}>
                        {isDeposit ? "+" : "-"}
                        {tx.amount.toLocaleString()} دج
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
