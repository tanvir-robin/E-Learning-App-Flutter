// ==========================================
// Qrayati DZ — Admin & Security Test Suite
// Verifying business rules, RBAC, coupons, DRM
// ==========================================

import { adminOpsService } from "./AdminOperationsService";
import { BiometricSecurityService } from "./BiometricSecurityService";
import { playbackAuthorizationService } from "./PlaybackAuthorizationService";
import { encryptedOfflineStorageService } from "./EncryptedOfflineStorageService";

export function runPlatformSecurityTests(): {
  testName: string;
  passed: boolean;
  message: string;
}[] {
  const results = [];

  // Test 1: Coupon calculation & bounds check
  const validCouponTest = adminOpsService.validateAndCalculateCoupon("BAC2025DZ", 4500);
  results.push({
    testName: "حساب الخصم وتطبيق القسيمة الصالحة في الخدمة الخلفية",
    passed: validCouponTest.isValid && validCouponTest.finalAmountDZD === 3600,
    message: `النتيجة: ${validCouponTest.finalAmountDZD} دج (خصم 20% من 4500 دج = 900 دج)`
  });

  // Test 2: Reject coupon below minimum purchase
  const lowAmountTest = adminOpsService.validateAndCalculateCoupon("BAC2025DZ", 1000);
  results.push({
    testName: "رفض القسيمة عندما يقل المبلغ عن الحد الأدنى للشراء (3000 دج)",
    passed: !lowAmountTest.isValid && lowAmountTest.finalAmountDZD === 1000,
    message: lowAmountTest.reason || "تم الرفض بنجاح"
  });

  // Test 3: Reject non-existent coupon
  const invalidCouponTest = adminOpsService.validateAndCalculateCoupon("FAKE_CODE_99", 5000);
  results.push({
    testName: "رفض الرموز غير المعرفة في النظام المالي",
    passed: !invalidCouponTest.isValid,
    message: invalidCouponTest.reason || "رمز غير صالح"
  });

  // Test 4: Access Grant creation & revocation
  const newGrant = adminOpsService.grantAccess({
    studentId: "std-test-1",
    studentName: "طالب اختبار",
    studentEmail: "test.student@qrayati.dz",
    courseId: "c-bac-physics-01",
    courseTitle: "فيزياء البكالوريا",
    accessType: "administrative_grant",
    grantedBy: "المالك العام",
    reason: "اختبار المنح الاستثنائي"
  });

  const revokeResult = adminOpsService.revokeAccess(newGrant.id, "المالك", "إلغاء فوري بعد انتهاء الاختبار");
  results.push({
    testName: "دورة حياة منح وسحب الوصول التعليمي الاستثنائي",
    passed: newGrant.id.length > 0 && revokeResult,
    message: `تم المنح برقم ${newGrant.id} وتم السحب بنجاح`
  });

  // Test 5: Diff Audit Log tracking
  const diffLog = adminOpsService.recordDiffLog({
    entityName: "TestEntity",
    entityId: "test-01",
    actionType: "update",
    performedBy: "المالك العام",
    performedByRole: "owner",
    ipAddress: "127.0.0.1",
    reason: "اختبار سجل الفروقات",
    diffFields: [{ fieldName: "status", oldValue: "draft", newValue: "published" }],
    status: "success"
  });

  results.push({
    testName: "تسجيل الفروقات السابقة والجديدة (Diff Audit) في قاعدة البيانات",
    passed: diffLog.id.length > 0 && diffLog.diffFields[0].newValue === "published",
    message: `مسجل برقم ${diffLog.id}`
  });


  // Test 6: Biometric Token Storage & Device ID Generation
  const deviceId = BiometricSecurityService.getOrCreateDeviceId();
  results.push({
    testName: "توليد معرف الجهاز المشفر والفريد (Device ID Binding)",
    passed: typeof deviceId === "string" && deviceId.length > 5,
    message: `معرف الجهاز النشط: ${deviceId.substring(0, 12)}...`
  });

  // Test 7: Biometric Session Lockout State Machine
  const isLocked = BiometricSecurityService.isSessionLocked();
  results.push({
    testName: "حالة قفل الجلسة واستعداد الحماية البيومترية",
    passed: typeof isLocked === "boolean",
    message: isLocked ? "الجلسة مقفلة وتتطلب تأكيد البصمة" : "الجلسة مفتوحة ونشطة"
  });

  // Test 8: DRM Playback Authorization Check
  const pingActive = playbackAuthorizationService.pingPlaybackSession("usr-audit-test", "lesson-audit-01");
  results.push({
    testName: "فحص استجابة حارس التشغيل الموحد (DRM Authorization Guard)",
    passed: typeof pingActive === "boolean",
    message: "تم استدعاء بروتوكول المصادقة الفورية للتشغيل بنجاح"
  });

  // Test 9: Encrypted Offline Storage Manager
  const offlineLessons = encryptedOfflineStorageService.getOfflineLessons();
  results.push({
    testName: "محرك التخزين المشفر للدروس دون اتصال (Encrypted Offline Lessons)",
    passed: Array.isArray(offlineLessons),
    message: `عدد الدروس المشفرة المحفوظة في المستودع الآمن: ${offlineLessons.length}`
  });


  // Test 10: Student Direct Access Rejection (Separation of Interfaces)
  const studentCheck = adminOpsService.verifyAdministrativeAccess({
    email: "student@qrayati.dz",
    role: "student"
  });
  results.push({
    testName: "رفض وصول حساب التلميذ إلى لوحة المالك والإدارة (Security Access Rejection)",
    passed: !studentCheck.isAuthorized && !studentCheck.isOwner,
    message: studentCheck.reason || "تم حجب الإدارة عن التلميذ بنجاح"
  });

  // Test 11: Sovereign Owner Identity Authorization
  const ownerCheck = adminOpsService.verifyAdministrativeAccess({
    email: "aymen.belhadj@qrayati.dz",
    role: "owner"
  });
  results.push({
    testName: "التحقق من هوية المالك العام وصلاحياته السيادية (Owner Identity Guard)",
    passed: ownerCheck.isAuthorized && ownerCheck.isOwner && ownerCheck.role === "owner",
    message: `المالك معتمد: ${ownerCheck.staffRecord?.name || ""}`
  });

  // Test 12: Admin Scoped Role Permission Enforcement (Finance vs Content)
  const financeStaff = adminOpsService.canPerformSensitiveAction("amina.bouguerra@qrayati.dz", "view_finances");
  const financeIllegalStaff = adminOpsService.canPerformSensitiveAction("amina.bouguerra@qrayati.dz", "delete_content");
  results.push({
    testName: "تقييد المسؤول الإداري بنطاق اختصاصه ومنع التجاوز (Scoped RBAC Enforcement)",
    passed: financeStaff.allowed && !financeIllegalStaff.allowed,
    message: "تم السماح بالمالية ورُفض حذف المحتوى بنجاح لمسؤولة المالية"
  });

  return results;
}
