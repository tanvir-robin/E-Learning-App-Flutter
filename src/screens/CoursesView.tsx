import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CourseModel, AcademicLevel } from "../types";
import { Search, BookOpen, Layers, Filter, Clock } from "lucide-react";

interface CoursesViewProps {
  onSelectCourse: (course: CourseModel) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onSelectCourse }) => {
  const { courses, subjects } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | "all">("all");

  const filtered = courses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.instructors.some((inst) => inst.toLowerCase().includes(query.toLowerCase())) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.subjectName.toLowerCase().includes(query.toLowerCase());

    const matchesSubject = selectedSubject === "all" || c.subjectId === selectedSubject;
    const matchesLevel = selectedLevel === "all" || c.academicLevel === selectedLevel;

    return matchesQuery && matchesSubject && matchesLevel;
  });

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 pt-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">كتالوج الدورات التعليمية</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            استكشف المقررات المعتمدة والمراجعات الشاملة للمنهاج الجزائري
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-mono">
          {filtered.length} دورة
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم، المادة، أو الأستاذ..."
          className="w-full pr-10 pl-4 py-3 bg-white rounded-2xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 shadow-xs"
        />
        <Search className="absolute right-3.5 top-3.5 text-slate-400" size={18} />
      </div>

      {/* Level Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {[
          { id: "all", label: "جميع الأطوار" },
          { id: "secondary", label: "بكالوريا 3 ثانوي" },
          { id: "middle", label: "بيام BEM 4 متوسط" },
          { id: "primary", label: "الابتدائي" },
          { id: "university", label: "الجامعي والمهني" },
        ].map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id as any)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition ${
              selectedLevel === lvl.id
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        <button
          onClick={() => setSelectedSubject("all")}
          className={`px-3 py-1 rounded-xl whitespace-nowrap transition ${
            selectedSubject === "all"
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          كل المواد
        </button>
        {subjects.map((subj) => (
          <button
            key={subj.id}
            onClick={() => setSelectedSubject(subj.id)}
            className={`px-3 py-1 rounded-xl whitespace-nowrap transition ${
              selectedSubject === subj.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {subj.name}
          </button>
        ))}
      </div>

      {/* Courses List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-100 shadow-xs">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-base text-slate-800">لم يتم العثور على أي دورة مطابقة</p>
          <p className="text-xs text-slate-400 mt-1">حاول مسح خانة البحث أو تغيير معايير التصفية.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 hover:shadow-xl transition duration-300 cursor-pointer flex flex-col sm:flex-row gap-4 sm:gap-6 group"
            >
              {/* Cover thumbnail */}
              <div className="relative sm:w-60 h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={course.cover}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {course.levelLabel}
                </div>
                {course.oldPrice && (
                  <div className="absolute bottom-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    خصم {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <span>مادة {course.subjectName}</span>
                    {course.branch && (
                      <>
                        <span>•</span>
                        <span className="text-slate-500">{course.branch}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition mt-1.5 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold mt-3">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{course.duration}</span>
                    </span>
                    <span>•</span>
                    <span>الأستاذ: {course.instructors.join("، ")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-emerald-800 font-mono">
                      {course.price.toLocaleString()} دج
                    </span>
                    {course.oldPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {course.oldPrice.toLocaleString()} دج
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course);
                    }}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition"
                  >
                    عرض التفاصيل والتسجيل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
