// Comprehensive types for Qrayati DZ platform

export type AcademicLevel = 
  | "primary"        // التعليم الابتدائي
  | "middle"         // التعليم المتوسط (BEM)
  | "secondary"      // التعليم الثانوي (بكالوريا)
  | "university"     // التعليم الجامعي والمهني
  | "general";       // مهارات وتطوير مهني

export type UserRole = "student" | "client" | "admin" | "owner";

export interface DeviceBinding {
  deviceId: string;
  deviceName: string;
  platform: string;
  registeredAt: string;
  lastActive: string;
  isCurrent: boolean;
  isTrusted: boolean;
  ipAddress?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  userEmail: string;
  userRole: UserRole;
  deviceId: string;
  status: "success" | "denied" | "flagged";
  details?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;          // e.g. "أستاذ مادة العلوم الفيزيائية - ثانوية العقيد لطفي"
  bio: string;            // نبذة تعريفية مهنية موجزة
  avatarUrl: string;
  wilaya: string;         // e.g. "الجزائر العاصمة", "وهران", "سطيف", "قسنطينة"
  specialty: string;      // التخصص
  experienceYears: number;
  courseCount?: number;   // عدد الدورات المنشورة له
}

export interface SubjectModel {
  id: string;
  name: string;           // e.g. "الرياضيات", "العلوم الفيزيائية", "علوم الطبيعة والحياة", "اللغة الفرنسية"
  code: string;
  level: AcademicLevel;
  iconName: string;       // lucide icon identifier
  colorHex: string;
  description: string;
}

export interface Attachment {
  id: string;
  title: string;
  type: "pdf" | "summary" | "exam_paper" | "solution" | "slides";
  size: string;
  fileUrl: string;
  isLocked?: boolean;
}

export type PlaybackSourceType = 
  | "direct_hls" 
  | "signed_mp4" 
  | "hls_stream" 
  | "encrypted_drm";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;       // e.g. "24 دقيقة"
  contentType: "video" | "text" | "quiz";
  videoUrl?: string;
  textContent?: string;
  isPreview?: boolean;    // درس معاينة مجاني قبل الشراء
  attachments?: Attachment[];
  sourceType?: PlaybackSourceType;
  drmRequired?: boolean;
  licenseServerUrl?: string;
}

export interface CourseSection {
  id: string;
  title: string;          // e.g. "الوحدة الأولى: المتابعة الزمنية لتحول كيميائي"
  order: number;
  lessons: LessonItem[];
}

export interface CourseModel {
  id: string;
  title: string;
  description: string;
  price: number;          // بالدينار الجزائري DZD
  oldPrice?: number;      // للسعر الترويجي / الخصم
  cover: string;
  duration: string;
  instructors: string[];  // أسماء الأساتذة المنسوب إليهم العمل
  teacherIds: string[];   // معرفات الأساتذة
  subjectId: string;      // معرف المادة التعليمية
  subjectName: string;    // اسم المادة
  academicLevel: AcademicLevel; // المستوى الدراسي
  levelLabel: string;     // e.g. "3 ثانوي - بكالوريا"
  branch?: string;        // الشعبة: "علوم تجريبية", "رياضيات", "تقني رياضي", "آداب وفلسفة", "تسيير واقتصاد"
  session?: number;       // عدد الحصص/الدروس
  category?: string;      // التصنيف العام
  isBestSeller?: boolean; // الأكثر طلباً
  isFeatured?: boolean;   // دورة مميزة
  isNew?: boolean;        // دورة جديدة
  sections: CourseSection[];
  curriculumOverview?: string[];
  playbackPolicy?: {
    allowBackgroundAudio?: boolean;
    watermarkEnabled?: boolean;
    maxConcurrentStreams?: number;
    requireBiometricStepUp?: boolean;
  };
}

export interface EnrolledCourse {
  courseId: string;
  course: CourseModel;
  enrolledAt: string;
  progress: number;       // 0.0 to 1.0
  lastAccessed: string;
  price: number;          // المبلغ المدفوع بالدينار الجزائري
  completedLessons?: string[];
  purchaseMethod: "wallet" | "baridimob_proof" | "voucher" | "admin_grant";
  receiptId?: string;
}

export interface TransactionRecord {
  id: string;
  type: "deposit" | "purchase" | "voucher_redeem";
  amount: number;         // بالدينار الجزائري
  date: string;
  title: string;
  referenceNumber?: string;
  status: "completed" | "pending" | "rejected";
  paymentMethod: "baridimob" | "voucher" | "cib_dahabia" | "wallet";
}

export interface UserWallet {
  balance: number;        // الرصيد الحالي بالدينار الجزائري DZD
  pendingBalance: number; // العمليات المعلقة للمراجعة
  transactions: TransactionRecord[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "order" | "course_update" | "system" | "wallet";
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;         // رقم الهاتف الجزائري (e.g. 0550 12 34 56)
  wilaya?: string;        // الولاية الجزائرية
  academicLevel?: AcademicLevel;
  branch?: string;        // الشعبة
  photoURL?: string;
  createdAt: string;
  lastLogin: string;
  isAdmin?: boolean;      // صلاحية الإدارة
  role: UserRole;         // "student" | "client" | "admin" | "owner"
  devices?: DeviceBinding[];
  isBiometricEnrolled?: boolean;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  targetCourseId?: string;
  badge: string;
  bgColor: string;
  imageUrl?: string;
}

// Authorization & Playback Token
export interface PlaybackAuthorizationToken {
  authorized: boolean;
  sessionId: string;
  token: string;
  expiresAt: number; // Unix timestamp ms
  lessonId: string;
  courseId: string;
  watermarkContent: {
    userName: string;
    userPhone: string;
    userUid: string;
    deviceFingerprint: string;
    clientIp: string;
    timestamp: string;
  };
  allowedPlaybackUrl: string;
  isSignedUrl: boolean;
  sourceType: PlaybackSourceType;
  drmLicenseGranted: boolean;
  licenseServerUrl?: string;
  denialReason?: string;
}

export interface DownloadOfflineState {
  lessonId: string;
  courseId: string;
  status: "not_downloaded" | "downloading" | "downloaded" | "failed";
  progress: number;
  localPath?: string;
  sizeBytes?: number;
  keyFingerprint?: string;
  expiresAt?: number;
}

// Legacy compatibility for quiz evaluations
export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  name: string;
  time: string;
  timeSeconds: number;
  questionCount: number;
  questionAssetName: string;
  questions: Question[];
}


// ==========================================
// Phase 2: Advanced Staff, RBAC & Financial Control
// ==========================================

export type AdminDepartment = "support" | "finance" | "content" | "security" | "full_access";

export type PermissionKey =
  // Support & Users
  | "view_users"
  | "manage_users"
  | "reset_sessions"
  | "unbind_devices"
  // Content & Courses
  | "view_courses"
  | "edit_courses"
  | "publish_courses"
  | "approve_lessons"
  | "delete_content"
  // Financial
  | "view_finances"
  | "review_transactions"
  | "approve_recharges"
  | "process_refunds"
  | "export_financial_reports"
  // Security & Audit
  | "view_audit_logs"
  | "inspect_biometrics"
  | "manage_staff"
  | "configure_rules";

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: AdminDepartment;
  role: UserRole;
  isOwner: boolean;
  status: "active" | "suspended" | "pending_invite";
  permissions: PermissionKey[];
  isTemporary: boolean;
  expiresAt?: string;
  assignedWilayas?: string[]; // Scoped jurisdiction (or empty for national)
  lastLogin: string;
  lastAction: string;
  createdAt: string;
  invitedBy: string;
  hardwareTokenId?: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: "multiple_failed_biometrics" | "unknown_ip_geoshift" | "simultaneous_device_stream" | "admin_privilege_escalation" | "abnormal_refund_burst";
  severity: "critical" | "high" | "medium" | "low";
  userEmail: string;
  role: UserRole;
  deviceId: string;
  ipAddress: string;
  location: string; // e.g. "سطيف / وهران"
  status: "open" | "investigating" | "resolved" | "quarantined";
  details: string;
  detectedBy: string;
}

export interface FinancialAuditTransaction {
  id: string;
  code: string; // e.g. TX-DZ-8941
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  method: "dahabia" | "cib" | "baridimob" | "voucher" | "manual_agent";
  courseTitle?: string;
  type: "course_purchase" | "wallet_recharge" | "refund" | "commission_payout";
  amountDZD: number;
  platformFeeDZD: number;
  teacherShareDZD: number;
  teacherName?: string;
  status: "approved" | "pending_review" | "rejected" | "flagged_fraud";
  proofDocumentUrl?: string;
  receiptNumber?: string;
  timestamp: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface LiveEcosystemMetrics {
  totalRevenueDZD: number;
  dailyRevenueDZD: number;
  activeStudentsNow: number;
  protectedStreamingSessions: number;
  pendingProofAudits: number;
  hardwareKeystoresActive: number;
  fraudAlertsCount: number;
  platformUptimePercent: number;
}


// ==========================================
// Comprehensive Admin Operations System Types
// ==========================================

export type TicketCategory =
  | "login_issue"
  | "course_purchase"
  | "wallet_balance"
  | "video_playback"
  | "account_device"
  | "technical_bug"
  | "other";

export type TicketStatus = "new" | "in_progress" | "waiting_user" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: "student" | "admin" | "owner" | "system";
  content: string;
  timestamp: string;
  isInternalNote: boolean;
  attachments?: { name: string; sizeKb: number; type: string }[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. TCK-2024-9102
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  category: TicketCategory;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedDepartment: AdminDepartment;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closingReason?: string;
  relatedCourseId?: string;
  relatedTransactionId?: string;
  messages: TicketMessage[];
}

export interface PlatformAnnouncement {
  id: string;
  titleAr: string;
  titleFr: string;
  bodyAr: string;
  bodyFr: string;
  imageUrl?: string;
  targetAudience: "all_students" | "specific_course" | "unregistered" | "teachers_only";
  targetCourseId?: string;
  status: "published" | "draft" | "paused";
  scheduledStart?: string;
  scheduledEnd?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  isMaintenanceAlert?: boolean;
}

export interface DiscountCoupon {
  id: string;
  code: string; // e.g. BAC2025DZ
  discountType: "percentage" | "fixed_amount";
  value: number; // e.g. 20% or 1000 DZD
  maxUsesTotal: number;
  usedCount: number;
  maxUsesPerUser: number;
  minPurchaseDZD: number;
  applicableCourseIds: string[]; // empty array = all courses
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CourseAccessGrant {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  accessType: "purchased" | "administrative_grant" | "scholarship" | "temporary_review";
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string; // undefined = lifetime
  reason?: string;
  isRevoked: boolean;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
}

export interface DiffAuditLog {
  id: string;
  entityName: string; // e.g. "Course", "UserRole", "Coupon", "AccessGrant"
  entityId: string;
  actionType: "create" | "update" | "delete" | "status_change" | "role_escalation" | "financial_override";
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  ipAddress: string;
  reason: string;
  diffFields: {
    fieldName: string;
    oldValue: any;
    newValue: any;
  }[];
  transactionReference?: string;
  status: "success" | "rejected" | "flagged";
}

export interface DataIntegrityIssue {
  id: string;
  severity: "high" | "medium" | "low";
  category: "orphaned_lesson" | "missing_category" | "discrepant_wallet" | "invalid_purchase_relation" | "duplicate_tx";
  description: string;
  affectedEntityId: string;
  affectedEntityName: string;
  detectedAt: string;
  suggestedFix: string;
  status: "detected" | "reviewed" | "fixed";
}

export interface PlatformSystemStatus {
  serviceName: string;
  status: "healthy" | "degraded" | "unconfigured" | "offline";
  isConfigured: boolean;
  latencyMs?: number;
  lastChecked: string;
  lastKnownError?: string;
  endpointOrProvider: string;
}

export interface MaintenanceSettings {
  isMaintenanceActive: boolean;
  bannerMessageAr: string;
  bannerMessageFr: string;
  allowAdminsOnly: boolean;
  estimatedEndTime?: string;
  updatedBy: string;
  updatedAt: string;
}
