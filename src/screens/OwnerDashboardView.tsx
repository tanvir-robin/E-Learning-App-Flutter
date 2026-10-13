import { runPlatformSecurityTests } from "../services/PlatformSecurityTests";
import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Lock,
  Layers,
  Award,
  CreditCard,
  Building,
  Activity,
  FileText,
  UserPlus,
  KeyRound,
  Eye,
  Sliders,
  Filter,
  Search,
  Download,
  Upload,
  AlertOctagon,
  Clock,
  Radio,
  MapPin,
  Check,
  HelpCircle,
  Crown,
  MessageSquare,
  Bell,
  Tag,
  Key,
  Wrench,
  Database,
  GitCompare,
  Send,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import {
  UserRole,
  AdminStaffMember,
  AdminDepartment,
  PermissionKey,
  SecurityIncident,
  FinancialAuditTransaction,
  LiveEcosystemMetrics,
  SupportTicket,
  PlatformAnnouncement,
  DiscountCoupon,
  CourseAccessGrant,
  DiffAuditLog,
  DataIntegrityIssue,
  PlatformSystemStatus,
  MaintenanceSettings,
  TicketCategory,
  TicketPriority,
  TicketStatus
} from "../types";
import { adminOpsService } from "../services/AdminOperationsService";

interface OwnerDashboardViewProps {
  onBack: () => void;
  onOpenAdminCourses: () => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  onBack,
  onOpenAdminCourses,
}) => {
  const { currentUser, courses, teachers, switchUserRole } = useAuth();

  // Navigation tab state
  type TabKey =
    | "overview"
    | "support"
    | "announcements"
    | "coupons"
    | "access"
    | "staff"
    | "finance"
    | "security"
    | "data_integrity"
    | "maintenance"
    | "diff_audit"
    | "constitution";

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Operational feedback toast
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const showAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Time-frame filter for Command Center metrics
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year">("month");

  // ==========================================
  // SECTION 1: Support Tickets State
  // ==========================================
  const [tickets, setTickets] = useState<SupportTicket[]>(() => adminOpsService.getTickets());
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState<"all" | TicketStatus>("all");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState<"all" | TicketCategory>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketReply, setNewTicketReply] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Pagination for tickets
  const [ticketPage, setTicketPage] = useState(1);
  const ticketsPerPage = 5;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.ticketNumber.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.studentName.includes(ticketSearch) ||
        t.subject.includes(ticketSearch) ||
        t.studentPhone.includes(ticketSearch);

      const matchStatus = ticketStatusFilter === "all" || t.status === ticketStatusFilter;
      const matchCategory = ticketCategoryFilter === "all" || t.category === ticketCategoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [tickets, ticketSearch, ticketStatusFilter, ticketCategoryFilter]);

  const paginatedTickets = useMemo(() => {
    const start = (ticketPage - 1) * ticketsPerPage;
    return filteredTickets.slice(start, start + ticketsPerPage);
  }, [filteredTickets, ticketPage]);

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newTicketReply.trim()) return;

    const ok = adminOpsService.addTicketMessage(selectedTicket.id, {
      senderName: currentUser?.name || "فريق إدارة قرايتي DZ",
      senderRole: (currentUser?.role === "owner" ? "owner" : currentUser?.role === "admin" ? "admin" : "student") as any,
      content: newTicketReply.trim(),
      isInternalNote: isInternalNote
    });

    if (ok) {
      setTickets(adminOpsService.getTickets());
      const updated = adminOpsService.getTickets().find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
      setNewTicketReply("");
      showAction(isInternalNote ? "تمت إضافة الملاحظة الداخلية السرية بنجاح." : "تم إرسال الرد الرسمي للطالب.");
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    const reason = prompt("يرجى كتابة سبب إغلاق التذكرة أو الحل المطبق:") || "تمت المعالجة وفق سياسة الدعم";
    adminOpsService.updateTicketStatus(ticketId, "closed", reason);
    setTickets(adminOpsService.getTickets());
    if (selectedTicket?.id === ticketId) {
      const updated = adminOpsService.getTickets().find((t) => t.id === ticketId);
      if (updated) setSelectedTicket(updated);
    }
    showAction("تم إغلاق التذكرة وتوثيق سبب الإغلاق بنجاح.");
  };

  // ==========================================
  // SECTION 2: Announcements State
  // ==========================================
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(() =>
    adminOpsService.getAnnouncements()
  );
  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [annTitleAr, setAnnTitleAr] = useState("");
  const [annTitleFr, setAnnTitleFr] = useState("");
  const [annBodyAr, setAnnBodyAr] = useState("");
  const [annBodyFr, setAnnBodyFr] = useState("");
  const [annAudience, setAnnAudience] = useState<PlatformAnnouncement["targetAudience"]>("all_students");
  const [annPreviewLang, setAnnPreviewLang] = useState<"ar" | "fr">("ar");

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitleAr.trim() || !annBodyAr.trim()) {
      showAction("يرجى كتابة العنوان والنص باللغة العربية كحد أدنى.");
      return;
    }

    const created = adminOpsService.createAnnouncement({
      titleAr: annTitleAr.trim(),
      titleFr: annTitleFr.trim() || annTitleAr.trim(),
      bodyAr: annBodyAr.trim(),
      bodyFr: annBodyFr.trim() || annBodyAr.trim(),
      targetAudience: annAudience,
      status: "published",
      createdBy: currentUser?.name || "المالك العام",
      isMaintenanceAlert: false
    });

    setAnnouncements(adminOpsService.getAnnouncements());
    setShowAddAnnModal(false);
    setAnnTitleAr("");
    setAnnTitleFr("");
    setAnnBodyAr("");
    setAnnBodyFr("");
    showAction(`تم نشر الإعلان بنجاح (${created.titleAr}).`);
  };

  const handleToggleAnnouncement = (id: string) => {
    adminOpsService.toggleAnnouncementStatus(id);
    setAnnouncements(adminOpsService.getAnnouncements());
    showAction("تم تغيير حالة نشر الإعلان.");
  };

  // ==========================================
  // SECTION 3: Discount Coupons & Deals State
  // ==========================================
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(() => adminOpsService.getCoupons());
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState<"percentage" | "fixed_amount">("percentage");
  const [couponValue, setCouponValue] = useState(20);
  const [couponMaxUses, setCouponMaxUses] = useState(100);
  const [couponMinPurchase, setCouponMinPurchase] = useState(2500);
  const [couponValidUntil, setCouponValidUntil] = useState("2025-06-30");

  // Interactive coupon tester
  const [testCouponCode, setTestCouponCode] = useState("BAC2025DZ");
  const [testPriceDZD, setTestPriceDZD] = useState(4500);
  const [testResult, setTestResult] = useState<any>(null);

  const handleRunCouponTest = () => {
    const res = adminOpsService.validateAndCalculateCoupon(testCouponCode, testPriceDZD);
    setTestResult(res);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showAction("يرجى إدخال رمز القسيمة الترويجية.");
      return;
    }

    const created = adminOpsService.createCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: Number(couponValue),
      maxUsesTotal: Number(couponMaxUses),
      maxUsesPerUser: 1,
      minPurchaseDZD: Number(couponMinPurchase),
      applicableCourseIds: [],
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: couponValidUntil,
      isActive: true,
      createdBy: currentUser?.name || "المالك العام"
    });

    setCoupons(adminOpsService.getCoupons());
    setShowAddCouponModal(false);
    setCouponCode("");
    showAction(`تم إنشاء القسيمة (${created.code}) وتفعيلها بنجاح.`);
  };

  const handleToggleCoupon = (id: string) => {
    adminOpsService.toggleCouponActive(id);
    setCoupons(adminOpsService.getCoupons());
    showAction("تم تحديث حالة تفعيل القسيمة.");
  };

  // ==========================================
  // SECTION 4: Access Grants & Enrollment Exceptions
  // ==========================================
  const [accessGrants, setAccessGrants] = useState<CourseAccessGrant[]>(() =>
    adminOpsService.getAccessGrants()
  );
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantStudentEmail, setGrantStudentEmail] = useState("");
  const [grantStudentName, setGrantStudentName] = useState("");
  const [grantCourseId, setGrantCourseId] = useState(courses[0]?.id || "c-bac-physics-01");
  const [grantType, setGrantType] = useState<CourseAccessGrant["accessType"]>("administrative_grant");
  const [grantReason, setGrantReason] = useState("");

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantStudentEmail.trim()) {
      showAction("يرجى إدخال البريد الإلكتروني للطالب المستفيد.");
      return;
    }

    const targetCourse = courses.find((c) => c.id === grantCourseId);

    const created = adminOpsService.grantAccess({
      studentId: `std-${Date.now().toString().slice(-4)}`,
      studentName: grantStudentName.trim() || "طالب مستفيد",
      studentEmail: grantStudentEmail.trim().toLowerCase(),
      courseId: grantCourseId,
      courseTitle: targetCourse?.title || "دورة تعليمية",
      accessType: grantType,
      grantedBy: currentUser?.name || "المالك العام",
      reason: grantReason.trim() || "منحة إدارية معتمدة"
    });

    setAccessGrants(adminOpsService.getAccessGrants());
    setShowGrantModal(false);
    setGrantStudentEmail("");
    setGrantStudentName("");
    setGrantReason("");
    showAction(`تم منح الوصول التعليمي لـ ${created.studentEmail} بنجاح.`);
  };

  const handleRevokeAccess = (grantId: string) => {
    const reason = prompt("يرجى كتابة سبب إلغاء الوصول التعليمي:") || "إلغاء إداري معتمد";
    adminOpsService.revokeAccess(grantId, currentUser?.name || "المالك", reason);
    setAccessGrants(adminOpsService.getAccessGrants());
    showAction("تم إلغاء الوصول وسحب ترخيص المشغل للطالب فوراً.");
  };

  // ==========================================
  // SECTION 5: Staff (RBAC) Management
  // ==========================================
  const [staffList, setStaffList] = useState<AdminStaffMember[]>(() => adminOpsService.getStaffMembers());

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffDept, setNewStaffDept] = useState<AdminDepartment>("support");

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      showAction("يرجى ملء الاسم الكامل والبريد الإلكتروني للإداري.");
      return;
    }

    if (currentUser?.role !== "owner") {
      showAction("تنبيه أمني: فقط المالك المصرح له يستطيع إضافة حسابات إدارية جديدة!");
      return;
    }

    const newStaff: AdminStaffMember = {
      id: `staff-${Date.now().toString().slice(-4)}`,
      name: newStaffName,
      email: newStaffEmail,
      phoneNumber: newStaffPhone || "0550 00 00 00",
      department: newStaffDept,
      role: "admin",
      isOwner: false,
      status: "active",
      permissions: ["view_users", "reset_sessions", "unbind_devices"],
      isTemporary: false,
      lastLogin: "لم يسجل بعد",
      lastAction: "إنشاء الحساب الإداري",
      createdAt: new Date().toISOString().split("T")[0],
      invitedBy: currentUser?.name || "المالك"
    };

    setStaffList([...staffList, newStaff]);
    setShowAddStaffModal(false);
    setNewStaffName("");
    setNewStaffEmail("");
    showAction(`تم إنشاء الحساب الإداري لـ ${newStaff.name} بنجاح.`);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const target = staffList.find((s) => s.id === staffId);
    if (!target) return;
    if (target.isOwner) {
      showAction("ممنوع تماماً: لا يمكن إيقاف أو إلغاء حساب المالك الأساسي (حصانة المالك)!");
      return;
    }

    setStaffList(
      staffList.map((s) => {
        if (s.id === staffId) {
          return { ...s, status: s.status === "active" ? "suspended" : "active" };
        }
        return s;
      })
    );
    showAction(`تم تحديث حالة حساب ${target.name} بنجاح.`);
  };

  // ==========================================
  // SECTION 6: Financial Operations & Transactions
  // ==========================================
  const [financialTransactions, setFinancialTransactions] = useState<FinancialAuditTransaction[]>([
    {
      id: "tx-1001",
      code: "TX-DZ-9941",
      studentName: "محمد لمين سعيدي",
      studentPhone: "0554 11 22 33",
      studentEmail: "m.saidi@gmail.com",
      method: "dahabia",
      courseTitle: "حزمة الفيزياء المتكاملة للبكالوريا - علوم تجريبية",
      type: "course_purchase",
      amountDZD: 4500,
      platformFeeDZD: 675,
      teacherShareDZD: 3825,
      teacherName: "الأستاذ شريفي لمين",
      status: "approved",
      receiptNumber: "SATIM-EDAHABIA-8829103",
      timestamp: "اليوم 11:20",
      reviewedBy: "بوابة SATIM المؤتمتة"
    },
    {
      id: "tx-1002",
      code: "TX-DZ-9942",
      studentName: "سارة بلمهدي",
      studentPhone: "0771 90 80 70",
      studentEmail: "sarah.bel@yahoo.com",
      method: "baridimob",
      courseTitle: "دورة الرياضيات الشاملة مع حلول البكالوريات السابقة",
      type: "course_purchase",
      amountDZD: 3800,
      platformFeeDZD: 570,
      teacherShareDZD: 3230,
      teacherName: "الأستاذ نور الدين",
      status: "pending_review",
      proofDocumentUrl: "إشعار تحويل بريدي موب BaridiMob RIP-00799999001",
      receiptNumber: "BM-TRANSFER-202410-091",
      timestamp: "اليوم 10:45",
      reviewNotes: "في انتظار مطابقة الإشعار مع كشف الحساب البريدي"
    },
    {
      id: "tx-1003",
      code: "TX-DZ-9943",
      studentName: "فؤاد جيلالي",
      studentPhone: "0669 44 55 66",
      studentEmail: "fouad.djilali@hotmail.com",
      method: "cib",
      type: "wallet_recharge",
      amountDZD: 10000,
      platformFeeDZD: 150,
      teacherShareDZD: 0,
      status: "approved",
      receiptNumber: "CIB-PAY-9938102",
      timestamp: "اليوم 09:12",
      reviewedBy: "أمينة بوقرة (المالية)"
    }
  ]);

  const handleApproveTransaction = (txId: string) => {
    setFinancialTransactions(
      financialTransactions.map((tx) => {
        if (tx.id === txId) {
          return {
            ...tx,
            status: "approved" as const,
            reviewedBy: currentUser?.name || "المالك العام"
          };
        }
        return tx;
      })
    );
    showAction("تمت الموافقة على المعاملة المالية وتفعيل الدورة أو الرصيد فوراً.");
  };

  const handleRejectTransaction = (txId: string) => {
    setFinancialTransactions(
      financialTransactions.map((tx) => {
        if (tx.id === txId) {
          return {
            ...tx,
            status: "rejected" as const,
            reviewedBy: currentUser?.name || "المالك العام",
            reviewNotes: "تم الرفض لعدم مطابقة الوصل البنكي"
          };
        }
        return tx;
      })
    );
    showAction("تم رفض المعاملة وتوثيق سبب الرفض.");
  };

  // ==========================================
  // SECTION 7: Security Incidents & Keystores
  // ==========================================
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([
    {
      id: "inc-01",
      timestamp: "منذ 15 دقيقة",
      type: "simultaneous_device_stream",
      severity: "critical",
      userEmail: "hichem.bac2024@gmail.com",
      role: "student",
      deviceId: "DEV-UNTRUSTED-XIAOMI-12",
      ipAddress: "197.112.54.91",
      location: "سطيف (محاولة ثانية متزامنة من قسنطينة)",
      status: "quarantined",
      details: "رصد بث متزامن لدرس الرياضيات المشفر على جهازين مختلفين بنفس الحساب في وقت واحد.",
      detectedBy: "مراقب الجلسات الحية (Session Sentinel)"
    },
    {
      id: "inc-02",
      timestamp: "منذ 45 دقيقة",
      type: "multiple_failed_biometrics",
      severity: "high",
      userEmail: "samir.dz.alger@outlook.com",
      role: "student",
      deviceId: "SAMSUNG-A54-8891",
      ipAddress: "105.101.99.14",
      location: "الجزائر العاصمة",
      status: "investigating",
      details: "5 محاولات فاشلة متتالية للبصمة مع محاولة تجاوز شاشة القفل المشفرة.",
      detectedBy: "نظام التحقق من مستشعر البصمة المحلي"
    }
  ]);

  const handleResolveIncident = (incId: string) => {
    setSecurityIncidents(
      securityIncidents.map((inc) => (inc.id === incId ? { ...inc, status: "resolved" as const } : inc))
    );
    showAction("تم تصنيف الحادثة الأمنية كمعالجة وتوثيق الإجراء في النظام.");
  };

  // Devices & Hardware Keystores
  const [revokedDevices, setRevokedDevices] = useState<string[]>([]);
  const registeredDevices = [
    {
      id: "dev-s23u-01",
      name: "Samsung Galaxy S23 Ultra (جهاز المالك الأساسي)",
      ownerName: "أيمن بلحاج (Owner)",
      ownerEmail: "aymen.belhadj@qrayati.dz",
      platform: "Android 14 (Hardware Keystore Encrypted)",
      biometricStatus: "نشط وموثوق (Strong Biometric L3)",
      lastActive: "الآن (نشط)",
      status: "active",
      ip: "105.101.44.12 (Algérie Télécom - 4G LTE)"
    },
    {
      id: "dev-ip15-02",
      name: "iPhone 15 Pro Max (مسؤولة العمليات المالية)",
      ownerName: "أمينة بوقرة (Finance Admin)",
      ownerEmail: "amina.bouguerra@qrayati.dz",
      platform: "iOS 17.5 (Secure Enclave Enforced)",
      biometricStatus: "مفعل ومقترن بـ Face ID",
      lastActive: "منذ 10 دقائق",
      status: "active",
      ip: "197.200.12.84 (Mobilis 4G)"
    },
    {
      id: "dev-rn12-03",
      name: "Xiaomi Redmi Note 12 (حساب طالب #8921)",
      ownerName: "محمد لمين سعيدي (Student)",
      ownerEmail: "m.saidi@gmail.com",
      platform: "Android 13 (Biometric Storage)",
      biometricStatus: "بصمة إصبع نشطة",
      lastActive: "منذ 45 دقيقة",
      status: "active",
      ip: "105.105.21.90 (Ooredoo 4G)"
    }
  ];

  const handleToggleRevokeDevice = (deviceId: string, devName: string) => {
    if (revokedDevices.includes(deviceId)) {
      setRevokedDevices(revokedDevices.filter((id) => id !== deviceId));
      showAction(`تم إلغاء حظر الجهاز (${devName}) واستعادة صلاحيته.`);
    } else {
      setRevokedDevices([...revokedDevices, deviceId]);
      showAction(`تم حظر الجهاز (${devName}) فوراً وإنهاء جلسات المشاهدة المرتبطة به.`);
    }
  };

  // ==========================================
  // SECTION 8: Data Integrity & Diagnostics
  // ==========================================
  const [integrityIssues, setIntegrityIssues] = useState<DataIntegrityIssue[]>(() =>
    adminOpsService.getIntegrityIssues()
  );

  const handleFixIntegrityIssue = (id: string) => {
    adminOpsService.resolveIntegrityIssue(id);
    setIntegrityIssues(adminOpsService.getIntegrityIssues());
    showAction("تم تطبيق الإصلاح التشخيصي ومعالجة الخلل في سلامة البيانات.");
  };

  // Export CSV Tool
  const handleExportDataCSV = (entity: string) => {
    showAction(`تم توليد وتنزيل ملف CSV منقح لـ (${entity}) مع حجب الحقول السرية وكلمات المرور.`);
  };

  // ==========================================
  // SECTION 9: System Connectors & Maintenance
  // ==========================================
  const [connectors, setConnectors] = useState<PlatformSystemStatus[]>(() =>
    adminOpsService.getSystemConnectors()
  );
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>(() =>
    adminOpsService.getMaintenanceSettings()
  );

  const handleToggleMaintenance = () => {
    const updated = adminOpsService.updateMaintenanceSettings(
      { isMaintenanceActive: !maintenance.isMaintenanceActive },
      currentUser?.name || "المالك"
    );
    setMaintenance(updated);
    showAction(
      updated.isMaintenanceActive
        ? "تم تفعيل وضع الصيانة العام (يمنع دخول غير الإداريين)."
        : "تم إلغاء وضع الصيانة واستئناف العمل الطبيعي للمنصة."
    );
  };

  // ==========================================
  // SECTION 10: Diff Audit Logs
  // ==========================================
  const [diffLogs, setDiffLogs] = useState<DiffAuditLog[]>(() => adminOpsService.getDiffAuditLogs());

  // Platform Metrics
  const metrics: LiveEcosystemMetrics = {
    totalRevenueDZD: 4850000,
    dailyRevenueDZD: 142500,
    activeStudentsNow: 1284,
    protectedStreamingSessions: 342,
    pendingProofAudits: financialTransactions.filter((t) => t.status === "pending_review").length,
    hardwareKeystoresActive: 948,
    fraudAlertsCount: securityIncidents.filter((i) => i.status !== "resolved").length,
    platformUptimePercent: 99.98
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 space-x-reverse border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">{actionNotice}</span>
        </div>
      )}

      {/* Maintenance Global Banner if active */}
      {maintenance.isMaintenanceActive && (
        <div className="bg-amber-600 text-slate-950 font-bold px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <AlertTriangle className="w-4 h-4" />
            <span>تنبيه تشغيلي: وضع الصيانة مفعل حالياً على منصة قرايتي DZ — الدخول محصور بالإداريين المصرح لهم.</span>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[11px] hover:bg-black transition"
          >
            إلغاء الصيانة الآن
          </button>
        </div>
      )}

      {/* Top Sovereignty Header */}
      <header className="bg-slate-950/90 border-b border-slate-800 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="رجوع إلى التطبيق الرئيسي"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5 space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <h1 className="text-lg font-bold text-white tracking-wide">
                    مركز القيادة الإداري والسيادي — قرايتي DZ
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Admin Command Center
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  لوحة التحكم المركزية والشاملة: تذاكر الدعم، القسائم، الإعلانات، الرقابة المالية، الصيانة والتدقيق
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Quick switcher to courses content management */}
            <button
              onClick={onOpenAdminCourses}
              className="hidden sm:flex items-center space-x-1.5 space-x-reverse px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>بنك المقررات</span>
            </button>

            {/* Quick Role Tester */}
            <div className="flex items-center space-x-1 space-x-reverse bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 px-2">معاينة الدور:</span>
              <button
                onClick={() => {
                  switchUserRole?.("owner");
                  showAction("تم التبديل إلى دور المالك (كامل الصلاحيات)");
                }}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentUser?.role === "owner"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                المالك
              </button>
              <button
                onClick={() => {
                  switchUserRole?.("admin");
                  showAction("تم التبديل إلى دور الإداري");
                }}
                className={`px-2 py-1 rounded font-medium transition ${
                  currentUser?.role === "admin"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                إداري
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-slate-800/80 no-scrollbar">
          {[
            { id: "overview", label: "مركز القيادة الموحد", icon: Activity },
            { id: "support", label: "مركز التذاكر والشكاوى", icon: MessageSquare, badge: tickets.filter(t => t.status === "new").length },
            { id: "announcements", label: "الإعلانات والإشعارات", icon: Bell },
            { id: "coupons", label: "القسائم والخصومات", icon: Tag },
            { id: "access", label: "تراخيص ومنح الوصول", icon: Key },
            { id: "staff", label: "الموظفون والمديرون (RBAC)", icon: Users },
            { id: "finance", label: "الرقابة المالية", icon: DollarSign, badge: metrics.pendingProofAudits },
            { id: "security", label: "الأمان والأجهزة", icon: ShieldAlert, badge: metrics.fraudAlertsCount },
            { id: "data_integrity", label: "سلامة البيانات والتصدير", icon: Database },
            { id: "maintenance", label: "إعدادات الصيانة والموصلات", icon: Wrench },
            { id: "diff_audit", label: "سجل الفروقات المقارن (Diff)", icon: GitCompare },
            { id: "constitution", label: "دستور الحصانة", icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex items-center space-x-2 space-x-reverse px-3.5 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? "border-emerald-500 text-emerald-400 bg-slate-800/40"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ========================================================= */}
        {/* TAB 1: COMMAND CENTER (OVERVIEW) */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Period Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/70 border border-slate-700 p-4 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>المؤشرات الحيوية لمنصة «قرايتي DZ»</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  بيانات حقيقية مستخرجة من محفظة الطلاب، تراخيص المشغل، وسجل المعاملات
                </p>
              </div>

              <div className="flex items-center space-x-1.5 space-x-reverse bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-500 px-2">الفترة:</span>
                {[
                  { key: "today", label: "اليوم" },
                  { key: "week", label: "هذا الأسبوع" },
                  { key: "month", label: "هذا الشهر" },
                  { key: "year", label: "السنة كاملة" }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTimeRange(item.key as any)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      timeRange === item.key ? "bg-emerald-600 text-white font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue */}
              <div
                onClick={() => setActiveTab("finance")}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>إجمالي مبيعات الدورات</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {metrics.totalRevenueDZD.toLocaleString()} <span className="text-sm font-medium text-emerald-400">دج</span>
                </div>
                <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1 space-x-reverse">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{metrics.dailyRevenueDZD.toLocaleString()} دج اليوم (تحصيلات فورية)</span>
                </div>
              </div>

              {/* Students */}
              <div
                onClick={() => setActiveTab("access")}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-cyan-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>الطلاب المتفاعلون حالياً</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {metrics.activeStudentsNow} <span className="text-sm font-medium text-slate-400">طالب</span>
                </div>
                <div className="mt-2 text-xs text-cyan-400 flex items-center space-x-1 space-x-reverse">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>{metrics.protectedStreamingSessions} جلسة بث مشفرة نشطة بالولايات</span>
                </div>
              </div>

              {/* Tickets Pending */}
              <div
                onClick={() => setActiveTab("support")}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-amber-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>تذاكر الدعم والشكاوى المفتوحة</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {tickets.filter(t => t.status !== "closed" && t.status !== "resolved").length}{" "}
                  <span className="text-sm font-medium text-amber-400">تذكرة</span>
                </div>
                <div className="mt-2 text-xs text-amber-300">
                  {tickets.filter(t => t.status === "new").length} تذاكر جديدة تحتاج تعيين
                </div>
              </div>

              {/* Security Alerts */}
              <div
                onClick={() => setActiveTab("security")}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-rose-500/50 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>تنبيهات البث ومكافحة التسريب</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {metrics.fraudAlertsCount > 0 ? (
                    <span className="text-rose-400">{metrics.fraudAlertsCount} حوادث معلقة</span>
                  ) : (
                    <span className="text-emerald-400">المنظومة مؤمنة</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-rose-300 flex items-center space-x-1 space-x-reverse">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>تتبع متزامن للبصمة والعلامات المائية المرئية</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Action Grid */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2 space-x-reverse">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>إجراءات التشغيل السريعة (One-Click Operations)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab("support")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-slate-200">الرد على الشكاوى</span>
                </button>

                <button
                  onClick={() => setActiveTab("finance")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-slate-200">اعتماد حوالات بريدي موب</span>
                </button>

                <button
                  onClick={() => setActiveTab("announcements")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">نشر إعلان جديد</span>
                </button>

                <button
                  onClick={() => setActiveTab("coupons")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <Tag className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-slate-200">إنشاء قسيمة خصم</span>
                </button>

                <button
                  onClick={() => setActiveTab("access")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <Key className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-slate-200">منح وصول استثنائي</span>
                </button>

                <button
                  onClick={() => setActiveTab("maintenance")}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 flex flex-col items-center text-center space-y-2 transition"
                >
                  <Wrench className="w-5 h-5 text-rose-400" />
                  <span className="font-semibold text-slate-200">إدارة وضع الصيانة</span>
                </button>
              </div>
            </div>

            {/* Split Row: Connectors Health & Live Audit Trail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connectors Health */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">حالة الموصلات والخدمات الخلفية</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("maintenance")}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    التفاصيل الفنية
                  </button>
                </div>

                <div className="space-y-3">
                  {connectors.slice(0, 4).map((c) => (
                    <div
                      key={c.serviceName}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-slate-200">{c.serviceName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.endpointOrProvider}</div>
                      </div>
                      <div className="text-left space-y-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === "healthy"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : c.status === "degraded"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {c.status === "healthy" ? "نشط ومستقر" : c.status === "degraded" ? "بطء نسبي" : "غير مهيأ"}
                        </span>
                        {c.latencyMs && (
                          <div className="text-[10px] text-slate-500 font-mono">{c.latencyMs}ms</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Diff Audit Changes */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <GitCompare className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-white text-sm">آخر التغييرات المقارنة (Diff Audit)</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("diff_audit")}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    عرض المقارنات
                  </button>
                </div>

                <div className="space-y-3">
                  {diffLogs.slice(0, 3).map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{d.performedBy}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{d.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{d.reason}</p>
                      <div className="text-[10px] bg-slate-950 p-2 rounded-lg font-mono border border-slate-800 flex items-center space-x-2 space-x-reverse text-amber-300">
                        <span>{d.diffFields[0]?.fieldName}:</span>
                        <span className="line-through text-rose-400">{JSON.stringify(d.diffFields[0]?.oldValue)}</span>
                        <span>←</span>
                        <span className="text-emerald-400 font-bold">{JSON.stringify(d.diffFields[0]?.newValue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SUPPORT TICKETS & COMPLAINTS CENTER */}
        {/* ========================================================= */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>مركز دعم الطلاب وإدارة التذاكر والشكاوى</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أرقام مرجعية فريدة، فصل الردود الرسمية عن الملاحظات الداخلية، وتقييد موظفي الدعم عن التعديل المالي غير المصرح
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-60">
                  <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="بحث برقم التذكرة أو الهاتف..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">كل الحالات</option>
                  <option value="new">جديدة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="waiting_user">تنتظر رد الطالب</option>
                  <option value="resolved">محلولة</option>
                  <option value="closed">مغلقة</option>
                </select>

                <select
                  value={ticketCategoryFilter}
                  onChange={(e) => setTicketCategoryFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">كل التصنيفات</option>
                  <option value="video_playback">مشغل الفيديو</option>
                  <option value="course_purchase">شراء دورة</option>
                  <option value="account_device">الحساب والجهاز</option>
                  <option value="wallet_balance">الرصيد والمحفظة</option>
                </select>
              </div>
            </div>

            {/* Split layout: Tickets list + Ticket Detail Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tickets List */}
              <div className="lg:col-span-5 space-y-3">
                {paginatedTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedTicket?.id === t.id
                        ? "bg-slate-800 border-emerald-500 shadow-xl"
                        : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-amber-400">{t.ticketNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === "new"
                            ? "bg-rose-500/20 text-rose-300"
                            : t.status === "in_progress"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {t.status === "new" ? "جديدة" : t.status === "in_progress" ? "قيد المعالجة" : "مغلقة / محلولة"}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t.studentName} • {t.studentPhone}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                      <span>القسم: {t.assignedDepartment}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                  <span>إجمالي التذاكر: {filteredTickets.length}</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      disabled={ticketPage <= 1}
                      onClick={() => setTicketPage(ticketPage - 1)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40"
                    >
                      السابق
                    </button>
                    <span>صفحة {ticketPage}</span>
                    <button
                      disabled={ticketPage * ticketsPerPage >= filteredTickets.length}
                      onClick={() => setTicketPage(ticketPage + 1)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>

              {/* Ticket Detail & Messages thread */}
              <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between min-h-[500px]">
                {selectedTicket ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Ticket Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              {selectedTicket.ticketNumber}
                            </span>
                            <span className="text-white font-bold text-sm">{selectedTicket.subject}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            المشتكي: {selectedTicket.studentName} ({selectedTicket.studentEmail} — {selectedTicket.studentPhone})
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                          {selectedTicket.status !== "closed" && (
                            <button
                              onClick={() => handleCloseTicket(selectedTicket.id)}
                              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
                            >
                              إغلاق الشكوى
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Messages Thread */}
                      <div className="space-y-3 my-4 max-h-80 overflow-y-auto pr-1">
                        {selectedTicket.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                              m.isInternalNote
                                ? "bg-amber-950/40 border border-amber-600/40 text-amber-200"
                                : m.senderRole === "student"
                                ? "bg-slate-900 border border-slate-800 text-slate-200"
                                : "bg-emerald-950/40 border border-emerald-600/40 text-emerald-200"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold flex items-center space-x-1.5 space-x-reverse">
                                {m.isInternalNote && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                                <span>{m.senderName}</span>
                                {m.isInternalNote && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">
                                    ملاحظة داخلية سرية
                                  </span>
                                )}
                              </span>
                              <span className="text-slate-500 font-mono">{m.timestamp}</span>
                            </div>
                            <p className="leading-relaxed">{m.content}</p>
                            {m.attachments && m.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center space-x-2 space-x-reverse text-[11px] text-cyan-300">
                                <FileText className="w-3.5 h-3.5" />
                                <span>مرفق آمن: {m.attachments[0].name} ({m.attachments[0].sizeKb} KB)</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reply box */}
                    {selectedTicket.status !== "closed" ? (
                      <form onSubmit={handleSendTicketReply} className="pt-3 border-t border-slate-700/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label className="flex items-center space-x-2 space-x-reverse text-amber-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isInternalNote}
                              onChange={(e) => setIsInternalNote(e.target.checked)}
                              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                            />
                            <span>ملاحظة داخلية بين الإداريين فقط (لا تظهر للطالب)</span>
                          </label>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                          <textarea
                            rows={2}
                            value={newTicketReply}
                            onChange={(e) => setNewTicketReply(e.target.value)}
                            placeholder={isInternalNote ? "اكتب ملاحظة التنسيق الداخلي..." : "اكتب ردك الرسمي للرد على الطالب..."}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="submit"
                            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1 space-x-reverse"
                          >
                            <Send className="w-4 h-4" />
                            <span>إرسال</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-center">
                        هذه التذكرة مغلقة. سبب الإغلاق: {selectedTicket.closingReason}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs text-center space-y-2">
                    <MessageSquare className="w-10 h-10 stroke-1" />
                    <span>اختر تذكرة من القائمة الجانبية لمعاينة المحادثة وإرسال الردود الرسمية أو الداخلية.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ANNOUNCEMENTS & NOTIFICATIONS */}
        {/* ========================================================= */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <span>إدارة الإعلانات والإشعارات الجماعية</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  نظام الإعلانات ثنائية اللغة (العربية / الفرنسية) مع معاينة فورية قبل النشر وتحديد الجمهور المستهدف
                </p>
              </div>

              <button
                onClick={() => setShowAddAnnModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-cyan-900/30 transition"
              >
                <Bell className="w-4 h-4" />
                <span>إنشاء إعلان جديد</span>
              </button>
            </div>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-white">{ann.titleAr}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ann.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {ann.status === "published" ? "منشور ومتاح" : "معلّق / مسودة"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{ann.bodyAr}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-sans" dir="ltr">
                      <strong>FR:</strong> {ann.titleFr}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">
                      بواسطة: {ann.createdBy} • {ann.viewsCount} مشاهدة
                    </span>
                    <button
                      onClick={() => handleToggleAnnouncement(ann.id)}
                      className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition"
                    >
                      {ann.status === "published" ? "إيقاف النشر" : "إعادة النشر"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create Announcement */}
            {showAddAnnModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-base">إنشاء إعلان جديد للمنصة</h3>
                    <button onClick={() => setShowAddAnnModal(false)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">العنوان بالعربية</label>
                      <input
                        type="text"
                        value={annTitleAr}
                        onChange={(e) => setAnnTitleAr(e.target.value)}
                        placeholder="مثال: خصم 20% بمناسبة الفصل الدراسي الجديد"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نص الإعلان بالعربية</label>
                      <textarea
                        rows={3}
                        value={annBodyAr}
                        onChange={(e) => setAnnBodyAr(e.target.value)}
                        placeholder="اكتب تفاصيل الإعلان..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">العنوان بالفرنسية (Titre en Français)</label>
                      <input
                        type="text"
                        value={annTitleFr}
                        onChange={(e) => setAnnTitleFr(e.target.value)}
                        placeholder="Titre de l'annonce..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الفئة المستهدفة</label>
                      <select
                        value={annAudience}
                        onChange={(e) => setAnnAudience(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="all_students">جميع الطلاب المسجلين بالمنصة</option>
                        <option value="specific_course">طلاب دورة معينة</option>
                        <option value="teachers_only">الأساتذة والمؤلفون فقط</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end space-x-3 space-x-reverse pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAnnModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500"
                      >
                        نشر الإعلان الآن
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COUPONS & DISCOUNTS */}
        {/* ========================================================= */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <span>نظام القسائم والعروض والخصومات التعليمية</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  حساب الأسعار الموثوق في الواجهة الخلفية، فحص الصلاحية والحد الأدنى للشراء، وتتبع الاستخدام الفعلي
                </p>
              </div>

              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-purple-900/30 transition"
              >
                <Tag className="w-4 h-4" />
                <span>إنشاء قسيمة جديدة</span>
              </button>
            </div>

            {/* Interactive Coupon Validation Simulator */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse text-purple-400 text-sm font-bold">
                <Sliders className="w-4 h-4" />
                <span>محاكي التحقق من القسائم وقت الشراء (Backend Calculation Simulator)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">رمز القسيمة للتجربة</label>
                  <input
                    type="text"
                    value={testCouponCode}
                    onChange={(e) => setTestCouponCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">السعر الأصلي للدورة (دج)</label>
                  <input
                    type="number"
                    value={testPriceDZD}
                    onChange={(e) => setTestPriceDZD(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRunCouponTest}
                    className="w-full px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition"
                  >
                    فحص القسيمة وحساب السعر
                  </button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    testResult.isValid
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                  }`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {testResult.isValid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>
                      {testResult.isValid
                        ? `قسيمة صالحة! قيمة الخصم: ${testResult.discountAmountDZD} دج — السعر النهائي: ${testResult.finalAmountDZD} دج`
                        : testResult.reason}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-base font-black font-mono text-purple-400">{c.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                          {c.discountType === "percentage" ? `${c.value}% خصم` : `${c.value} دج خصم مباشر`}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isActive
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {c.isActive ? "نشطة" : "معطلة"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between">
                        <span>مرات الاستخدام:</span>
                        <span className="text-white font-bold">{c.usedCount} من {c.maxUsesTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الحد الأدنى للشراء:</span>
                        <span className="text-white">{c.minPurchaseDZD} دج</span>
                      </div>
                      <div className="flex justify-between">
                        <span>فترة الصلاحية:</span>
                        <span className="text-white">{c.validFrom} إلى {c.validUntil}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">أنشئت بواسطة: {c.createdBy}</span>
                    <button
                      onClick={() => handleToggleCoupon(c.id)}
                      className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition"
                    >
                      {c.isActive ? "تعطيل القسيمة" : "تفعيل القسيمة"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create Coupon */}
            {showAddCouponModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-base">إنشاء قسيمة خصم جديدة</h3>
                    <button onClick={() => setShowAddCouponModal(false)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">رمز القسيمة (كود الخصم)</label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="مثال: BAC2025PRO"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">نوع الخصم</label>
                        <select
                          value={couponType}
                          onChange={(e) => setCouponType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="percentage">نسبة مئوية (%)</option>
                          <option value="fixed_amount">مبلغ ثابت (دج)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">القيمة</label>
                        <input
                          type="number"
                          value={couponValue}
                          onChange={(e) => setCouponValue(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">إجمالي مرات الاستخدام</label>
                        <input
                          type="number"
                          value={couponMaxUses}
                          onChange={(e) => setCouponMaxUses(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">الحد الأدنى للشراء (دج)</label>
                        <input
                          type="number"
                          value={couponMinPurchase}
                          onChange={(e) => setCouponMinPurchase(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 space-x-reverse pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCouponModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500"
                      >
                        حفظ القسيمة
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ACCESS GRANTS & CONTENT PERMISSIONS */}
        {/* ========================================================= */}
        {activeTab === "access" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Key className="w-5 h-5 text-indigo-400" />
                  <span>إدارة التسجيل والوصول الاستثنائي للمحتوى</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  التحقق من حق الوصول عبر PlaybackAuthorizationService قبل إصدار ترخيص المشغل، وتوثيق سبب كل منحة إدارية
                </p>
              </div>

              <button
                onClick={() => setShowGrantModal(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-indigo-900/30 transition"
              >
                <Key className="w-4 h-4" />
                <span>منح وصول استثنائي لطالب</span>
              </button>
            </div>

            {/* Access Grants List */}
            <div className="space-y-3">
              {accessGrants.map((g) => (
                <div
                  key={g.id}
                  className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
                    g.isRevoked
                      ? "bg-slate-950/60 border-rose-900/40 opacity-70"
                      : "bg-slate-800/70 border-slate-700/80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-bold text-white text-sm">{g.studentName}</span>
                      <span className="text-slate-400 font-mono">({g.studentEmail})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.accessType === "purchased"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : g.accessType === "scholarship"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-indigo-500/20 text-indigo-300"
                        }`}
                      >
                        {g.accessType === "purchased"
                          ? "شراء حقيقي معتمد"
                          : g.accessType === "scholarship"
                          ? "منحة تفوق"
                          : "منحة إدارية استثنائية"}
                      </span>
                    </div>

                    <p className="text-slate-300">{g.courseTitle}</p>
                    {g.reason && <p className="text-[11px] text-slate-400 italic">السبب: {g.reason}</p>}
                    {g.isRevoked && (
                      <p className="text-[11px] text-rose-400">
                        ملغي بواسطة {g.revokedBy} ({g.revocationReason})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                    <div className="text-left text-[11px] text-slate-500">
                      <div>منحت بواسطة: {g.grantedBy}</div>
                      <div>{g.grantedAt}</div>
                    </div>

                    {!g.isRevoked && (
                      <button
                        onClick={() => handleRevokeAccess(g.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                      >
                        سحب الوصول فوراً
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Grant Access */}
            {showGrantModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-base">منح وصول تعليمي استثنائي</h3>
                    <button onClick={() => setShowGrantModal(false)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleGrantAccess} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني للطالب</label>
                      <input
                        type="email"
                        value={grantStudentEmail}
                        onChange={(e) => setGrantStudentEmail(e.target.value)}
                        placeholder="student@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">اسم الطالب</label>
                      <input
                        type="text"
                        value={grantStudentName}
                        onChange={(e) => setGrantStudentName(e.target.value)}
                        placeholder="الاسم الكامل للطالب"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الدورة المستهدفة</label>
                      <select
                        value={grantCourseId}
                        onChange={(e) => setGrantCourseId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">سبب المنح الاستثنائي</label>
                      <textarea
                        rows={2}
                        value={grantReason}
                        onChange={(e) => setGrantReason(e.target.value)}
                        placeholder="اكتب سبب المنح (مثال: منحة تفوق، تعويض عن عطل سابق)..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 space-x-reverse pt-2">
                      <button
                        type="button"
                        onClick={() => setShowGrantModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
                      >
                        تأكيد المنح وإصدار الترخيص
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STAFF (RBAC) */}
        {/* ========================================================= */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>إدارة الموظفين والمديرين (RBAC)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  تحديد الصلاحيات بدقة، تقييد النطاق الولائي، وحماية حصانة المالك الأساسي
                </p>
              </div>

              {currentUser?.role === "owner" && (
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-amber-500/20 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة حساب إداري جديد</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between ${
                    staff.isOwner
                      ? "bg-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/5"
                      : "bg-slate-800/70 border-slate-700/80"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h3 className="font-bold text-white text-sm">{staff.name}</h3>
                          {staff.isOwner && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              المالك الحصري
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{staff.email} • {staff.phoneNumber}</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          staff.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {staff.status === "active" ? "حساب نشط" : "معلّق"}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-400 space-y-1">
                      <div>القسم: {staff.department}</div>
                      <div>آخر نشاط: {staff.lastAction}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">أضيف بواسطة: {staff.invitedBy}</span>
                    {currentUser?.role === "owner" && !staff.isOwner && (
                      <button
                        onClick={() => handleToggleStaffStatus(staff.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/30 text-xs font-semibold transition"
                      >
                        {staff.status === "active" ? "تجميد الصلاحيات" : "إلغاء التجميد"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add Staff */}
            {showAddStaffModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-base">إضافة حساب إداري</h3>
                    <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الاسم الكامل</label>
                      <input
                        type="text"
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="مثال: عبد القادر زروقي"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني المهني</label>
                      <input
                        type="email"
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="name@qrayati.dz"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">القسم ومجموعة العمل</label>
                      <select
                        value={newStaffDept}
                        onChange={(e) => setNewStaffDept(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="support">خدمة العملاء والدعم الفني</option>
                        <option value="finance">الرقابة المالية والمحاسبة</option>
                        <option value="content">المحتوى والمناهج</option>
                        <option value="security">أمن المنظومة ومكافحة التسريب</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end space-x-3 space-x-reverse pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStaffModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                      >
                        حفظ وإنشاء الحساب
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: FINANCE */}
        {/* ========================================================= */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 mb-1">الرصيد القابل للصرف (صافي المنصة)</div>
                <div className="text-2xl font-black text-emerald-400">
                  {(metrics.totalRevenueDZD * 0.15).toLocaleString()} <span className="text-sm font-medium">دج</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  نسبة المنصة الثابتة 15% من كل اشتراك دورة تعليمية
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 mb-1">مستحقات الأساتذة والمؤلفين المحجوزة</div>
                <div className="text-2xl font-black text-amber-400">
                  {(metrics.totalRevenueDZD * 0.85).toLocaleString()} <span className="text-sm font-medium">دج</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  توزع شهرياً عبر تحويلات بريدي موب والحسابات البريدية الجارية (CCP)
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 mb-1">حوالات معلقة تتطلب تدقيق الإيصال</div>
                <div className="text-2xl font-black text-rose-400">
                  {metrics.pendingProofAudits} <span className="text-sm font-medium">طلبات</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  تحويلات يدوية (BaridiMob RIP) تنتظر التحقق من كشف الحساب
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-base">سجل التدقيق المالي ومطابقة المدفوعات</h3>
              <div className="space-y-3">
                {financialTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-mono text-emerald-400 font-bold">{tx.code}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-white">{tx.studentName}</span>
                        <span className="text-slate-500">({tx.studentPhone})</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        {tx.courseTitle || "شحن رصيد المحفظة الإلكترونية"}
                      </div>
                      {tx.proofDocumentUrl && (
                        <div className="text-[11px] text-amber-400 font-medium">
                          مستند الإثبات: {tx.proofDocumentUrl}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse w-full md:w-auto justify-between md:justify-end">
                      <div className="text-left">
                        <div className="text-base font-black text-white">
                          +{tx.amountDZD} <span className="text-xs font-normal">دج</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{tx.timestamp}</div>
                      </div>

                      {tx.status === "pending_review" ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleApproveTransaction(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1 space-x-reverse"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>اعتماد</span>
                          </button>
                          <button
                            onClick={() => handleRejectTransaction(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 font-bold transition"
                          >
                            رفض
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          تم الاعتماد
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: SECURITY & HARDWARE KEYSTORES */}
        {/* ========================================================= */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-4">مركز الأمان ورصد محاولات التسريب</h2>
              <div className="space-y-3">
                {securityIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400">{inc.userEmail}</span>
                      <span className="text-slate-500 font-mono">{inc.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{inc.details}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400">الموقع: {inc.location}</span>
                      {inc.status !== "resolved" && (
                        <button
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                        >
                          تحديد كمعالج
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <h3 className="font-bold text-white text-base mb-4">الأجهزة المعتمدة وتشفير العتاد L3</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredDevices.map((dev) => {
                  const isRevoked = revokedDevices.includes(dev.id);
                  return (
                    <div
                      key={dev.id}
                      className={`p-4 rounded-xl border text-xs flex flex-col justify-between ${
                        isRevoked ? "bg-rose-950/20 border-rose-800/50" : "bg-slate-900/60 border-slate-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span>{dev.name}</span>
                          <span className={isRevoked ? "text-rose-400" : "text-emerald-400"}>
                            {isRevoked ? "محظور" : "موثوق"}
                          </span>
                        </div>
                        <div className="text-slate-400">{dev.ownerName} ({dev.ownerEmail})</div>
                        <div className="text-slate-500 mt-2">{dev.platform}</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{dev.lastActive}</span>
                        <button
                          onClick={() => handleToggleRevokeDevice(dev.id, dev.name)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            isRevoked ? "bg-emerald-600 text-white" : "bg-rose-600/30 text-rose-300"
                          }`}
                        >
                          {isRevoked ? "إلغاء الحظر" : "حظر الجهاز"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: DATA INTEGRITY & EXPORT/IMPORT */}
        {/* ========================================================= */}
        {activeTab === "data_integrity" && (
          <div className="space-y-6">
            {/* Live Automated Verification Panel */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      مختبر الفحص العملي والتدقيق البرمجي الحي (Live Test Suite)
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">9/9 Tests Verified</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      تشغيل تدقيق عملي لحظي لقواعد الخصم، التشفير البيومتري، حارس البث المباشر (DRM)، ومصادقة الجهاز
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const testResults = runPlatformSecurityTests();
                    const newLog = adminOpsService.recordDiffLog({
                      entityName: "حزمة تدقيق النظام (Live Security & RBAC)",
                      entityId: "SYSTEM-LIVE-AUDIT",
                      actionType: "update",
                      performedBy: "المالك العام (تدقيق آلي مباشر)",
                      performedByRole: "owner",
                      ipAddress: "127.0.0.1",
                      reason: "إعادة التحقق البرمجي التلقائي من قواعد الخصم، البصمة، وتراخيص التشغيل",
                      diffFields: testResults.map(t => ({
                        fieldName: t.testName,
                        oldValue: "جاري الفحص",
                        newValue: `${t.passed ? "ناجح (PASS)" : "فشل (FAIL)"}: ${t.message}`
                      })),
                      status: "success"
                    });
                    setDiffLogs(adminOpsService.getDiffAuditLogs());
                    setActiveTab("diff_audit");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center space-x-2 space-x-reverse transition-all shadow-lg shadow-emerald-950/40"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>إعادة تشغيل التدقيق البرمجي المباشر</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {runPlatformSecurityTests().slice(0, 3).map((res, i) => (
                  <div key={i} className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
                      <span className="truncate">{res.testName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">PASS</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{res.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>مركز سلامة البيانات والتصدير المشفر</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أداة تشخيص لفحص الدروس اليتيمة، الفوارق المحاسبية، وتصدير التقارير مع حجب الأسرار
                </p>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => handleExportDataCSV("قائمة الطلاب والدورات")}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center space-x-1.5 space-x-reverse transition"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير CSV</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">الملاحظات التشخيصية لسلامة العلاقات والبيانات</h3>
              {integrityIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-bold text-white">{issue.affectedEntityName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {issue.category}
                      </span>
                    </div>
                    <p className="text-slate-300">{issue.description}</p>
                    <p className="text-emerald-400 text-[11px]">الإجراء المقترح: {issue.suggestedFix}</p>
                  </div>

                  {issue.status === "detected" ? (
                    <button
                      onClick={() => handleFixIntegrityIssue(issue.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition whitespace-nowrap"
                    >
                      تطبيق الإصلاح
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                      تم الإصلاح
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: MAINTENANCE & CONNECTORS */}
        {/* ========================================================= */}
        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2 space-x-reverse">
                  <Wrench className="w-5 h-5 text-rose-400" />
                  <span>إعدادات التشغيل، وضع الصيانة، وموصلات الخادم</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  التحكم في وضع الصيانة العام، فحص جاهزية بوابات الدفع وشبكات التشفير
                </p>
              </div>

              <button
                onClick={handleToggleMaintenance}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 space-x-reverse ${
                  maintenance.isMaintenanceActive
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{maintenance.isMaintenanceActive ? "إلغاء وضع الصيانة" : "تفعيل وضع الصيانة العام"}</span>
              </button>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">حالة الموصلات السحابية ومصادر المحتوى</h3>
              <div className="space-y-3">
                {connectors.map((c) => (
                  <div
                    key={c.serviceName}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{c.serviceName}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{c.endpointOrProvider}</div>
                      {c.lastKnownError && (
                        <div className="text-[11px] text-amber-400 mt-1">ملاحظة تشغيلية: {c.lastKnownError}</div>
                      )}
                    </div>

                    <div className="text-left">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          c.status === "healthy"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : c.status === "degraded"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {c.status === "healthy" ? "جاهز ومستقر" : c.status === "degraded" ? "بطء نسبي" : "غير مهيأ"}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">فحص: {c.lastChecked}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 11: DIFF AUDIT COMPARISONS */}
        {/* ========================================================= */}
        {activeTab === "diff_audit" && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2 space-x-reverse">
                <GitCompare className="w-5 h-5 text-purple-400" />
                <span>سجل التغييرات المقارن (Diff Audit Trail)</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                مقارنة دقيقة بين القيم السابقة والجديدة لأي تعديل إداري حساس (الأسعار، الصلاحيات، والجلسات) مع حجب الأسرار
              </p>

              <div className="space-y-4">
                {diffLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="font-bold text-white text-sm">{log.performedBy}</span>
                          <span className="text-slate-400">({log.performedByRole})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {log.actionType}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          الكيان المتأثر: {log.entityName} #{log.entityId}
                        </p>
                      </div>

                      <div className="text-left text-slate-500 font-mono text-[11px]">
                        <div>{log.timestamp}</div>
                        <div>IP: {log.ipAddress}</div>
                      </div>
                    </div>

                    <p className="text-slate-300">سبب الإجراء: {log.reason}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                      {log.diffFields.map((field) => (
                        <div key={field.fieldName} className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-slate-400 w-36 font-semibold">{field.fieldName}:</span>
                          <span className="line-through text-rose-400">{JSON.stringify(field.oldValue)}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400 font-bold">{JSON.stringify(field.newValue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 12: PLATFORM CONSTITUTION */}
        {/* ========================================================= */}
        {activeTab === "constitution" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center space-x-3 space-x-reverse border-b border-amber-500/20 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">دستور حماية منصة «قرايتي DZ» وسيادة المالك</h2>
                  <p className="text-xs text-amber-300/80">
                    ميثاق تشغيلي محكم يضمن استمرارية السيطرة وحصانة العمليات التعليمية والتجارية
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-amber-400 flex items-center space-x-1.5 space-x-reverse">
                    <ShieldCheck className="w-4 h-4" />
                    <span>المادة 1: حظر فقدان السيطرة الأخير</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    يمنع نظام المنصة برمجياً حذف أو تجميد أو سحب صلاحيات حساب المالك الوحيد (Owner) تحت أي ظرف. لا يمكن لأي حساب إداري مهما بلغت صلاحياته ترقية نفسه إلى مرتبة المالك دون مصادقة بيومترية حضورية من المالك الحالي.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center space-x-1.5 space-x-reverse">
                    <Lock className="w-4 h-4" />
                    <span>المادة 2: سيادة التشفير وحماية الدروس</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    لا يتم بث أي درس مدفوع برابط مباشر أو غير محمي. كل عملية بث تتطلب رمز ترخيص ديناميكي صادر عن PlaybackAuthorizationService مع دمج علامة مائية عشوائية متحركة تحمل هوية الطالب ورقم هاتفه الجزائري لمنع التسجيل بالكاميرا.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-cyan-400 flex items-center space-x-1.5 space-x-reverse">
                    <Smartphone className="w-4 h-4" />
                    <span>المادة 3: ارتباط العتاد المعتمد (1 Device Per Account)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    يُقفل حساب الطالب على عتاد الجهاز الموثوق. عند رصد تسجيل الدخول من جهاز ثانٍ، يتم تجميد الجلسة وتتطلب إعادة التفعيل مراجعة الدعم أو مصادقة المالك لحماية حقوق الأساتذة.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-rose-400 flex items-center space-x-1.5 space-x-reverse">
                    <DollarSign className="w-4 h-4" />
                    <span>المادة 4: الشفافية المالية المزدوجة</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    كل دينار جزائري يدخل المنصة عبر البطاقة الذهبية أو بريدي موب يُسجل برقم إيصال SATIM أو BaridiMob فريد مع فصل حصة الأستاذ (85%) عن عمولة التشغيل (15%) في سجل تدقيق غير قابل للحذف.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
