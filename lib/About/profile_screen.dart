import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';
import 'package:online_cource_app/Login/login_page.dart';
import 'package:online_cource_app/Utils/toast_messages.dart';
import 'package:online_cource_app/theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authController = Get.find<AuthController>();
    final user = authController.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_rounded),
            onPressed: () {
              // Navigate to settings screen
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Refresh user data
          await authController.fetchUserData();
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Profile header
              Center(
                child: Column(
                  children: [
                    // Profile image
                    CircleAvatar(
                      radius: 60,
                      backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                      child: user?.photoURL != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(60),
                              child: Image.network(
                                user!.photoURL!,
                                width: 120,
                                height: 120,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) =>
                                    _buildInitialsAvatar(user),
                              ),
                            )
                          : _buildInitialsAvatar(user),
                    ),
                    const SizedBox(height: 16),

                    // User name
                    Text(
                      user?.displayName ?? 'E-Learning User',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),

                    // Email
                    Text(
                      user?.email ?? '',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: AppTheme.secondaryTextColor,
                          ),
                    ),

                    const SizedBox(height: 24),

                    // Edit profile button
                    OutlinedButton.icon(
                      onPressed: () {
                        // Navigate to edit profile screen
                      },
                      icon: const Icon(Icons.edit_rounded),
                      label: const Text('Edit Profile'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Learning stats
              const Text(
                'Learning Statistics',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              _buildStatsCards(),

              const SizedBox(height: 32),

              // Account options
              const Text(
                'Account',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              _buildAccountOptions(context, authController),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInitialsAvatar(User? user) {
    String initials = 'U';
    if (user?.displayName != null && user!.displayName!.isNotEmpty) {
      final nameParts = user.displayName!.trim().split(' ');
      if (nameParts.length > 1) {
        initials = '${nameParts.first[0]}${nameParts.last[0]}';
      } else {
        initials = nameParts.first[0];
      }
      initials = initials.toUpperCase();
    } else if (user?.email != null) {
      initials = user!.email![0].toUpperCase();
    }

    return Center(
      child: Text(
        initials,
        style: const TextStyle(
          fontSize: 40,
          fontWeight: FontWeight.bold,
          color: AppTheme.primaryColor,
        ),
      ),
    );
  }

  Widget _buildStatsCards() {
    return Row(
      children: [
        _buildStatCard('Courses\nEnrolled', '5', Icons.school_rounded),
        const SizedBox(width: 16),
        _buildStatCard('Hours\nSpent', '24', Icons.access_time_rounded),
        const SizedBox(width: 16),
        _buildStatCard(
            'Certificates\nEarned', '3', Icons.workspace_premium_rounded),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Expanded(
      child: Card(
        color: Colors.white,
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: AppTheme.primaryColor,
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: AppTheme.secondaryTextColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAccountOptions(
      BuildContext context, AuthController authController) {
    return Card(
      color: Colors.white,
      elevation: 4,
      child: Column(
        children: [
          _buildOptionItem(
            icon: Icons.verified_user_rounded,
            title: 'Account Settings',
            onTap: () {
              // Navigate to account settings
            },
          ),
          const Divider(),
          _buildOptionItem(
            icon: Icons.notifications_rounded,
            title: 'Notifications',
            onTap: () {
              // Navigate to notifications settings
            },
          ),
          const Divider(),
          _buildOptionItem(
            icon: Icons.lock_rounded,
            title: 'Privacy & Security',
            onTap: () {
              // Navigate to privacy settings
            },
          ),
          const Divider(),
          _buildOptionItem(
            icon: Icons.help_rounded,
            title: 'Help & Support',
            onTap: () {
              // Navigate to help center
            },
          ),
          const Divider(),
          _buildOptionItem(
            icon: Icons.exit_to_app_rounded,
            title: 'Sign Out',
            textColor: AppTheme.errorColor,
            onTap: () async {
              try {
                await authController.signOutUsers();
                showSuccessToast(context, 'Signed out successfully');
                Get.offAll(() => const LoginPage());
              } catch (e) {
                showErrorToast(context, 'Error signing out. Please try again.');
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOptionItem({
    required IconData icon,
    required String title,
    Color? textColor,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: textColor ?? AppTheme.primaryColor,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: textColor,
        ),
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios_rounded,
        size: 16,
      ),
      onTap: onTap,
    );
  }
}
