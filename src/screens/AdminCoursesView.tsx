import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  X,
  Clock,
  Users,
  ArrowRight,
  Check,
  BookOpen,
  Trash2,
  Edit,
  DollarSign,
  Layers,
  GraduationCap
} from "lucide-react";
import { CourseModel, AcademicLevel } from "../types";

interface AdminCoursesViewProps {
  onBack: () => void;
}

export const AdminCoursesView: React.FC<AdminCoursesViewProps> = ({ onBack }) => {
  const {
    courses,
    teachers,
    subjects,
    addNewCourse,
    updateCourse,
    deleteCourse,
    addNewTeacher,
    addNewSubject,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"courses" | "add_course" | "teachers" | "subjects">("courses");

  // Add course form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("2000");
  const [oldPrice, setOldPrice] = useState("3000");
  const [cover, setCover] = useState("https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=900&auto=format&fit=crop&q=80");
  const [duration, setDuration] = useState("20 ساعة");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || "");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("secondary");
  const [levelLabel, setLevelLabel] = useState("3 ثانوي - بكالوريا");
  const [branch, setBranch] = useState("شعبة علوم تجريبية / رياضيات");

  // Teacher creation form states
  const [teacherName, setTeacherName] = useState("");
  const [teacherTitle, setTeacherTitle] = useState("");
  const [teacherBio, setTeacherBio] = useState("");
  const [teacherWilaya, setTeacherWilaya] = useState("16 - الجزائر العاصمة");

  // Subject creation form
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      showToast("يرجى ملء الحقول الإلزامية.");
      return;
    }

    const teacherObj = teachers.find((t) => t.id === selectedTeacherId);
    const subjectObj = subjects.find((s) => s.id === selectedSubjectId);

    addNewCourse({
      title,
      description: description || "دورة تعليمية شاملة ومطابقة لمنهاج وزارة التربية الوطنية الجزائرية.",
      price: parseFloat(price) || 2000,
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      cover: cover || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=900&auto=format&fit=crop&q=80",
      duration: duration || "15 ساعة",
      instructors: teacherObj ? [teacherObj.name] : ["أستاذ معتمد"],
      teacherIds: selectedTeacherId ? [selectedTeacherId] : [],
      subjectId: selectedSubjectId || "subj-math",
      subjectName: subjectObj ? subjectObj.name : "الرياضيات",
      academicLevel,
      levelLabel: levelLabel || "الطور الثانوي",
      branch,
      isFeatured: true,
      sections: [
        {
          id: "sec-" + Date.now(),
          title: "الوحدة 1: الأساسيات وحل التمارين النموذجية",
          order: 1,
          lessons: [
            {
              id: "les-" + Date.now(),
              title: "مدخل ومفاهيم الدرس التأسيسي",
              duration: "35 دقيقة",
              contentType: "video",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              isPreview: true,
            }
          ]
        }
      ]
    });

    setTitle("");
    setDescription("");
    showToast("تمت إضافة ونشر الدورة بنجاح في المنصة!");
    setActiveTab("courses");
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName) return;

    addNewTeacher({
      name: teacherName,
      title: teacherTitle || "أستاذ تعليم ثانوي معتمد",
      bio: teacherBio || "أستاذ ذو كفاءة عالية وخبرة في التدريس والتحضير للامتحانات الرسمية.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      wilaya: teacherWilaya,
      specialty: "التعليم والتدريب الأكاديمي",
      experienceYears: 10,
    });

    setTeacherName("");
    setTeacherTitle("");
    setTeacherBio("");
    showToast("تم تسجيل الملف التعريفي للأستاذ بنجاح!");
    setActiveTab("courses");
  };

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 pt-4 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-4 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl transition"
            aria-label="الرجوع"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black">لوحة الإدارة - قرايتي DZ</h1>
            <p className="text-xs text-slate-400">
              إدارة الكتالوج، نشر الدورات، وربط المناهج بالأساتذة (بدون حسابات أساتذة)
            </p>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 transition relative ${
            activeTab === "courses"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          الدورات المنشورة ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("add_course")}
          className={`pb-3 transition relative ${
            activeTab === "add_course"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          + إضافة ونشر دورة جديدة
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`pb-3 transition relative ${
            activeTab === "teachers"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-black"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          الملفات التعريفية للأساتذة ({teachers.length})
        </button>
      </div>

      {/* Tab: Courses List */}
      {activeTab === "courses" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">قائمة الدورات المفعلة للبيع</h3>
            <button
              onClick={() => setActiveTab("add_course")}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Plus size={14} />
              <span>دورة جديدة</span>
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={course.cover}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {course.levelLabel} • {course.subjectName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      الأستاذ: {course.instructors.join("، ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-800 font-mono">
                      {course.price.toLocaleString()} دج
                    </span>
                    {course.oldPrice && (
                      <span className="text-[10px] text-slate-400 line-through mr-1 font-mono">
                        {course.oldPrice.toLocaleString()} دج
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف دورة "${course.title}"؟`)) {
                        deleteCourse(course.id);
                        showToast("تم حذف الدورة.");
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="حذف الدورة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Add Course Form */}
      {activeTab === "add_course" && (
        <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">إضافة دورة تعليمية جزائرية جديدة</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الدورة</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: المراجعة النهائية في الرياضيات - بكالوريا 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">المادة التعليمية</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الأستاذ المقدم (ملف تعريفي)</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} - {t.specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الطور التعليمي</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="secondary">التعليم الثانوي (بكالوريا BAC)</option>
                <option value="middle">التعليم المتوسط (بيام BEM)</option>
                <option value="primary">التعليم الابتدائي</option>
                <option value="university">الجامعي والمهني</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تسمية المستوى / الشعبة</label>
              <input
                type="text"
                value={levelLabel}
                onChange={(e) => setLevelLabel(e.target.value)}
                placeholder="مثال: 3 ثانوي - بكالوريا"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الشعبة الدراسية</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="مثال: علوم تجريبية / رياضيات"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">السعر بالدينار الجزائري (دج)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">السعر السابق (للعرض والخصم)</label>
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="3000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">الوصف التفصيلي للدورة</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل الدورة، المحاور والوحدات المغطاة..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              نشر الدورة وإتاحتها للبيع فوراً
            </button>
          </div>
        </form>
      )}

      {/* Tab: Teachers Profiles */}
      {activeTab === "teachers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">+ إضافة ملف أستاذ جديد</h3>
            <form onSubmit={handleCreateTeacher} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="اسم الأستاذ الكامل"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="الصفة المهنية (مثال: أستاذ مكون)"
                  value={teacherTitle}
                  onChange={(e) => setTeacherTitle(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <textarea
                rows={2}
                placeholder="نبذة تعريفية مختصرة عن مساره الأكاديمي..."
                value={teacherBio}
                onChange={(e) => setTeacherBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition"
              >
                حفظ ملف الأستاذ
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teachers.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
                <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-emerald-800 font-semibold">{t.title}</p>
                  <span className="text-[10px] text-slate-400">{t.wilaya}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
