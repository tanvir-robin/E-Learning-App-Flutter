import React, { useState, useEffect } from "react";
import { CourseModel, LessonItem } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  FileText,
  Download,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  RotateCcw,
  Wifi,
  WifiOff,
  Sparkles,
  Smartphone,
  HardDrive
} from "lucide-react";
import { QrayatiVideoPlayer } from "../components/QrayatiVideoPlayer";
import {
  playbackAuthorizationService,
  PlaybackAuthResult,
} from "../services/PlaybackAuthorizationService";
import { encryptedOfflineStorageService } from "../services/EncryptedOfflineStorageService";

interface CoursePlayerViewProps {
  course: CourseModel;
  onBack: () => void;
  onRequestEnroll?: () => void;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({
  course,
  onBack,
  onRequestEnroll,
}) => {
  const { currentUser, isEnrolled, enrolledCourses, updateCourseProgress } = useAuth();
  const enrolledData = enrolledCourses.find((e) => e.courseId === course.id);

  // Flatten all lessons across sections
  const allLessons: LessonItem[] = course.sections.flatMap((s) => s.lessons);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"lessons" | "attachments" | "offline">("lessons");
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Playback Auth State
  const [authResult, setAuthResult] = useState<PlaybackAuthResult>({
    authorized: false,
  });
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(true);

  // Offline Download State
  const [downloadingLessonId, setDownloadingLessonId] = useState<string | null>(null);
  const [offlineLessons, setOfflineLessons] = useState<string[]>([]);

  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  const userEnrolled = isEnrolled(course.id);
  const completedLessons = enrolledData?.completedLessons || [];
  const progressPercent = Math.round(
    (completedLessons.length / (allLessons.length || 1)) * 100
  );

  // Check offline downloads on mount
  useEffect(() => {
    const list = encryptedOfflineStorageService.getOfflineLessons();
    setOfflineLessons(list.map((l) => l.lessonId));
  }, []);

  // Request Playback Authorization whenever currentLesson or user changes
  const requestAuthorization = async () => {
    if (!currentLesson) return;
    setIsAuthorizing(true);

    const deviceId = currentUser?.devices?.[0]?.deviceId || "DEVICE_DZ_HW_01";

    const res = await playbackAuthorizationService.authorizePlayback({
      user: currentUser,
      course,
      lesson: currentLesson,
      isEnrolled: userEnrolled,
      currentDeviceId: deviceId,
    });

    setAuthResult(res);
    setIsAuthorizing(false);
  };

  useEffect(() => {
    requestAuthorization();
  }, [currentLessonIndex, currentUser, course.id]);

  const handleSelectLesson = (idx: number) => {
    setCurrentLessonIndex(idx);
  };

  const handleToggleComplete = (lessonId?: string) => {
    if (!lessonId) return;
    const isCompleted = completedLessons.includes(lessonId);
    const updated = isCompleted
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    const newProgress = updated.length / (allLessons.length || 1);
    updateCourseProgress(course.id, newProgress, updated);
  };

  const handleLessonEnded = () => {
    if (currentLesson) {
      if (!completedLessons.includes(currentLesson.id)) {
        handleToggleComplete(currentLesson.id);
      }
      // Autoplay next lesson if available
      if (currentLessonIndex < allLessons.length - 1) {
        setDownloadNotice("انتهى الدرس. جاري الانتقال للدرس التالي تلقائياً...");
        setTimeout(() => {
          setDownloadNotice(null);
          setCurrentLessonIndex((prev) => prev + 1);
        }, 1500);
      }
    }
  };

  const handleDownloadAttachment = (title: string) => {
    setDownloadNotice(`جاري تنزيل المرفق التعليمي: ${title}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleEncryptedDownload = async (lesson: LessonItem) => {
    if (!currentUser) return;
    setDownloadingLessonId(lesson.id);
    setDownloadNotice(`جاري تشفير وتنزيل درس "${lesson.title}" على هذا الجهاز حصرياً...`);

    // Simulate encrypted chunk transfer
    setTimeout(async () => {
      await encryptedOfflineStorageService.saveEncryptedLesson(
        lesson.id,
        course.id,
        lesson.title,
        lesson.duration,
        currentUser.uid,
        currentUser.devices?.[0]?.deviceId || "DEVICE_DZ_01"
      );
      setOfflineLessons((prev) => [...prev, lesson.id]);
      setDownloadingLessonId(null);
      setDownloadNotice(`تم التنزيل المشفر بنجاح! يمكن تشغيله عند انقطاع الإنترنت.`);
      setTimeout(() => setDownloadNotice(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      {/* Toast Notification */}
      {downloadNotice && (
        <div className="fixed top-4 left-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition cursor-pointer"
            aria-label="الرجوع"
          >
            <ArrowRight size={18} />
          </button>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
            <span className="text-[10px] text-slate-500 font-bold block">
              {course.levelLabel} • مادة {course.subjectName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
            <Shield size={13} className="text-emerald-600" />
            <span>مشغل قرايتي DZ المحمي</span>
          </div>
          <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
            {progressPercent}% مكتمل
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        {/* The Professional Video Player Component */}
        <QrayatiVideoPlayer
          course={course}
          lesson={currentLesson}
          authResult={authResult}
          onEnded={handleLessonEnded}
          onRefreshAuth={requestAuthorization}
          onRequestEnroll={onRequestEnroll}
        />

        {/* Current Lesson Metadata Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                الدرس الحالي ({currentLessonIndex + 1} من {allLessons.length})
              </span>
              <span className="text-xs text-slate-500 font-mono">
                المدة: {currentLesson?.duration}
              </span>
              {currentLesson?.isPreview && (
                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  معاينة مجانية
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
              {currentLesson?.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark as Completed Button */}
            <button
              onClick={() => handleToggleComplete(currentLesson?.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                completedLessons.includes(currentLesson?.id)
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              }`}
            >
              <CheckCircle2 size={16} />
              <span>
                {completedLessons.includes(currentLesson?.id)
                  ? "تم إكمال هذا الدرس"
                  : "تحديد الدرس كمكتمل"}
              </span>
            </button>

            {/* Offline Save Button */}
            {(userEnrolled || currentUser?.isAdmin) && (
              <button
                onClick={() => handleEncryptedDownload(currentLesson)}
                disabled={downloadingLessonId === currentLesson?.id || offlineLessons.includes(currentLesson?.id)}
                className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  offlineLessons.includes(currentLesson?.id)
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                title="حفظ مشفر للمشاهدة بدون إنترنت"
              >
                <HardDrive size={15} />
                <span className="hidden sm:inline">
                  {offlineLessons.includes(currentLesson?.id) ? "محفوظ أوفلاين" : "تنزيل مشفر"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Player Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "lessons"
                ? "text-emerald-800 border-b-2 border-emerald-700 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            فهرس الدروس ({allLessons.length})
          </button>
          <button
            onClick={() => setActiveTab("attachments")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "attachments"
                ? "text-emerald-800 border-b-2 border-emerald-700 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            المرفقات والملخصات
          </button>
          <button
            onClick={() => setActiveTab("offline")}
            className={`pb-3 transition relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === "offline"
                ? "text-emerald-800 border-b-2 border-emerald-700 font-black"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <WifiOff size={13} />
            <span>الدروس المحفوظة أوفلاين ({offlineLessons.length})</span>
          </button>
        </div>

        {/* Tab 1: Lessons List */}
        {activeTab === "lessons" && (
          <div className="space-y-2">
            {allLessons.map((les, idx) => {
              const isCurrent = idx === currentLessonIndex;
              const isDone = completedLessons.includes(les.id);
              const isDownloaded = offlineLessons.includes(les.id);
              const isAccessible = les.isPreview || userEnrolled || currentUser?.isAdmin;

              return (
                <div
                  key={les.id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(les.id);
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                        isDone ? "text-emerald-700" : "text-slate-300 hover:text-slate-500"
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent ? "text-emerald-950 font-black" : "text-slate-800"
                          }`}
                        >
                          {les.title}
                        </h4>
                        {les.isPreview && (
                          <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
                            مجاني
                          </span>
                        )}
                        {isDownloaded && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <HardDrive size={10} />
                            <span>أوفلاين</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                        {les.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-lg">
                        مشغل الآن
                      </span>
                    ) : !isAccessible ? (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Lock size={12} />
                        <span>يتطلب الشراء</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 hover:text-emerald-700">
                        <Play size={14} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Attachments */}
        {activeTab === "attachments" && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 mb-2">
              الملخصات وسلاسل التمارين الرسمية المرفقة بالدرس الحالي:
            </h4>
            {currentLesson?.attachments && currentLesson.attachments.length > 0 ? (
              currentLesson.attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-rose-600 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{att.title}</h5>
                      <span className="text-[10px] text-slate-500 font-mono">
                        الحجم: {att.size} • محمي بعلامة مائية رقمية
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadAttachment(att.title)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download size={14} />
                    <span>تحميل آمن</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                لا توجد وثائق PDF خاصة بهذا الدرس. يمكنك مراجعة المذكرات الشاملة في صفحة تفاصيل الدورة.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Encrypted Offline Storage */}
        {activeTab === "offline" && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                  <HardDrive size={16} className="text-emerald-700" />
                  <span>الخزينة المشفرة للتنزيل بدون إنترنت (Encrypted Offline Vault)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  تخزين مشفر محمي ومربوط حصرياً ببصمة هذا الجهاز. لا يمكن نقله أو مشاركته.
                </p>
              </div>
            </div>

            {offlineLessons.length > 0 ? (
              <div className="space-y-2">
                {offlineLessons.map((lId) => {
                  const item = allLessons.find((l) => l.id === lId);
                  return (
                    <div
                      key={lId}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-700" />
                        <div>
                          <div className="font-bold text-slate-900">{item?.title || lId}</div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            حجم الملف المشفر: ~48MB • مشفر بـ AES-256
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        جاهز بدون إنترنت
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                لم تقم بتنزيل أي درس أوفلاين حتى الآن. اضغط زر &quot;تنزيل مشفر&quot; بجانب الدرس لحفظه للمشاهدة بدون رصيد إنترنت.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
