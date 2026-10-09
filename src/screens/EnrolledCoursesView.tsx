import React from "react";
import { useAuth } from "../context/AuthContext";
import { CourseModel } from "../types";
import { Play, Layers, Clock, ArrowRight, ShieldCheck, Download } from "lucide-react";

interface EnrolledCoursesViewProps {
  onOpenPlayer: (course: CourseModel) => void;
  onExploreCourses: () => void;
}

export const EnrolledCoursesView: React.FC<EnrolledCoursesViewProps> = ({
  onOpenPlayer,
  onExploreCourses,
}) => {
  const { enrolledCourses } = useAuth();

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 pt-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">دوراتي المشتراة</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            جميع الدورات التعليمية المفعلة في حسابك لمتابعة دروسك
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-mono">
          {enrolledCourses.length} دورة مسجلة
        </span>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">لم تشترك في أي دورة بعد</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            تصفح كتالوج الدورات التعليمية لمختلف الأطوار واشحن محفظتك أو ادفع عبر بريدي موب للبدء.
          </p>
          <button
            onClick={onExploreCourses}
            className="px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition shadow-md"
          >
            تصفح الدورات المتاحة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {enrolledCourses.map(({ course, progress, completedLessons, receiptId, purchaseMethod }) => {
            const percent = Math.round(progress * 100);
            return (
              <div
                key={course.id}
                onClick={() => onOpenPlayer(course)}
                className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-100 hover:shadow-xl transition cursor-pointer flex flex-col group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {course.levelLabel}
                  </div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {course.subjectName}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      الأستاذ: {course.instructors.join("، ")}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-50 space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
                      <span>نسبة الإنجاز</span>
                      <span className="font-mono text-emerald-700">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {receiptId && (
                      <div className="text-[9px] text-slate-400 font-mono text-left pt-0.5">
                        وصل: {receiptId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
