import {
  SupportTicket,
  PlatformAnnouncement,
  DiscountCoupon,
  CourseAccessGrant,
  DiffAuditLog,
  DataIntegrityIssue,
  PlatformSystemStatus,
  MaintenanceSettings,
  UserRole,
  AdminStaffMember,
  AdminDepartment,
  PermissionKey
} from "../types";

class AdminOperationsService {
  private static instance: AdminOperationsService;

  // 1. Tickets Repository
  private tickets: SupportTicket[] = [
    {
      id: "tck-01",
      ticketNumber: "TCK-2024-9101",
      studentId: "std-8821",
      studentName: "محمد لمين سعيدي",
      studentEmail: "m.saidi@gmail.com",
      studentPhone: "0554 11 22 33",
      category: "video_playback",
      subject: "ظهور خطأ في فك تشفير ترخيص الفيديو عبر شبكة 4G",
      priority: "high",
      status: "in_progress",
      assignedStaffId: "staff-03",
      assignedStaffName: "ياسين بن عودة",
      assignedDepartment: "support",
      createdAt: "2024-10-09 10:15",
      updatedAt: "2024-10-09 11:20",
      relatedCourseId: "c-bac-physics-01",
      messages: [
        {
          id: "msg-1",
          senderName: "محمد لمين سعيدي",
          senderRole: "student",
          content: "السلام عليكم، عند تشغيل درس حركة الكواكب في ولاية سطيف يظهر خطأ 403 Token Expired في مشغل الفيديو رغم أنني مسجل في الدورة.",
          timestamp: "2024-10-09 10:15",
          isInternalNote: false,
          attachments: [{ name: "screenshot_error_403.jpg", sizeKb: 340, type: "image/jpeg" }]
        },
        {
          id: "msg-2",
          senderName: "ياسين بن عودة (الدعم الفني)",
          senderRole: "admin",
          content: "ملاحظة تدقيق داخلية: فحصت الجلسة في PlaybackAuthorizationService، الطالب أجرى 3 محاولات تجديد توكن في دقيقة واحدة وتم تحديث مفتاح الجلسة.",
          timestamp: "2024-10-09 10:45",
          isInternalNote: true
        },
        {
          id: "msg-3",
          senderName: "ياسين بن عودة (الدعم الفني)",
          senderRole: "admin",
          content: "وعليكم السلام يا محمد، تم إعادة إصدار ترخيص المشغل وتحديث عنوان IP لجهازك المعتمد. يرجى إعادة فتح الدرس الآن.",
          timestamp: "2024-10-09 11:20",
          isInternalNote: false
        }
      ]
    },
    {
      id: "tck-02",
      ticketNumber: "TCK-2024-9102",
      studentId: "std-9012",
      studentName: "سارة بلمهدي",
      studentEmail: "sarah.bel@yahoo.com",
      studentPhone: "0771 90 80 70",
      category: "course_purchase",
      subject: "تأكيد إشعار تحويل بريدي موب BaridiMob",
      priority: "medium",
      status: "new",
      assignedDepartment: "finance",
      createdAt: "2024-10-09 11:00",
      updatedAt: "2024-10-09 11:00",
      relatedTransactionId: "TX-DZ-9942",
      messages: [
        {
          id: "msg-21",
          senderName: "سارة بلمهدي",
          senderRole: "student",
          content: "قمت بتحويل مبلغ 3800 دج لحساب البريد الجاري RIP وأرفقت إيصال بريدي موب، أرجو تفعيل دورة الرياضيات للبكالوريا.",
          timestamp: "2024-10-09 11:00",
          isInternalNote: false,
          attachments: [{ name: "recu_baridimob_3800.pdf", sizeKb: 512, type: "application/pdf" }]
        }
      ]
    },
    {
      id: "tck-03",
      ticketNumber: "TCK-2024-9088",
      studentId: "std-7711",
      studentName: "إسماعيل دراجي",
      studentEmail: "ismail.derradji@gmail.com",
      studentPhone: "0559 33 22 11",
      category: "account_device",
      subject: "استبدال هاتف ذكي تالف وفك ارتباط الجهاز",
      priority: "high",
      status: "resolved",
      assignedStaffId: "staff-03",
      assignedStaffName: "ياسين بن عودة",
      assignedDepartment: "support",
      createdAt: "2024-10-08 14:00",
      updatedAt: "2024-10-08 16:30",
      closedAt: "2024-10-08 16:30",
      closingReason: "تم التحقق من هوية الطالب وربط هاتفه الجديد مع المصادقة البيومترية.",
      messages: [
        {
          id: "msg-31",
          senderName: "إسماعيل دراجي",
          senderRole: "student",
          content: "لقد انكسرت شاشة هاتفي القديم واشتريت هاتف جديد ولا أستطيع الدخول بسبب قفل الجهاز المعتمد.",
          timestamp: "2024-10-08 14:00",
          isInternalNote: false
        },
        {
          id: "msg-32",
          senderName: "ياسين بن عودة",
          senderRole: "admin",
          content: "تم التحقق من بطاقة التعريف الوطنية وفك ارتباط الجهاز القديم Samsung A12 بنجاح.",
          timestamp: "2024-10-08 16:30",
          isInternalNote: false
        }
      ]
    }
  ];

  // 2. Announcements
  private announcements: PlatformAnnouncement[] = [
    {
      id: "ann-01",
      titleAr: "إطلاق التحديث الجديد لمشغل الفيديوهات التعليمية مع دعم التنزيل الآمن",
      titleFr: "Lancement du nouveau lecteur sécurisé avec téléchargement hors-ligne",
      bodyAr: "يسر منصة قرايتي DZ الإعلان عن تشغيل المشغل التعليمي المطور بحماية DRM وعلامات مائية ذكية ضد التسجيل مع استهلاك أقل للبيانات عبر شبكات 4G في الجزائر.",
      bodyFr: "Qrayati DZ lance son lecteur nouvelle génération avec protection DRM et filigrane dynamique optimisé pour la 4G.",
      targetAudience: "all_students",
      status: "published",
      createdBy: "أيمن بلحاج (المالك)",
      createdAt: "2024-10-01",
      updatedAt: "2024-10-01",
      viewsCount: 4210,
      isMaintenanceAlert: false
    },
    {
      id: "ann-02",
      titleAr: "جلسة مباشرة لحل تمارين البكالوريا التجريبية في الرياضيات",
      titleFr: "Session en direct de résolution des sujets BAC Maths",
      bodyAr: "ينظم الأستاذ نور الدين بثاً مباشراً تفاعلياً لطلاب السنة الثالثة ثانوي شعب علمية يوم الجمعة المقبل.",
      bodyFr: "Séance interactive en direct pour les candidats du baccalauréat ce vendredi.",
      targetAudience: "specific_course",
      targetCourseId: "c-bac-math-01",
      status: "published",
      createdBy: "كريم مرواني (مشرف محتوى)",
      createdAt: "2024-10-07",
      updatedAt: "2024-10-07",
      viewsCount: 1850,
      isMaintenanceAlert: false
    }
  ];

  // 3. Discount Coupons
  private coupons: DiscountCoupon[] = [
    {
      id: "coup-01",
      code: "BAC2025DZ",
      discountType: "percentage",
      value: 20, // 20%
      maxUsesTotal: 500,
      usedCount: 142,
      maxUsesPerUser: 1,
      minPurchaseDZD: 3000,
      applicableCourseIds: [],
      validFrom: "2024-09-01",
      validUntil: "2027-06-30",
      isActive: true,
      createdBy: "أيمن بلحاج (المالك)",
      createdAt: "2024-09-01"
    },
    {
      id: "coup-02",
      code: "TAFWAQ1000",
      discountType: "fixed_amount",
      value: 1000, // 1000 DZD
      maxUsesTotal: 100,
      usedCount: 88,
      maxUsesPerUser: 1,
      minPurchaseDZD: 4000,
      applicableCourseIds: ["c-bac-physics-01"],
      validFrom: "2024-10-01",
      validUntil: "2026-12-31",
      isActive: true,
      createdBy: "أيمن بلحاج (المالك)",
      createdAt: "2024-10-01"
    }
  ];

  // 4. Access Grants
  private accessGrants: CourseAccessGrant[] = [
    {
      id: "grant-01",
      studentId: "std-8821",
      studentName: "محمد لمين سعيدي",
      studentEmail: "m.saidi@gmail.com",
      courseId: "c-bac-physics-01",
      courseTitle: "حزمة الفيزياء المتكاملة للبكالوريا",
      accessType: "purchased",
      grantedBy: "بوابة البطاقة الذهبية (SATIM)",
      grantedAt: "2024-10-05 14:12",
      isRevoked: false
    },
    {
      id: "grant-02",
      studentId: "std-5519",
      studentName: "مريم بوعزيز (منحة التفوق المدرسي)",
      studentEmail: "meriem.bouaziz@gmail.com",
      courseId: "c-bac-math-01",
      courseTitle: "دورة الرياضيات الشاملة مع حلول البكالوريات",
      accessType: "scholarship",
      grantedBy: "أيمن بلحاج (المالك)",
      grantedAt: "2024-10-02 09:30",
      reason: "منحة تفوق لتلميذة حاصلة على معدل 18.5 في التعليم الثانوي (ولاية تيزي وزو)",
      isRevoked: false
    },
    {
      id: "grant-03",
      studentId: "std-4412",
      studentName: "رضا قاسي",
      studentEmail: "reda.kassi@yahoo.fr",
      courseId: "c-bac-science-01",
      courseTitle: "علوم الطبيعة والحياة - منهجية الإجابة",
      accessType: "temporary_review",
      grantedBy: "كريم مرواني (مشرف محتوى)",
      grantedAt: "2024-10-01 10:00",
      expiresAt: "2024-10-15 23:59",
      reason: "معاينة تجريبية مؤقتة لمدة أسبوعين قبل التسجيل",
      isRevoked: false
    }
  ];

  // 5. Diff Audit Logs (Deep comparison trail)
  private diffLogs: DiffAuditLog[] = [
    {
      id: "diff-01",
      entityName: "CoursePrice",
      entityId: "c-bac-physics-01",
      actionType: "update",
      performedBy: "أيمن بلحاج (المالك)",
      performedByRole: "owner",
      timestamp: "2024-10-09 09:30",
      ipAddress: "105.101.44.12",
      reason: "تخفيض موسمي بمناسبة الدخول المدرسي الخريفي",
      diffFields: [
        { fieldName: "priceDZD", oldValue: 5500, newValue: 4500 },
        { fieldName: "discountBadge", oldValue: "0%", newValue: "18%" }
      ],
      status: "success"
    },
    {
      id: "diff-02",
      entityName: "AdminStaff",
      entityId: "staff-04",
      actionType: "role_escalation",
      performedBy: "أيمن بلحاج (المالك)",
      performedByRole: "owner",
      timestamp: "2024-10-08 17:10",
      ipAddress: "105.101.44.12",
      reason: "توسيع نطاق الدعم الفني ليشمل ولاية سيدي بلعباس",
      diffFields: [
        { fieldName: "assignedWilayas", oldValue: ["31 - وهران", "13 - تلمسان"], newValue: ["31 - وهران", "13 - تلمسان", "22 - سيدي بلعباس"] }
      ],
      status: "success"
    },
    {
      id: "diff-03",
      entityName: "StudentSession",
      entityId: "std-9912",
      actionType: "status_change",
      performedBy: "نظام المراقبة الآلي (Session Sentinel)",
      performedByRole: "admin",
      timestamp: "2024-10-08 12:45",
      ipAddress: "197.112.54.91",
      reason: "كشف بث متزامن على جهازين غير مصرح بهما في ولايتين مختلفتين",
      diffFields: [
        { fieldName: "sessionStatus", oldValue: "active", newValue: "quarantined" }
      ],
      transactionReference: "INC-2024-8841",
      status: "flagged"
    }
  ];

  // 6. Data Integrity Diagnostics
  private integrityIssues: DataIntegrityIssue[] = [
    {
      id: "int-01",
      severity: "medium",
      category: "orphaned_lesson",
      description: "ملف فيديو مسودة لدرس الفيزياء التجريبية غير مرتبط بأي فهرس رسمي معتمد",
      affectedEntityId: "les-orphan-99",
      affectedEntityName: "فيديو تجريبي: قياس الناقلية الكهربائية",
      detectedAt: "2024-10-09 04:00",
      suggestedFix: "ربط الدرس بالوحدة 1 من مقرر الفيزياء أو نقله إلى الأرشيف",
      status: "detected"
    },
    {
      id: "int-02",
      severity: "low",
      category: "discrepant_wallet",
      description: "فارق 10 دج ناتج عن تقريب ضريبة الطابع البريدي بين إيصال بريدي موب ورصيد المحفظة المسجل",
      affectedEntityId: "usr-wal-4819",
      affectedEntityName: "محفظة الطالب #4819",
      detectedAt: "2024-10-09 04:00",
      suggestedFix: "إجراء تسوية محاسبية تلقائية مع اعتماد إيصال الخزينة الرسمي",
      status: "detected"
    }
  ];

  // 7. System Connectors Status
  private systemConnectors: PlatformSystemStatus[] = [
    {
      serviceName: "بوابة الدفع الإلكتروني بالبطاقة الذهبية (SATIM)",
      status: "healthy",
      isConfigured: true,
      latencyMs: 145,
      lastChecked: "منذ دقيقتين",
      endpointOrProvider: "api.satim.dz/v2/secure-gateway"
    },
    {
      serviceName: "خدمة موثوقية البصمة والتشفير المحلي (Biometric Keystore L3)",
      status: "healthy",
      isConfigured: true,
      latencyMs: 12,
      lastChecked: "الآن",
      endpointOrProvider: "Hardware StrongBox & WebAuthn Platform"
    },
    {
      serviceName: "خادم إصدار تراخيص البث المشفر (DRM & Signed URLs)",
      status: "healthy",
      isConfigured: true,
      latencyMs: 48,
      lastChecked: "منذ 5 دقائق",
      endpointOrProvider: "drm.qrayati.dz / AES-128 Key Exchange"
    },
    {
      serviceName: "قاعدة بيانات الفايربيس (Firestore Realtime)",
      status: "healthy",
      isConfigured: true,
      latencyMs: 65,
      lastChecked: "الآن",
      endpointOrProvider: "europe-west1.firestore.googleapis.com"
    },
    {
      serviceName: "خدمة الإشعارات الفورية للهواتف (FCM Push Service)",
      status: "degraded",
      isConfigured: true,
      latencyMs: 290,
      lastChecked: "منذ 8 دقائق",
      lastKnownError: "تأخر طفيف في تسليم الإشعارات لشبكات الهاتف النقال بالجنوب",
      endpointOrProvider: "fcm.googleapis.com/v1"
    },
    {
      serviceName: "خادم تحويل وتشفير الفيديو الآلي (HLS Transcoding Cluster)",
      status: "unconfigured",
      isConfigured: false,
      lastChecked: "غير مهيأ",
      lastKnownError: "يعتمد التطبيق حالياً على روابط الفيديو المحمية بـ Token مباشر",
      endpointOrProvider: "يتطلب ربط AWS MediaConvert أو خدمة Transcoder مخصصة"
    }
  ];

  // 8. Maintenance Settings
  private maintenanceSettings: MaintenanceSettings = {
    isMaintenanceActive: false,
    bannerMessageAr: "المنصة تعمل بانتظام. جميع الخوادم وبوابات الدفع الإلكتروني نشطة.",
    bannerMessageFr: "La plateforme fonctionne normalement.",
    allowAdminsOnly: false,
    updatedBy: "أيمن بلحاج (المالك)",
    updatedAt: "2024-10-09 08:00"
  };

  private constructor() {}


  // 6. Central Staff & RBAC Identity Directory
  private staffMembers: AdminStaffMember[] = [
    {
      id: "staff-01",
      name: "أيمن بلحاج (المالك والمؤسس)",
      email: "aymen.belhadj@qrayati.dz",
      phoneNumber: "0661 12 34 56",
      department: "full_access",
      role: "owner",
      isOwner: true,
      status: "active",
      permissions: [
        "view_users", "manage_users", "reset_sessions", "unbind_devices",
        "view_courses", "edit_courses", "publish_courses", "approve_lessons", "delete_content",
        "view_finances", "review_transactions", "approve_recharges", "process_refunds", "export_financial_reports",
        "view_audit_logs", "inspect_biometrics", "manage_staff", "configure_rules"
      ],
      isTemporary: false,
      lastLogin: "الآن (جلسة نشطة)",
      lastAction: "إدارة تراخيص البث والتشفير",
      createdAt: "2024-01-01",
      invitedBy: "النظام المؤسس",
      hardwareTokenId: "YUBIKEY-BIO-DZ-001"
    },
    {
      id: "staff-02",
      name: "أمينة بوقرة (مسؤولة العمليات المالية)",
      email: "amina.bouguerra@qrayati.dz",
      phoneNumber: "0550 88 12 43",
      department: "finance",
      role: "admin",
      isOwner: false,
      status: "active",
      permissions: [
        "view_finances", "review_transactions", "approve_recharges", "process_refunds", "export_financial_reports"
      ],
      isTemporary: false,
      lastLogin: "اليوم 10:14",
      lastAction: "اعتماد 12 حوالة بريدي موب وCIB",
      createdAt: "2024-03-15",
      invitedBy: "أيمن بلحاج (المالك)",
      hardwareTokenId: "TOKEN-SEC-FIN-88"
    },
    {
      id: "staff-03",
      name: "كريم مرواني (مشرف محتوى ومناهج)",
      email: "karim.marouani@qrayati.dz",
      phoneNumber: "0770 33 44 55",
      department: "content",
      role: "admin",
      isOwner: false,
      status: "active",
      permissions: ["view_courses", "edit_courses", "publish_courses", "approve_lessons"],
      isTemporary: false,
      lastLogin: "أمس 16:45",
      lastAction: "مراجعة جودة فيديوهات بكالوريا رياضيات",
      createdAt: "2024-04-01",
      invitedBy: "أيمن بلحاج (المالك)"
    },
    {
      id: "staff-04",
      name: "ياسين بن عودة (دعم فني مؤقت - ولايات الغرب)",
      email: "yacine.benouda@qrayati.dz",
      phoneNumber: "0662 99 88 77",
      department: "support",
      role: "admin",
      isOwner: false,
      status: "active",
      permissions: ["view_users", "reset_sessions", "unbind_devices"],
      isTemporary: true,
      expiresAt: "2026-11-01",
      assignedWilayas: ["31 - وهران", "13 - تلمسان", "22 - سيدي بلعباس"],
      lastLogin: "منذ ساعتين",
      lastAction: "إعادة ضبط جهاز تلميذ واجه صعوبة مصادقة",
      createdAt: "2024-09-01",
      invitedBy: "أيمن بلحاج (المالك)"
    }
  ];

  public static getInstance(): AdminOperationsService {
    if (!AdminOperationsService.instance) {
      AdminOperationsService.instance = new AdminOperationsService();
    }
    return AdminOperationsService.instance;
  }

  // Support Tickets API
  public getTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public addTicketMessage(ticketId: string, message: Omit<SupportTicket["messages"][0], "id" | "timestamp">): boolean {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return false;

    const newMsg = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = newMsg.timestamp;
    return true;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket["status"], closingReason?: string): boolean {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return false;

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    if (status === "closed" || status === "resolved") {
      ticket.closedAt = ticket.updatedAt;
      ticket.closingReason = closingReason || "تم إغلاق التذكرة بعد المعالجة.";
    }
    return true;
  }

  // Announcements API
  public getAnnouncements(): PlatformAnnouncement[] {
    return [...this.announcements];
  }

  public createAnnouncement(ann: Omit<PlatformAnnouncement, "id" | "createdAt" | "updatedAt" | "viewsCount">): PlatformAnnouncement {
    const newAnn: PlatformAnnouncement = {
      ...ann,
      id: `ann-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      viewsCount: 0
    };
    this.announcements.unshift(newAnn);
    return newAnn;
  }

  public toggleAnnouncementStatus(id: string): boolean {
    const item = this.announcements.find(a => a.id === id);
    if (!item) return false;
    item.status = item.status === "published" ? "paused" : "published";
    return true;
  }

  // Coupons API
  public getCoupons(): DiscountCoupon[] {
    return [...this.coupons];
  }

  public validateAndCalculateCoupon(code: string, originalAmountDZD: number, courseId?: string): {
    isValid: boolean;
    discountAmountDZD: number;
    finalAmountDZD: number;
    reason?: string;
  } {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { isValid: false, discountAmountDZD: 0, finalAmountDZD: originalAmountDZD, reason: "رمز القسيمة غير موجود." };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountAmountDZD: 0, finalAmountDZD: originalAmountDZD, reason: "هذه القسيمة معطلة حالياً." };
    }

    const today = new Date().toISOString().split("T")[0];
    if (today < coupon.validFrom || today > coupon.validUntil) {
      return { isValid: false, discountAmountDZD: 0, finalAmountDZD: originalAmountDZD, reason: "القسيمة منتهية الصلاحية." };
    }

    if (coupon.usedCount >= coupon.maxUsesTotal) {
      return { isValid: false, discountAmountDZD: 0, finalAmountDZD: originalAmountDZD, reason: "تم استنفاد كامل مرات استخدام القسيمة." };
    }

    if (originalAmountDZD < coupon.minPurchaseDZD) {
      return {
        isValid: false,
        discountAmountDZD: 0,
        finalAmountDZD: originalAmountDZD,
        reason: `الحد الأدنى للشراء لتطبيق هذه القسيمة هو ${coupon.minPurchaseDZD} دج.`
      };
    }

    if (coupon.applicableCourseIds.length > 0 && courseId && !coupon.applicableCourseIds.includes(courseId)) {
      return { isValid: false, discountAmountDZD: 0, finalAmountDZD: originalAmountDZD, reason: "القسيمة غير صالحة لهذه الدورة المحددة." };
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((originalAmountDZD * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, originalAmountDZD);
    }

    const finalAmount = Math.max(0, originalAmountDZD - discountAmount);
    return {
      isValid: true,
      discountAmountDZD: discountAmount,
      finalAmountDZD: finalAmount
    };
  }

  public createCoupon(couponData: Omit<DiscountCoupon, "id" | "usedCount" | "createdAt">): DiscountCoupon {
    const newCoupon: DiscountCoupon = {
      ...couponData,
      id: `coup-${Date.now().toString().slice(-4)}`,
      usedCount: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };
    this.coupons.unshift(newCoupon);
    return newCoupon;
  }

  public toggleCouponActive(id: string): boolean {
    const coup = this.coupons.find(c => c.id === id);
    if (!coup) return false;
    coup.isActive = !coup.isActive;
    return true;
  }

  // Access Grants API
  public getAccessGrants(): CourseAccessGrant[] {
    return [...this.accessGrants];
  }

  public grantAccess(grant: Omit<CourseAccessGrant, "id" | "grantedAt" | "isRevoked">): CourseAccessGrant {
    const newGrant: CourseAccessGrant = {
      ...grant,
      id: `grant-${Date.now().toString().slice(-4)}`,
      grantedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      isRevoked: false
    };
    this.accessGrants.unshift(newGrant);
    return newGrant;
  }

  public revokeAccess(grantId: string, revokedBy: string, reason: string): boolean {
    const g = this.accessGrants.find(item => item.id === grantId);
    if (!g) return false;
    g.isRevoked = true;
    g.revokedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
    g.revokedBy = revokedBy;
    g.revocationReason = reason;
    return true;
  }

  // Diff Audit Logs API
  public getDiffAuditLogs(): DiffAuditLog[] {
    return [...this.diffLogs];
  }

  public recordDiffLog(log: Omit<DiffAuditLog, "id" | "timestamp">): DiffAuditLog {
    const newLog: DiffAuditLog = {
      ...log,
      id: `diff-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    this.diffLogs.unshift(newLog);
    return newLog;
  }

  // Data Integrity Diagnostics
  public getIntegrityIssues(): DataIntegrityIssue[] {
    return [...this.integrityIssues];
  }

  public resolveIntegrityIssue(issueId: string): boolean {
    const issue = this.integrityIssues.find(i => i.id === issueId);
    if (!issue) return false;
    issue.status = "fixed";
    return true;
  }

  // System Connectors Status
  public getSystemConnectors(): PlatformSystemStatus[] {
    return [...this.systemConnectors];
  }

  // Maintenance Settings API
  public getMaintenanceSettings(): MaintenanceSettings {
    return { ...this.maintenanceSettings };
  }

  public updateMaintenanceSettings(settings: Partial<MaintenanceSettings>, updatedBy: string): MaintenanceSettings {
    this.maintenanceSettings = {
      ...this.maintenanceSettings,
      ...settings,
      updatedBy,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    return { ...this.maintenanceSettings };
  }

  // ==========================================
  // STAFF & RBAC SECURITY VERIFICATION API
  // ==========================================
  public getStaffMembers(): AdminStaffMember[] {
    return [...this.staffMembers];
  }

  public getStaffByEmail(email: string): AdminStaffMember | null {
    if (!email) return null;
    return this.staffMembers.find(
      s => s.email.trim().toLowerCase() === email.trim().toLowerCase()
    ) || null;
  }

  public verifyAdministrativeAccess(user: { email?: string; role?: UserRole; isOwner?: boolean } | null): {
    isAuthorized: boolean;
    role: UserRole;
    isOwner: boolean;
    reason?: string;
    staffRecord?: AdminStaffMember;
  } {
    if (!user || !user.email) {
      return { isAuthorized: false, role: "student", isOwner: false, reason: "المستخدم غير مسجل الدخول." };
    }

    const staff = this.getStaffByEmail(user.email);
    if (!staff) {
      return {
        isAuthorized: false,
        role: "student",
        isOwner: false,
        reason: "هذا الحساب غير مدرج في السجل الإداري للنظام."
      };
    }

    if (staff.status !== "active") {
      return {
        isAuthorized: false,
        role: staff.role,
        isOwner: staff.isOwner,
        reason: "تم تعليق هذا الحساب الإداري أو إيقاف صلاحياته."
      };
    }

    // Check expiration for temporary staff
    if (staff.isTemporary && staff.expiresAt) {
      const now = new Date();
      const exp = new Date(staff.expiresAt);
      if (now > exp) {
        return {
          isAuthorized: false,
          role: staff.role,
          isOwner: staff.isOwner,
          reason: "انتهت فترة الصلاحية المؤقتة لهذا الحساب الإداري."
        };
      }
    }

    return {
      isAuthorized: true,
      role: staff.role,
      isOwner: staff.isOwner,
      staffRecord: staff
    };
  }

  public canPerformSensitiveAction(
    actorEmail: string,
    requiredPermission: PermissionKey
  ): { allowed: boolean; reason?: string } {
    const verification = this.verifyAdministrativeAccess({ email: actorEmail });
    if (!verification.isAuthorized || !verification.staffRecord) {
      return { allowed: false, reason: "غير مصرح بالوصول إلى لوحة الإدارة." };
    }

    // Owner has absolute sovereign permission
    if (verification.isOwner) {
      return { allowed: true };
    }

    const hasPerm = verification.staffRecord.permissions.includes(requiredPermission);
    if (!hasPerm) {
      return {
        allowed: false,
        reason: `عفواً، لا يملك هذا الحساب الصلاحية المحددة: ${requiredPermission}`
      };
    }

    return { allowed: true };
  }

  public addStaffMember(newStaff: AdminStaffMember, performedByEmail: string): boolean {
    const authCheck = this.canPerformSensitiveAction(performedByEmail, "manage_staff");
    if (!authCheck.allowed) {
      return false;
    }
    this.staffMembers.push(newStaff);
    return true;
  }

  public toggleStaffStatus(staffId: string, performedByEmail: string): boolean {
    const authCheck = this.canPerformSensitiveAction(performedByEmail, "manage_staff");
    if (!authCheck.allowed) {
      return false;
    }
    const target = this.staffMembers.find(s => s.id === staffId);
    if (!target || target.isOwner) {
      // Cannot toggle owner
      return false;
    }
    target.status = target.status === "active" ? "suspended" : "active";
    return true;
  }
}

export const adminOpsService = AdminOperationsService.getInstance();
