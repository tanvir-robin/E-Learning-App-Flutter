import React, { useState } from "react";
import { DZ_FAQ_LIST } from "../data/coursesData";
import { ChevronDown, ChevronUp, BookOpen, Target, Sparkles, HelpCircle, ShieldCheck, MapPin } from "lucide-react";

export const AboutView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="pb-28 max-w-3xl mx-auto px-4 pt-4 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">عن منصة قرايتي DZ</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          المنصة الرقمية الجزائرية الأولى المتخصصة في المراجعات والدورات للمنهاج الوطني
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-6">
        <div>
          <h2 className="text-base font-bold text-emerald-800 mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            <span>رسالة قرايتي DZ لطلاب الجزائر</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تهدف منصة **قرايتي DZ** إلى توفير بيئة تعليمية رقمية متطورة لكل تلميذ وطالب في الجزائر،
            من خلال تقديم دروس مصورة فائقة الجودة يقدمها خيرة الأساتذة المكونين عبر ولايات الوطن الـ 58.
            سواء كنت تستعد لشهادة البكالوريا (BAC)، شهادة التعليم المتوسط (BEM)، أو تسعى لتقوية رصيدك
            المعرفي، نضع بين يديك المحتوى الأكاديمي الرسمي بأسلوب مبسط ومنهجي يضمن تفوقك.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-700" />
            <span>الدفع بالدينار الجزائري والأمان الرقمي</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ندعم الدفع الوطني المباشر بالدينار الجزائري (DZD) عبر بطاقات التعبئة، والتحويل الفوري عبر
            تطبيق بريدي موب (BaridiMob). كما نطبق أعلى معايير حماية الملكية الفكرية من خلال العلامة المائية
            الديناميكية لحماية محتوى الأساتذة والمنصة.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-base font-bold text-slate-850 mb-3 flex items-center gap-2">
          <HelpCircle size={18} className="text-emerald-700" />
          <span>الأسئلة الشائعة حول المنصة وطرق الدفع</span>
        </h3>
        <div className="space-y-2.5">
          {DZ_FAQ_LIST.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-800 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className="p-1 rounded-full text-slate-400">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-50 pt-2 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
