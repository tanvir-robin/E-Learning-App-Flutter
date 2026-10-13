import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';

class BiometricLockScreen extends StatelessWidget {
  const BiometricLockScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();

    // Trigger biometric prompt on screen display
    WidgetsBinding.instance.addPostFrameCallback((_) {
      authController.unlockWithBiometrics();
    });

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark slate banking style
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Security Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0x2210B981),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0x4410B981)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.security, size: 14, color: Color(0xFF10B981)),
                        SizedBox(width: 6),
                        Text(
                          'حماية بيومترية بنكية',
                          style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  Obx(() => Text(
                    authController.boundDeviceId.value,
                    style: const TextStyle(color: Colors.white38, fontSize: 11, fontFamily: 'monospace'),
                  )),
                ],
              ),

              // Central Account & Sensor
              Column(
                children: [
                  // Logo
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: const Color(0x2210B981),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0x5510B981)),
                    ),
                    child: const Center(
                      child: Text(
                        'DZ',
                        style: TextStyle(color: Color(0xFF10B981), fontSize: 26, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Account Name
                  Obx(() => Text(
                    authController.currentUser.value?.name ?? 'حساب قرايتي DZ',
                    style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                  )),
                  const SizedBox(height: 6),
                  Obx(() => Text(
                    authController.savedUserEmail.value,
                    style: const TextStyle(color: Colors.white60, fontSize: 12),
                  )),
                  const SizedBox(height: 12),

                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.lock_outline, size: 12, color: Colors.amber),
                        SizedBox(width: 6),
                        Text(
                          'الحساب مقفل - المس البصمة للفتح',
                          style: TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 36),

                  // Sensor Button
                  GestureDetector(
                    onTap: () => authController.unlockWithBiometrics(),
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0x1510B981),
                        border: Border.all(color: const Color(0xFF10B981), width: 2),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x3310B981),
                            blurRadius: 20,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.fingerprint,
                          size: 56,
                          color: Color(0xFF10B981),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'المس مستشعر البصمة',
                    style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                ],
              ),

              // Bottom Actions
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => Get.offAllNamed('/login'),
                      icon: const Icon(Icons.password, size: 18, color: Color(0xFF10B981)),
                      label: const Text('تسجيل الدخول بكلمة المرور', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextButton(
                    onPressed: () => authController.unlinkDevice(),
                    child: const Text(
                      'إلغاء ربط هذا الحساب بالجهاز',
                      style: TextStyle(color: Colors.white38, fontSize: 11),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
