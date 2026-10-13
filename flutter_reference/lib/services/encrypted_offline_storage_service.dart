import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'biometric_security_service.dart';

class OfflineLessonRecord {
  final String lessonId;
  final String courseId;
  final String title;
  final String duration;
  final int downloadedAt;
  final int expiresAt;
  final String encryptedFilePath;
  final String deviceId;

  OfflineLessonRecord({
    required this.lessonId,
    required this.courseId,
    required this.title,
    required this.duration,
    required this.downloadedAt,
    required this.expiresAt,
    required this.encryptedFilePath,
    required this.deviceId,
  });

  Map<String, dynamic> toJson() => {
    'lessonId': lessonId,
    'courseId': courseId,
    'title': title,
    'duration': duration,
    'downloadedAt': downloadedAt,
    'expiresAt': expiresAt,
    'encryptedFilePath': encryptedFilePath,
    'deviceId': deviceId,
  };

  factory OfflineLessonRecord.fromJson(Map<String, dynamic> json) => OfflineLessonRecord(
    lessonId: json['lessonId'],
    courseId: json['courseId'],
    title: json['title'],
    duration: json['duration'],
    downloadedAt: json['downloadedAt'],
    expiresAt: json['expiresAt'],
    encryptedFilePath: json['encryptedFilePath'],
    deviceId: json['deviceId'],
  );
}

/// EncryptedOfflineStorageService
/// خدمة التخزين المشفر للدروس على جهاز الطالب
/// تمنع استخراج الفيديو من الذاكرة أو تشغيله خارج تطبيق قرايتي DZ
class EncryptedOfflineStorageService {
  static final EncryptedOfflineStorageService _instance = EncryptedOfflineStorageService._internal();
  factory EncryptedOfflineStorageService() => _instance;
  EncryptedOfflineStorageService._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final BiometricSecurityService _biometricSecurity = BiometricSecurityService();
  static const String _storageKey = 'qdz_offline_index_v1';

  /// فحص توفر الدرس مشفراً ومطابقاً لصلاحية الجهاز
  Future<bool> isLessonAvailableOffline(String lessonId) async {
    final list = await getOfflineRecords();
    final deviceId = await _biometricSecurity.getHardwareDeviceId();
    final record = list.firstWhere(
      (r) => r.lessonId == lessonId && r.deviceId == deviceId,
      orElse: () => OfflineLessonRecord(
        lessonId: '', courseId: '', title: '', duration: '',
        downloadedAt: 0, expiresAt: 0, encryptedFilePath: '', deviceId: '',
      ),
    );

    if (record.lessonId.isEmpty) return false;
    // التحقق من تاريخ الصلاحية الأوفلاين (30 يوماً)
    return DateTime.now().millisecondsSinceEpoch < record.expiresAt;
  }

  Future<List<OfflineLessonRecord>> getOfflineRecords() async {
    final raw = await _secureStorage.read(key: _storageKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final List<dynamic> decoded = jsonDecode(raw);
      return decoded.map((e) => OfflineLessonRecord.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  /// حفظ مؤشر الدرس المشفر في التخزين الآمن
  Future<void> registerEncryptedLesson({
    required String lessonId,
    required String courseId,
    required String title,
    required String duration,
    required String encryptedPath,
  }) async {
    final deviceId = await _biometricSecurity.getHardwareDeviceId();
    final list = await getOfflineRecords();
    list.removeWhere((r) => r.lessonId == lessonId);

    list.add(OfflineLessonRecord(
      lessonId: lessonId,
      courseId: courseId,
      title: title,
      duration: duration,
      downloadedAt: DateTime.now().millisecondsSinceEpoch,
      expiresAt: DateTime.now().add(const Duration(days: 30)).millisecondsSinceEpoch,
      encryptedFilePath: encryptedPath,
      deviceId: deviceId,
    ));

    await _secureStorage.write(
      key: _storageKey,
      value: jsonEncode(list.map((r) => r.toJson()).toList()),
    );
  }
}
