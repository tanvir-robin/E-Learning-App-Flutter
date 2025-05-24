import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';
import 'package:online_cource_app/Login/login_page.dart';
import 'package:online_cource_app/navigation/main_navigation.dart';
import 'package:online_cource_app/theme/app_theme.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();

    return Obx(() {
      if (authController.isLoading.value) {
        return _buildLoadingScreen();
      }

      return StreamBuilder<User?>(
        stream: authController.userStream,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return _buildLoadingScreen();
          } else if (snapshot.hasError) {
            return _buildErrorScreen(snapshot.error.toString());
          } else if (snapshot.hasData) {
            return const MainNavigationScreen(initialIndex: 0);
          } else {
            return const LoginPage();
          }
        },
      );
    });
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo
            Image.asset(
              'images/logo.png',
              width: 180,
              height: 180,
            ),
            const SizedBox(height: 40),
            // Loading indicator
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
            ),
            const SizedBox(height: 24),
            Text(
              'Loading your experience...',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppTheme.secondaryTextColor,
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildErrorScreen(String error) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline_rounded,
                color: AppTheme.errorColor,
                size: 80,
              ),
              const SizedBox(height: 24),
              const Text(
                'Oops! Something went wrong',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textColor,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                error,
                style: TextStyle(
                  fontSize: 16,
                  color: AppTheme.secondaryTextColor,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => Get.offAll(() => const AuthGate()),
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
