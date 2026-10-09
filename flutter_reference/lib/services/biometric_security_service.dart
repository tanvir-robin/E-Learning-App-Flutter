import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:device_info_plus/device_info_plus.dart';

enum BiometricAuthStatus {
  notAvailable,
  notEnrolled,
  disabledByUser,
  authenticated,
  failed,
  lockedOut,
}

class BiometricSecurityService {
  final LocalAuthentication _localAuth = LocalAuthentication();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );
  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  static const String _keyBiometricEnabled = 'qrayati_biometric_enabled';
  static const String _keySavedSessionToken = 'qrayati_session_token';
  static const String _keyUserUid = 'qrayati_trusted_uid';
  static const String _keyUserEmail = 'qrayati_trusted_email';
  static const String _keyDeviceId = 'qrayati_bound_device_id';

  /// Check if hardware supports biometrics (Fingerprint / Face ID)
  Future<bool> isBiometricsSupported() async {
    try {
      final bool canAuthenticateWithBiometrics = await _localAuth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await _localAuth.isDeviceSupported();
      return canAuthenticate;
    } on PlatformException {
      return false;
    }
  }

  /// Get list of available biometric sensors on the phone
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } on PlatformException {
      return [];
    }
  }

  /// Check if biometric login is currently active for this app
  Future<bool> isBiometricLoginEnabled() async {
    final enabled = await _secureStorage.read(key: _keyBiometricEnabled);
    return enabled == 'true';
  }

  /// Authenticate user via fingerprint/face (Banking App Grade)
  Future<BiometricAuthStatus> authenticateUser({
    String reason = 'المس مستشعر البصمة لفتح حسابك في قرايتي DZ بأمان',
  }) async {
    final isSupported = await isBiometricsSupported();
    if (!isSupported) return BiometricAuthStatus.notAvailable;

    final isEnabled = await isBiometricLoginEnabled();
    if (!isEnabled) return BiometricAuthStatus.disabledByUser;

    try {
      final bool didAuthenticate = await _localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
          useErrorDialogs: true,
          sensitiveTransaction: true,
        ),
      );

      return didAuthenticate ? BiometricAuthStatus.authenticated : BiometricAuthStatus.failed;
    } on PlatformException catch (e) {
      if (e.code == 'LockedOut' || e.code == 'PermanentlyLockedOut') {
        return BiometricAuthStatus.lockedOut;
      }
      return BiometricAuthStatus.failed;
    }
  }

  /// Enable biometric login and securely bind credentials to device
  Future<void> enableBiometrics({
    required String uid,
    required String email,
    required String sessionToken,
  }) async {
    await _secureStorage.write(key: _keyBiometricEnabled, value: 'true');
    await _secureStorage.write(key: _keyUserUid, value: uid);
    await _secureStorage.write(key: _keyUserEmail, value: email);
    await _secureStorage.write(key: _keySavedSessionToken, value: sessionToken);

    // Ensure device ID is bound
    await getOrCreateDeviceId();
  }

  /// Disable biometric login for this device
  Future<void> disableBiometrics() async {
    await _secureStorage.write(key: _keyBiometricEnabled, value: 'false');
    await _secureStorage.delete(key: _keySavedSessionToken);
  }

  /// Retrieve bound email if stored
  Future<String?> getSavedUserEmail() async {
    return await _secureStorage.read(key: _keyUserEmail);
  }

  /// Retrieve bound session token
  Future<String?> getSavedSessionToken() async {
    return await _secureStorage.read(key: _keySavedSessionToken);
  }

  /// Get or generate unique hardware-backed device identifier
  Future<String> getOrCreateDeviceId() async {
    String? storedId = await _secureStorage.read(key: _keyDeviceId);
    if (storedId != null && storedId.isNotEmpty) {
      return storedId;
    }

    String deviceId = 'DZ-DEV-${DateTime.now().millisecondsSinceEpoch}';
    try {
      // Android / iOS native device identification
      final androidInfo = await _deviceInfo.androidInfo;
      deviceId = 'DZ-${androidInfo.brand.toUpperCase()}-${androidInfo.id.substring(0, 6)}';
    } catch (_) {
      // Fallback
    }

    await _secureStorage.write(key: _keyDeviceId, value: deviceId);
    return deviceId;
  }
}
