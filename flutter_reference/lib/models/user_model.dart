import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole {
  student,
  client,
  admin,
  owner,
}

class DeviceBindingModel {
  final String deviceId;
  final String deviceName;
  final String platform;
  final DateTime lastUsedAt;
  final bool isTrusted;
  final bool biometricEnrolled;
  final DateTime boundAt;

  DeviceBindingModel({
    required this.deviceId,
    required this.deviceName,
    required this.platform,
    required this.lastUsedAt,
    required this.isTrusted,
    required this.biometricEnrolled,
    required this.boundAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'deviceId': deviceId,
      'deviceName': deviceName,
      'platform': platform,
      'lastUsedAt': lastUsedAt.toIso8601String(),
      'isTrusted': isTrusted,
      'biometricEnrolled': biometricEnrolled,
      'boundAt': boundAt.toIso8601String(),
    };
  }

  factory DeviceBindingModel.fromMap(Map<String, dynamic> map) {
    return DeviceBindingModel(
      deviceId: map['deviceId'] ?? '',
      deviceName: map['deviceName'] ?? '',
      platform: map['platform'] ?? '',
      lastUsedAt: DateTime.tryParse(map['lastUsedAt'] ?? '') ?? DateTime.now(),
      isTrusted: map['isTrusted'] ?? true,
      biometricEnrolled: map['biometricEnrolled'] ?? false,
      boundAt: DateTime.tryParse(map['boundAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class UserModel {
  final String uid;
  final String fullName;
  final String email;
  final String phoneNumber;
  final String wilaya;
  final String academicYear;
  final UserRole role;
  final bool isBiometricEnabled;
  final List<DeviceBindingModel> boundDevices;
  final DateTime createdAt;
  final DateTime lastLogin;

  UserModel({
    required this.uid,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.wilaya,
    required this.academicYear,
    required this.role,
    this.isBiometricEnabled = false,
    this.boundDevices = const [],
    required this.createdAt,
    required this.lastLogin,
  });

  bool get isOwner => role == UserRole.owner;
  bool get isAdmin => role == UserRole.admin || role == UserRole.owner;
  bool get isStudent => role == UserRole.student;

  Map<String, dynamic> toFirestore() {
    return {
      'uid': uid,
      'fullName': fullName,
      'email': email,
      'phoneNumber': phoneNumber,
      'wilaya': wilaya,
      'academicYear': academicYear,
      'role': role.name,
      'isBiometricEnabled': isBiometricEnabled,
      'boundDevices': boundDevices.map((d) => d.toMap()).toList(),
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLogin': Timestamp.fromDate(lastLogin),
    };
  }

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    final roleStr = data['role'] as String? ?? 'student';
    UserRole roleVal = UserRole.student;
    if (roleStr == 'owner') roleVal = UserRole.owner;
    else if (roleStr == 'admin') roleVal = UserRole.admin;
    else if (roleStr == 'client') roleVal = UserRole.client;

    final devicesRaw = (data['boundDevices'] as List<dynamic>?) ?? [];
    final boundDevices = devicesRaw
        .map((item) => DeviceBindingModel.fromMap(Map<String, dynamic>.from(item)))
        .toList();

    return UserModel(
      uid: doc.id,
      fullName: data['fullName'] ?? '',
      email: data['email'] ?? '',
      phoneNumber: data['phoneNumber'] ?? '',
      wilaya: data['wilaya'] ?? '16 - الجزائر العاصمة',
      academicYear: data['academicYear'] ?? '',
      role: roleVal,
      isBiometricEnabled: data['isBiometricEnabled'] ?? false,
      boundDevices: boundDevices,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      lastLogin: (data['lastLogin'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
}
