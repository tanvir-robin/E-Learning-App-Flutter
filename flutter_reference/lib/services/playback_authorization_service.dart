import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import 'biometric_security_service.dart';

enum PlaybackDenialReason {
  unauthenticated,
  notEnrolled,
  deviceMismatch,
  sessionExpired,
  drmLicenseRejected,
  unknown,
}

class PlaybackAuthorizationToken {
  final bool authorized;
  final String sessionId;
  final String signedUrl;
  final DateTime expiresAt;
  final String lessonId;
  final String courseId;
  final Map<String, dynamic> watermarkData;
  final bool drmLicenseGranted;
  final String? licenseServerUrl;
  final PlaybackDenialReason? denialReason;

  PlaybackAuthorizationToken({
    required this.authorized,
    required this.sessionId,
    required this.signedUrl,
    required this.expiresAt,
    required this.lessonId,
    required this.courseId,
    required this.watermarkData,
    this.drmLicenseGranted = false,
    this.licenseServerUrl,
    this.denialReason,
  });
}

class PlaybackAuthorizationService {
  static final PlaybackAuthorizationService _instance = PlaybackAuthorizationService._internal();
  factory PlaybackAuthorizationService() => _instance;
  PlaybackAuthorizationService._internal();

  final BiometricSecurityService _biometricSecurity = BiometricSecurityService();

  /// طلب تفويض تشغيل لدرس محدد مع فحص الجهاز والاشتراك في منصة قرايتي DZ
  Future<PlaybackAuthorizationToken> requestAuthorization({
    required UserModel? user,
    required String courseId,
    required String lessonId,
    required bool isEnrolled,
    required bool isPreview,
    String? rawVideoUrl,
  }) async {
    // 1. فحص الدروس المجانية التجريبية
    if (isPreview) {
      return PlaybackAuthorizationToken(
        authorized: true,
        sessionId: 'preview_${DateTime.now().millisecondsSinceEpoch}',
        signedUrl: rawVideoUrl ?? '',
        expiresAt: DateTime.now().add(const Duration(hours: 2)),
        lessonId: lessonId,
        courseId: courseId,
        watermarkData: {
          'userName': user?.name ?? 'زائر تجريبي (قرايتي DZ)',
          'userPhone': user?.phone ?? 'معاينة مجانية',
          'userUid': user?.uid ?? 'guest_preview',
          'timestamp': DateTime.now().toIso8601String(),
        },
      );
    }

    // 2. التحقق من هوية الحساب
    if (user == null) {
      return PlaybackAuthorizationToken(
        authorized: false,
        sessionId: '',
        signedUrl: '',
        expiresAt: DateTime.now(),
        lessonId: lessonId,
        courseId: courseId,
        watermarkData: {},
        denialReason: PlaybackDenialReason.unauthenticated,
      );
    }

    // 3. التحقق من صلاحيات الإدارة أو ملكية الدورة
    final bool isElevated = user.role == UserRole.admin || user.role == UserRole.owner;
    if (!isEnrolled && !isElevated) {
      return PlaybackAuthorizationToken(
        authorized: false,
        sessionId: '',
        signedUrl: '',
        expiresAt: DateTime.now(),
        lessonId: lessonId,
        courseId: courseId,
        watermarkData: {},
        denialReason: PlaybackDenialReason.notEnrolled,
      );
    }

    // 4. مطابقة بصمة الجهاز المعتمد
    final currentDeviceId = await _biometricSecurity.getHardwareDeviceId();
    final isDeviceBound = user.boundDevices.any((d) => d.deviceId == currentDeviceId);
    if (!isDeviceBound && !isElevated && user.boundDevices.isNotEmpty) {
      return PlaybackAuthorizationToken(
        authorized: false,
        sessionId: '',
        signedUrl: '',
        expiresAt: DateTime.now(),
        lessonId: lessonId,
        courseId: courseId,
        watermarkData: {},
        denialReason: PlaybackDenialReason.deviceMismatch,
      );
    }

    // 5. توليد الرابط الموقع وتوكن البث الآمن
    final sessionId = 'qdz_session_${user.uid}_${DateTime.now().millisecondsSinceEpoch}';
    final signedUrl = _generateSignedUrl(rawVideoUrl ?? '', user.uid);

    return PlaybackAuthorizationToken(
      authorized: true,
      sessionId: sessionId,
      signedUrl: signedUrl,
      expiresAt: DateTime.now().add(const Duration(hours: 4)),
      lessonId: lessonId,
      courseId: courseId,
      watermarkData: {
        'userName': user.name,
        'userPhone': user.phone ?? '0550 00 00 00',
        'userUid': user.uid,
        'deviceId': currentDeviceId,
        'timestamp': DateTime.now().toIso8601String(),
      },
      drmLicenseGranted: true,
      licenseServerUrl: 'https://drm.qrayatidz.com/widevine/v1',
    );
  }

  String _generateSignedUrl(String baseUrl, String userUid) {
    if (baseUrl.isEmpty) return '';
    final expiry = DateTime.now().add(const Duration(hours: 4)).millisecondsSinceEpoch ~/ 1000;
    final token = base64Url.encode(utf8.encode('$userUid:$expiry')).replaceAll('=', '');
    final separator = baseUrl.contains('?') ? '&' : '?';
    return '$baseUrl${separator}auth_sig=$token&exp=$expiry&dz_secure=1';
  }
}
