import { adminOpsService } from "../services/AdminOperationsService";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CourseModel } from "../types";
import { HomeView } from "../screens/HomeView";
import { CoursesView } from "../screens/CoursesView";
import { EnrolledCoursesView } from "../screens/EnrolledCoursesView";
import { CourseDetailsView } from "../screens/CourseDetailsView";
import { CoursePlayerView } from "../screens/CoursePlayerView";
import { WalletView } from "../screens/WalletView";
import { ProfileView } from "../screens/ProfileView";
import { AdminCoursesView } from "../screens/AdminCoursesView";
import { OwnerDashboardView } from "../screens/OwnerDashboardView";
import { AboutView } from "../screens/AboutView";
import { CustomDrawer } from "../components/CustomDrawer";
import { QuickActionsModal } from "../components/QuickActionsModal";
import { EnrollDialog } from "../components/EnrollDialog";
import {
  Home,
  BookOpen,
  Layers,
  Wallet,
  User,
  Plus,
  ArrowRight,
  Check,
  ShieldAlert
} from "lucide-react";

export const MainNavigation: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<CourseModel | null>(null);
  const [activePlayingCourse, setActivePlayingCourse] = useState<CourseModel | null>(null);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showOwnerDashboard, setShowOwnerDashboard] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState<boolean>(false);
  const [enrollingCourse, setEnrollingCourse] = useState<CourseModel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDrawerNavigation = (tabName: string) => {
    setSelectedCourse(null);
    setActivePlayingCourse(null);
    setShowAdmin(false);
    setShowOwnerDashboard(false);
    setShowAbout(false);
    switch (tabName) {
      case "home":
        setActiveTab(0);
        break;
      case "courses":
        setActiveTab(1);
        break;
      case "enrolled":
        setActiveTab(2);
        break;
      case "wallet":
        setActiveTab(3);
        break;
      case "profile":
        setActiveTab(4);
        break;
      case "admin": {
        // Enforce role authorization guard
        const adminCheck = adminOpsService.verifyAdministrativeAccess({ email: currentUser?.email });
        if (adminCheck.isAuthorized && (currentUser?.role === "admin" || currentUser?.role === "owner")) {
          setShowAdmin(true);
        } else {
          showToast("تنبيه أمني: ليس لديك صلاحية الوصول إلى لوحة إدارة المحتوى.");
        }
        break;
      }
      case "owner": {
        // Enforce sovereign owner authorization guard
        const ownerCheck = adminOpsService.verifyAdministrativeAccess({ email: currentUser?.email });
        if (ownerCheck.isAuthorized && ownerCheck.isOwner && currentUser?.role === "owner") {
          setShowOwnerDashboard(true);
        } else {
          showToast("تنبيه أمني: ليس لديك صلاحية الوصول إلى لوحة المالك العام.");
        }
        break;
      }
      case "about":
        setShowAbout(true);
        break;
      default:
        setActiveTab(0);
    }
  };

  // If active course player is opened
  if (activePlayingCourse) {
    return (
      <CoursePlayerView
        course={activePlayingCourse}
        onBack={() => setActivePlayingCourse(null)}
        onRequestEnroll={() => {
          setEnrollingCourse(activePlayingCourse);
        }}
      />
    );
  }

  // If course details is opened
  if (selectedCourse) {
    return (
      <>
        <CourseDetailsView
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onEnroll={(c) => setEnrollingCourse(c)}
          onPlayCourse={(c) => {
            setSelectedCourse(null);
            setActivePlayingCourse(c);
          }}
        />
        <EnrollDialog
          course={enrollingCourse}
          isOpen={!!enrollingCourse}
          onClose={() => setEnrollingCourse(null)}
          onSuccess={(c) => {
            showToast("تم تفعيل اشتراكك في الدورة بنجاح!");
            setSelectedCourse(c);
          }}
        />
      </>
    );
  }

  // If Owner panel is opened - ENFORCE SECURITY GUARD
  if (showOwnerDashboard) {
    const ownerAuth = adminOpsService.verifyAdministrativeAccess({ email: currentUser?.email });
    if (!ownerAuth.isAuthorized || !ownerAuth.isOwner || currentUser?.role !== "owner") {
      // Access Denied! Log incident and block
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-1">ليس لديك صلاحية الوصول</h2>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            لوحة المالك العام مخصصة حصرياً للمالك والمؤسس المعتمد في السجل الإداري لنظام قرايتي DZ. تم تسجيل محاولة الوصول وتوجيهك إلى مساحتك المصرح بها.
          </p>
          <button
            onClick={() => setShowOwnerDashboard(false)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            العودة إلى الواجهة التعليمية
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <OwnerDashboardView
          onBack={() => setShowOwnerDashboard(false)}
          onOpenAdminCourses={() => {
            setShowOwnerDashboard(false);
            setShowAdmin(true);
          }}
        />
      </div>
    );
  }

  // If Admin panel is opened - ENFORCE SECURITY GUARD
  if (showAdmin) {
    const adminAuth = adminOpsService.verifyAdministrativeAccess({ email: currentUser?.email });
    if (!adminAuth.isAuthorized || (currentUser?.role !== "admin" && currentUser?.role !== "owner")) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-1">ليس لديك صلاحية الوصول</h2>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            لوحة إدارة الدورات والمحتوى مخصصة فقط للأعضاء الإداريين المصرح لهم.
          </p>
          <button
            onClick={() => setShowAdmin(false)}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            العودة إلى الواجهة التعليمية
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AdminCoursesView onBack={() => setShowAdmin(false)} />
      </div>
    );
  }

  // If About view is opened
  if (showAbout) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setShowAbout(false)}
            className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight size={18} />
            <span>العودة للرئيسية</span>
          </button>
        </div>
        <AboutView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative font-sans text-slate-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-4 z-50 bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Screen */}
      <main className="flex-1">
        {activeTab === 0 && (
          <HomeView
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onSelectCourse={(c) => setSelectedCourse(c)}
            onOpenPlayer={(c) => setActivePlayingCourse(c)}
            onNavigateTab={(tab) => {
              if (tab === "courses") setActiveTab(1);
              if (tab === "enrolled") setActiveTab(2);
              if (tab === "wallet") setActiveTab(3);
              if (tab === "profile") setActiveTab(4);
            }}
            onOpenWallet={() => setActiveTab(3)}
            onOpenOwner={() => setShowOwnerDashboard(true)}
          />
        )}
        {activeTab === 1 && (
          <CoursesView onSelectCourse={(c) => setSelectedCourse(c)} />
        )}
        {activeTab === 2 && (
          <EnrolledCoursesView
            onOpenPlayer={(c) => setActivePlayingCourse(c)}
            onExploreCourses={() => setActiveTab(1)}
          />
        )}
        {activeTab === 3 && (
          <WalletView
            onBack={() => setActiveTab(0)}
            onExploreCourses={() => setActiveTab(1)}
          />
        )}
        {activeTab === 4 && (
          <ProfileView
            onSignOut={signOut}
            onNavigateTab={(tab) => {
              if (tab === "wallet") setActiveTab(3);
              if (tab === "enrolled") setActiveTab(2);
            }}
          />
        )}
      </main>

      {/* Floating Action Button (Docked center) */}
      <div className="fixed bottom-9 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsQuickActionsOpen(true)}
          className="w-13 h-13 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-full shadow-lg shadow-emerald-700/30 flex items-center justify-center transition border-4 border-white cursor-pointer"
          aria-label="الإجراءات السريعة"
        >
          <Plus size={26} />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-between px-3 py-2">
          {/* Tab 0: Home */}
          <button
            onClick={() => setActiveTab(0)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
              activeTab === 0 ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Home size={20} strokeWidth={activeTab === 0 ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold mt-1">الرئيسية</span>
          </button>

          {/* Tab 1: Courses Catalog */}
          <button
            onClick={() => setActiveTab(1)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
              activeTab === 1 ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <BookOpen size={20} strokeWidth={activeTab === 1 ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold mt-1">الدورات</span>
          </button>

          {/* Center spacer for FAB */}
          <div className="w-12 shrink-0" />

          {/* Tab 2: Enrolled / My Courses */}
          <button
            onClick={() => setActiveTab(2)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
              activeTab === 2 ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Layers size={20} strokeWidth={activeTab === 2 ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold mt-1">دوراتي</span>
          </button>

          {/* Tab 3: Wallet */}
          <button
            onClick={() => setActiveTab(3)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
              activeTab === 3 ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Wallet size={20} strokeWidth={activeTab === 3 ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold mt-1">المحفظة</span>
          </button>

          {/* Tab 4: Profile */}
          <button
            onClick={() => setActiveTab(4)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
              activeTab === 4 ? "text-emerald-800" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <User size={20} strokeWidth={activeTab === 4 ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold mt-1">حسابي</span>
          </button>
        </div>
      </nav>

      {/* Slide Drawer */}
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigation}
      />

      {/* Quick Actions Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigate={handleDrawerNavigation}
        onShowNotice={showToast}
      />

      {/* Enrollment Dialog */}
      <EnrollDialog
        course={enrollingCourse}
        isOpen={!!enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
        onSuccess={(c) => {
          showToast("تم تفعيل اشتراكك في الدورة بنجاح!");
        }}
      />
    </div>
  );
};
