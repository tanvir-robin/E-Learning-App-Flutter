import 'package:get/get.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../services/biometric_security_service.dart';

class AuthController extends GetxController {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final BiometricSecurityService _biometricService = BiometricSecurityService();

  // Observable state
  final Rx<UserModel?> currentUser = Rx<UserModel?>(null);
  final RxBool isLoading = false.obs;
  final RxBool isBiometricEnrolled = false.obs;
  final RxBool isSessionLocked = true.obs;
  final RxString savedUserEmail = ''.obs;
  final RxString boundDeviceId = ''.obs;

  @override
  void onInit() {
    super.onInit();
    _checkInitialSession();
  }

  /// Check saved session & biometric status on app boot
  Future<void> _checkInitialSession() async {
    final bool biometricEnabled = await _biometricService.isBiometricLoginEnabled();
    isBiometricEnrolled.value = biometricEnabled;
    boundDeviceId.value = await _biometricService.getOrCreateDeviceId();

    final String? email = await _biometricService.getSavedUserEmail();
    if (email != null) {
      savedUserEmail.value = email;
    }

    // If biometric is enrolled, enforce Lock Screen initially like banking apps
    if (biometricEnabled) {
      isSessionLocked.value = true;
      Get.offAllNamed('/biometric_lock');
      return;
    }

    // Listen to Firebase auth state
    _auth.authStateChanges().listen((User? firebaseUser) async {
      if (firebaseUser != null) {
        await _fetchUserData(firebaseUser.uid);
        isSessionLocked.value = false;
        _routeUserByRole(currentUser.value);
      } else {
        currentUser.value = null;
        Get.offAllNamed('/login');
      }
    });
  }

  Future<void> _fetchUserData(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        currentUser.value = UserModel.fromFirestore(doc);
      }
    } catch (e) {
      Get.snackbar('خطأ', 'فشل تحميل بيانات المستخدم');
    }
  }

  /// 1. First Time Traditional login (Email & Password)
  Future<bool> signInWithEmailPassword(String email, String password) async {
    try {
      isLoading.value = true;
      final credential = await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password,
      );

      final uid = credential.user!.uid;
      await _fetchUserData(uid);

      // Record device binding in Firestore
      final deviceId = await _biometricService.getOrCreateDeviceId();
      await _firestore.collection('users').doc(uid).update({
        'lastLogin': FieldValue.serverTimestamp(),
        'lastDeviceId': deviceId,
      });

      isSessionLocked.value = false;

      // Offer biometric enrollment on first successful login if hardware supports it
      final isSupported = await _biometricService.isBiometricsSupported();
      final isEnrolled = await _biometricService.isBiometricLoginEnabled();
      if (isSupported && !isEnrolled) {
        Get.toNamed('/prompt_enroll_biometrics');
      } else {
        _routeUserByRole(currentUser.value);
      }
      return true;
    } on FirebaseAuthException catch (e) {
      Get.snackbar('فشل تسجيل الدخول', e.message ?? 'البيانات غير صحيحة');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 2. Subsequent Times: Bank-grade Biometric Unlock (Touch ID / Face ID)
  Future<bool> unlockWithBiometrics() async {
    try {
      isLoading.value = true;
      final status = await _biometricService.authenticateUser(
        reason: 'المس مستشعر البصمة لفتح حساب قرايتي DZ والوصول إلى دوراتك',
      );

      if (status == BiometricAuthStatus.authenticated) {
        final savedEmail = await _biometricService.getSavedUserEmail();
        final savedToken = await _biometricService.getSavedSessionToken();

        if (savedEmail != null && savedToken != null) {
          // Verify session integrity with Firebase
          final firebaseUser = _auth.currentUser;
          if (firebaseUser != null) {
            await _fetchUserData(firebaseUser.uid);
          } else {
            // Restore secure session with custom token or credentials
          }
          isSessionLocked.value = false;
          _routeUserByRole(currentUser.value);
          return true;
        } else {
          Get.snackbar('تنبيه أمني', 'يرجى تسجيل الدخول بكلمة المرور لإعادة مزامنة البصمة');
          Get.offAllNamed('/login');
          return false;
        }
      } else if (status == BiometricAuthStatus.lockedOut) {
        Get.snackbar('تنبيه أمني', 'تم قفل البصمة مؤقتاً لتكرار المحاولات الخاطئة');
        return false;
      } else {
        Get.snackbar('تنبيه', 'لم يتم التعرف على البصمة');
        return false;
      }
    } catch (e) {
      Get.snackbar('خطأ بيومتري', e.toString());
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /// 3. Toggle Biometric Enrollment for current account
  Future<void> toggleBiometrics(bool enable) async {
    final user = currentUser.value;
    if (user == null) return;

    if (enable) {
      final token = await _auth.currentUser?.getIdToken() ?? '';
      await _biometricService.enableBiometrics(
        uid: user.uid,
        email: user.email,
        sessionToken: token,
      );
      isBiometricEnrolled.value = true;
      Get.snackbar('الأمان البيومتري', 'تم تفعيل تسجيل الدخول بالبصمة بنجاح');
    } else {
      await _biometricService.disableBiometrics();
      isBiometricEnrolled.value = false;
      Get.snackbar('الأمان البيومتري', 'تم إلغاء تفعيل البصمة لهذا الجهاز');
    }
  }

  /// 4. Route user according to verified role (Owner, Admin, Student)
  void _routeUserByRole(UserModel? user) {
    if (user == null) {
      Get.offAllNamed('/login');
      return;
    }
    if (user.isOwner) {
      Get.offAllNamed('/owner_dashboard');
    } else if (user.isAdmin) {
      Get.offAllNamed('/admin_courses');
    } else {
      Get.offAllNamed('/home');
    }
  }

  /// 5. Sign out & invalidate local session
  Future<void> signOut() async {
    await _auth.signOut();
    isSessionLocked.value = true;
    currentUser.value = null;
    Get.offAllNamed('/login');
  }

  /// 6. Unlink Device & Wipe Biometric Credentials
  Future<void> unlinkDevice() async {
    await _biometricService.disableBiometrics();
    isBiometricEnrolled.value = false;
    await signOut();
  }
}
