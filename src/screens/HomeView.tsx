import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CourseModel, AcademicLevel } from "../types";
import { PROMOTIONAL_BANNERS } from "../data/coursesData";
import {
  Search,
  Menu,
  X,
  PlayCircle,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  GraduationCap,
  Calculator,
  Atom,
  Microscope,
  BookOpenCheck,
  PenTool,
  Globe,
  Wallet,
  CheckCircle2,
  ChevronLeft,
  Tag,
  Clock,
  Layers,
  ArrowUpRight,
  Crown
} from "lucide-react";

interface HomeViewProps {
  onOpenDrawer: () => void;
  onSelectCourse: (course: CourseModel) => void;
  onOpenPlayer: (course: CourseModel) => void;
  onNavigateTab: (tab: string) => void;
  onOpenWallet?: () => void;
  onOpenOwner?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenDrawer,
  onSelectCourse,
  onOpenPlayer,
  onNavigateTab,
  onOpenWallet,
  onOpenOwner,
}) => {
  const { currentUser, courses, subjects, enrolledCourses, wallet } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | "all">("all");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 17) return "مساء الخير";
    return "أهلاً بك";
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator": return <Calculator size={18} />;
      case "Atom": return <Atom size={18} />;
      case "Microscope": return <Microscope size={18} />;
      case "BookOpenCheck": return <BookOpenCheck size={18} />;
      case "PenTool": return <PenTool size={18} />;
      case "Globe": return <Globe size={18} />;
      default: return <GraduationCap size={18} />;
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesQuery =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructors.some((inst) => inst.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subjectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubjectId === "all" || course.subjectId === selectedSubjectId;

    const matchesLevel =
      selectedLevel === "all" || course.academicLevel === selectedLevel;

    return matchesQuery && matchesSubject && matchesLevel;
  });

  const bestSellers = courses.filter((c) => c.isBestSeller);
  const newCourses = courses.filter((c) => c.isNew || c.oldPrice);
  const lastEnrolled = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/80">
        <button
          onClick={onOpenDrawer}
          className="p-2 text-slate-700 hover:text-emerald-700 rounded-xl hover:bg-white transition"
          aria-label="فتح القائمة الرئيسية"
        >
          <Menu size={24} />
        </button>

        {isSearching ? (
          <div className="flex-1 mx-3 relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مادة، دورة، أو أستاذ..."
              className="w-full pr-10 pl-4 py-2 bg-white rounded-full text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
            <Search className="absolute right-3.5 top-2.5 text-slate-400" size={16} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
              DZ
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base block leading-none">
                قرايتي DZ
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                المنصة التعليمية الجزائرية
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {onOpenOwner && currentUser?.role === "owner" && (
            <button
              onClick={onOpenOwner}
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 rounded-xl text-xs font-black flex items-center gap-1.5 border border-amber-300 transition cursor-pointer"
              title="لوحة المالك العام"
            >
              <Crown size={15} className="text-amber-600" />
              <span className="hidden sm:inline">لوحة المالك</span>
            </button>
          )}
          {onOpenWallet && (
            <button
              onClick={onOpenWallet}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-xl transition flex items-center gap-1 text-xs font-bold"
              title="المحفظة"
            >
              <Wallet size={15} />
              <span className="font-mono text-[11px] hidden sm:inline">{wallet.balance.toLocaleString()} دج</span>
            </button>
          )}

          <button
            onClick={() => {
              if (isSearching) setSearchQuery("");
              setIsSearching(!isSearching);
            }}
            className="p-2 text-slate-700 hover:text-emerald-700 rounded-xl hover:bg-white transition"
            aria-label="البحث"
          >
            {isSearching ? <X size={22} /> : <Search size={22} />}
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 pt-5 space-y-7 max-w-5xl mx-auto">
        {/* Welcome & Student Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {getGreeting()}،
              </span>
              <h2 className="text-lg font-black text-slate-900">
                {currentUser?.name || "طالب قرايتي DZ"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              الولاية: <span className="font-bold text-slate-700">{currentUser?.wilaya || "16 - الجزائر العاصمة"}</span> • الطور: <span className="font-bold text-emerald-700">{currentUser?.branch || "بكالوريا 2026"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab("wallet")}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
            >
              <Wallet size={15} className="text-emerald-700" />
              <span>المحفظة:</span>
              <span className="font-mono text-emerald-800">{wallet.balance.toLocaleString()} دج</span>
            </button>
            <button
              onClick={() => onNavigateTab("enrolled")}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen size={15} />
              <span>دوراتي ({enrolledCourses.length})</span>
            </button>
          </div>
        </div>

        {/* Promotional Hero Carousel Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-7 shadow-lg">
          <div className="relative z-10 max-w-lg space-y-2">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-200">
              {PROMOTIONAL_BANNERS[0].badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-black leading-tight">
              {PROMOTIONAL_BANNERS[0].title}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {PROMOTIONAL_BANNERS[0].subtitle}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const target = courses.find((c) => c.id === PROMOTIONAL_BANNERS[0].targetCourseId);
                  if (target) onSelectCourse(target);
                  else onNavigateTab("courses");
                }}
                className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>استكشف العرض الآن</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => onNavigateTab("wallet")}
                className="px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-900/80 border border-white/20 text-white text-xs font-bold rounded-xl transition"
              >
                طرق الدفع بالدينار DZD
              </button>
            </div>
          </div>
        </div>

        {/* Continue Learning Card (if student is enrolled) */}
        {lastEnrolled && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle size={18} className="text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-800">مواصلة التعلّم</h3>
              </div>
              <button
                onClick={() => onNavigateTab("enrolled")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                جميع الدورات المشتراة
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={lastEnrolled.course.cover}
                  alt={lastEnrolled.course.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {lastEnrolled.course.subjectName}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                    {lastEnrolled.course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    الأستاذ: {lastEnrolled.course.instructors.join("، ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:border-r sm:border-slate-200 sm:pr-4">
                <div className="w-32">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>نسبة الإنجاز</span>
                    <span className="font-mono">{Math.round(lastEnrolled.progress * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(lastEnrolled.progress * 100)}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => onOpenPlayer(lastEnrolled.course)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <PlayCircle size={15} />
                  <span>متابعة</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Academic Level Selector Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers size={17} className="text-emerald-700" />
              <span>اختر الطور والمستوى التعليمي</span>
            </h3>
            <button
              onClick={() => {
                setSelectedLevel("all");
                setSelectedSubjectId("all");
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              إعادة ضبط
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "جميع الأطوار" },
              { id: "secondary", label: "التعليم الثانوي (بكالوريا BAC)" },
              { id: "middle", label: "التعليم المتوسط (بيام BEM)" },
              { id: "primary", label: "التعليم الابتدائي" },
              { id: "university", label: "الجامعي والمهني" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                  selectedLevel === lvl.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Algerian Subjects Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap size={18} className="text-emerald-700" />
              <span>المواد التعليمية (المنهاج الوطني الجزائري)</span>
            </h3>
            <span className="text-xs text-slate-400">{subjects.length} مواد متوفرة</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {subjects.map((subj) => {
              const isSelected = selectedSubjectId === subj.id;
              const subjCourseCount = courses.filter((c) => c.subjectId === subj.id).length;
              return (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(isSelected ? "all" : subj.id)}
                  className={`p-3.5 rounded-2xl border text-right transition flex items-start gap-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                      : "border-slate-100 bg-white hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${subj.colorHex}15`, color: subj.colorHex }}
                  >
                    {getSubjectIcon(subj.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {subj.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {subjCourseCount} دورات متاحة
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && selectedSubjectId === "all" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">الدورات الأكثر طلباً وإقبالاً</h3>
              </div>
              <button
                onClick={() => onNavigateTab("courses")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                عرض الكل
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bestSellers.map((course) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-lg transition cursor-pointer flex gap-4 group"
                >
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={course.cover}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      أكثر طلباً
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                        <span>{course.levelLabel}</span>
                        <span>•</span>
                        <span>{course.subjectName}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-1 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        الأستاذ: {course.instructors.join("، ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-emerald-700 font-mono">
                          {course.price.toLocaleString()} دج
                        </span>
                        {course.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through font-mono">
                            {course.oldPrice.toLocaleString()} دج
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Filtered Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-700" />
              <span>
                {selectedSubjectId !== "all"
                  ? `دورات مادة ${subjects.find((s) => s.id === selectedSubjectId)?.name}`
                  : "جميع الدورات المتاحة للبيع"}
              </span>
            </h3>
            <span className="text-xs text-slate-400">
              {filteredCourses.length} دورة
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm text-slate-800">لا توجد دورات تطابق هذا الاختيار حالياً</p>
              <p className="text-xs text-slate-400 mt-1">
                جرب تغيير المادة أو تفريغ خانة البحث لعرض باقي المقررات.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition cursor-pointer flex flex-col group"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={course.cover}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {course.levelLabel}
                    </div>
                    {course.oldPrice && (
                      <div className="absolute bottom-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        خصم {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {course.subjectName}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 line-clamp-2 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        الأستاذ: {course.instructors.join("، ")}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-emerald-700 font-mono block">
                          {course.price.toLocaleString()} دج
                        </span>
                        {course.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through font-mono">
                            {course.oldPrice.toLocaleString()} دج
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition">
                        تفاصيل الدورة
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
