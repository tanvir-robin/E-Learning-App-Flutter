import React, { useState } from "react";
import { CourseModel } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  Clock,
  Users,
  PlayCircle,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle,
  Lock,
  Layers,
  Sparkles,
  BookOpen,
  MapPin,
  ChevronDown,
  ChevronUp,
  CreditCard
} from "lucide-react";

interface CourseDetailsViewProps {
  course: CourseModel;
  onBack: () => void;
  onEnroll: (course: CourseModel) => void;
  onPlayCourse: (course: CourseModel) => void;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({
  course,
  onBack,
  onEnroll,
  onPlayCourse,
}) => {
  const { isEnrolled, teachers } = useAuth();
  const [activeTab, setActiveTab] = useState<"curriculum" | "sections" | "instructor">("sections");
  const [openSectionId, setOpenSectionId] = useState<string>(course.sections[0]?.id || "");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const enrolled = isEnrolled(course.id);
  const teacher = teachers.find((t) => course.teacherIds?.includes(t.id)) || teachers[0];

  const toggleSection = (secId: string) => {
    setOpenSectionId(openSectionId === secId ? "" : secId);
  };

  const handleDownload = (title: string) => {
    setDownloadNotice(`جاري تحميل المرفق التعليمي "${title}"...`);
    setTimeout(() => setDownloadNotice(null), 2500);
  };

  const totalLessonsCount = course.sections.reduce((acc, sec) => acc + sec.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Notice Toast */}
      {downloadNotice && (
        <div className="fixed top-4 left-4 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Hero Header with Cover Image & Algerian Badges */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={course.cover}
          alt={course.title}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=900&auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition cursor-pointer"
          aria-label="الرجوع"
        >
          <ArrowRight size={20} />
        </button>

        {/* Title overlay at bottom of hero */}
        <div className="absolute bottom-5 right-5 left-5 text-white">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-block px-3 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-xs font-bold">
              {course.levelLabel}
            </span>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              مادة {course.subjectName}
            </span>
            {course.branch && (
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                {course.branch}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-md leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        {/* Info badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-800 px-3 py-1.5 rounded-full font-bold">
              <Clock size={15} className="text-emerald-700" />
              <span>المدة الإجمالية: {course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-800 px-3 py-1.5 rounded-full font-bold">
              <Layers size={15} className="text-emerald-700" />
              <span>{course.sections.length} أقسام ({totalLessonsCount} درس)</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-emerald-800 font-mono">
              {course.price.toLocaleString()} دج
            </span>
            {course.oldPrice && (
              <span className="text-xs text-slate-400 line-through mr-2 font-mono">
                {course.oldPrice.toLocaleString()} دج
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-2">عن هذه الدورة التعليمية</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("sections")}
            className={`pb-3 transition relative ${
              activeTab === "sections"
                ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            محتوى الدورة والدروس ({totalLessonsCount})
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`pb-3 transition relative ${
              activeTab === "curriculum"
                ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            محاور المنهاج الوزاري
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`pb-3 transition relative ${
              activeTab === "instructor"
                ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            الملف التعريفي للأستاذ
          </button>
        </div>

        {/* Tab 1: Sections & Lessons */}
        {activeTab === "sections" && (
          <div className="space-y-3">
            {course.sections.map((sec, sIdx) => {
              const isOpen = openSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(sec.id)}
                    className="w-full p-4 text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-mono">
                        {sIdx + 1}
                      </span>
                      <span>{sec.title}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({sec.lessons.length} دروس)
                      </span>
                    </div>
                    <div>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-slate-50 pt-2 space-y-2">
                      {sec.lessons.map((les, lIdx) => (
                        <div
                          key={les.id}
                          className="p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0">
                              <PlayCircle size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-800">
                                  {les.title}
                                </h4>
                                {les.isPreview && (
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                    معاينة مجانية
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                                المدة: {les.duration}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {enrolled || les.isPreview ? (
                              <button
                                onClick={() => onPlayCourse(course)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <span>تشغيل</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <Lock size={13} />
                                <span>مقفل</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Curriculum Overview */}
        {activeTab === "curriculum" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              محاور المنهاج الوطني الجزائري المغطاة في الدورة:
            </h3>
            {course.curriculumOverview?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            )) || (
              <p className="text-xs text-slate-500">تم تصميم الدورة وفق التدرج السنوي الوزاري الرسمي.</p>
            )}
          </div>
        )}

        {/* Tab 3: Teacher Profile (No login, pure presentation) */}
        {activeTab === "instructor" && teacher && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xs"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{teacher.name}</h3>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">{teacher.title}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{teacher.wilaya}</span>
                  </span>
                  <span>•</span>
                  <span>خبرة {teacher.experienceYears} سنة</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {teacher.bio}
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">سعر الاشتراك بالدورة:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">
                {course.price.toLocaleString()} دج
              </span>
              {course.oldPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {course.oldPrice.toLocaleString()} دج
                </span>
              )}
            </div>
          </div>

          <div>
            {enrolled ? (
              <button
                onClick={() => onPlayCourse(course)}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <PlayCircle size={18} />
                <span>متابعة مشاهدة الدورة</span>
              </button>
            ) : (
              <button
                onClick={() => onEnroll(course)}
                className="px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-700/20 transition flex items-center gap-2"
              >
                <CreditCard size={18} />
                <span>شراء الدورة الآن ({course.price.toLocaleString()} دج)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
