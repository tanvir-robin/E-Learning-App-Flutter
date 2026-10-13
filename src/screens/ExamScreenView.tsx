import React, { useState, useEffect } from "react";
import { Exam } from "../types";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import { Clock, ArrowRight, RotateCcw, Award, CheckCircle2, XCircle } from "lucide-react";

interface ExamScreenViewProps {
  exam: Exam;
  onBack: () => void;
}

export const ExamScreenView: React.FC<ExamScreenViewProps> = ({ exam, onBack }) => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(exam.timeSeconds);
  const [isExamOver, setIsExamOver] = useState<boolean>(false);

  const questions = exam.questions;
  const currentQuestion = questions[currentIndex];
  const arabicOptionLetters = ["أ", "ب", "ج", "د"];

  useEffect(() => {
    if (isExamOver) return;
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExamOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamOver]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsExamOver(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setRemainingTime(exam.timeSeconds);
    setIsExamOver(false);
  };

  if (isExamOver) {
    const percent = Math.round((score / questions.length) * 100);
    const isPassed = percent >= 50;

    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5 border border-slate-100">
          <div
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              isPassed ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
            }`}
          >
            {isPassed ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              {isPassed ? "ممتاز! أنهيت الاختبار التقييمي بنجاح" : "حاول مجدداً للتحسين"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              النتيجة: {score} من {questions.length} إجابات صحيحة
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center text-xs font-bold">
            <span className="text-slate-600">النسبة المئوية:</span>
            <span className="font-mono text-base text-emerald-800">{percent}%</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span>إعادة المحاولة</span>
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
            >
              العودة للمنصة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowRight size={20} />
          </button>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
            {exam.name}
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl text-xs font-mono font-bold text-slate-700">
          <Clock size={14} className="text-emerald-700" />
          <span>{formatTime(remainingTime)}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Progress bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>السؤال {currentIndex + 1} من {questions.length}</span>
          <span className="font-mono">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-2.5">
            {currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              let optionClass = "border-slate-200 bg-white hover:border-slate-300 text-slate-700";

              if (showResult) {
                if (isCorrect) {
                  optionClass = "border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold";
                } else if (isSelected) {
                  optionClass = "border-rose-400 bg-rose-50 text-rose-800";
                }
              } else if (isSelected) {
                optionClass = "border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-600/20";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between text-xs sm:text-sm ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                      {arabicOptionLetters[idx] || idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            {!showResult ? (
              <button
                type="button"
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                {currentIndex < questions.length - 1 ? "السؤال التالي" : "عرض النتيجة النهائية"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
