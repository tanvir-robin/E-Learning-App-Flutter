import React from 'react';
import { EXAMS_DATA } from '../data/coursesData';
import { Exam } from '../types';
import { Clock, HelpCircle, ChevronLeft, Award } from 'lucide-react';

interface ExamHomeViewProps {
  onStartExam: (exam: Exam) => void;
}

export const ExamHomeView: React.FC<ExamHomeViewProps> = ({ onStartExam }) => {
  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#333333]">الاختبارات والتقييمات</h1>
        <p className="text-sm font-bold text-[#555555] mt-2">
          اختر اختبارك المفضل
        </p>
        <p className="text-xs text-[#888888] mt-0.5 leading-relaxed">
          اختر من قائمتنا المنسقة لتقييم معرفتك وخبرتك والحصول على شهادات إتمام معتمدة
        </p>
      </div>

      {/* List of Exam Tiles */}
      <div className="space-y-4">
        {EXAMS_DATA.map((exam) => (
          <div
            key={exam.id}
            onClick={() => onStartExam(exam)}
            className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:shadow-md transition duration-200 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#3D5CFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <Award size={28} />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-800 group-hover:text-[#3D5CFF] transition">
                  {exam.name}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5 font-bold">
                  <div className="flex items-center gap-1">
                    <Clock size={13} className="text-gray-400" />
                    <span>المدة: {exam.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HelpCircle size={13} className="text-gray-400" />
                    <span>{exam.questionCount} أسئلة</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-bold text-[#3D5CFF] bg-blue-50 px-3 py-1.5 rounded-full">
                بدء الاختبار
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#3D5CFF] group-hover:bg-blue-50 transition">
                <ChevronLeft size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
