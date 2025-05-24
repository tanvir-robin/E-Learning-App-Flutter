import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';

class AuthController extends GetxController {
  static AuthController instance = Get.find<AuthController>();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  final Rx<User?> firebaseUser = Rx<User?>(null);
  final RxBool isLoading = false.obs;
  final RxMap<String, dynamic> userData = RxMap<String, dynamic>({});

  @override
  void onInit() {
    super.onInit();
    firebaseUser.bindStream(_auth.userChanges());
    ever(firebaseUser, _setInitialScreen);
  }

  // Set initial screen based on user authentication state
  _setInitialScreen(User? user) async {
    if (user != null) {
      // User is logged in, fetch user data
      await fetchUserData();
    } else {
      // Clear user data when logged out
      userData.clear();
    }
  }

  // Fetch user data from Firestore
  Future<void> fetchUserData() async {
    try {
      if (currentUser != null) {
        final doc =
            await _firestore.collection('users').doc(currentUser!.uid).get();
        if (doc.exists) {
          userData.value = doc.data() ?? {};

          FirebaseAuth.instance.currentUser!
              .updateDisplayName(userData['name'] ?? "Student");
        } else {
          // Create user document if it doesn't exist
          await _firestore.collection('users').doc(currentUser!.uid).set({
            'email': currentUser!.email,
            'displayName': currentUser!.displayName,
            'photoURL': currentUser!.photoURL,
            'createdAt': FieldValue.serverTimestamp(),
            'lastLogin': FieldValue.serverTimestamp(),
            'enrolledCourses': [],
          });

          // Fetch the newly created document
          final newDoc =
              await _firestore.collection('users').doc(currentUser!.uid).get();
          userData.value = newDoc.data() ?? {};
        }
      }
    } catch (e) {
      debugPrint('Error fetching user data: $e');
    }
  }

  User? get currentUser => _auth.currentUser;

  Stream<User?> get userStream => _auth.authStateChanges();

  // Method to update user profile
  Future<bool> updateUserProfile(
      {String? displayName,
      String? photoURL,
      Map<String, dynamic>? additionalData}) async {
    try {
      isLoading.value = true;

      if (currentUser != null) {
        // Update in Firebase Auth
        if (displayName != null) {
          await currentUser!.updateDisplayName(displayName);
        }

        if (photoURL != null) {
          await currentUser!.updatePhotoURL(photoURL);
        }

        // Prepare update data
        Map<String, dynamic> updateData = {
          'updatedAt': FieldValue.serverTimestamp(),
        };

        if (displayName != null) {
          updateData['displayName'] = displayName;
        }

        if (photoURL != null) {
          updateData['photoURL'] = photoURL;
        }

        // Add any additional data
        if (additionalData != null) {
          updateData.addAll(additionalData);
        }

        // Update in Firestore
        await _firestore
            .collection('users')
            .doc(currentUser!.uid)
            .update(updateData);

        // Refresh user data
        await fetchUserData();

        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error updating profile: $e');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Method to enroll in a course
  Future<bool> enrollInCourse(String courseId, double price) async {
    try {
      isLoading.value = true;

      if (currentUser != null) {
        // Add course to user's enrolled courses
        await _firestore
            .collection('users')
            .doc(currentUser!.uid)
            .collection('enrolledCourses')
            .doc(courseId)
            .set({
          'courseId': courseId,
          'enrolledAt': FieldValue.serverTimestamp(),
          'progress': 0.0,
          'lastAccessed': FieldValue.serverTimestamp(),
          'price': price,
        });

        // Increment course enrollment count
        await _firestore.collection('courses').doc(courseId).update({
          'enrollmentCount': FieldValue.increment(1),
        });

        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error enrolling in course: $e');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Method to update course progress
  Future<bool> updateCourseProgress(String courseId, double progress) async {
    try {
      if (currentUser != null) {
        await _firestore
            .collection('users')
            .doc(currentUser!.uid)
            .collection('enrolledCourses')
            .doc(courseId)
            .update({
          'progress': progress,
          'lastAccessed': FieldValue.serverTimestamp(),
        });
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error updating course progress: $e');
      return false;
    }
  }

  // Method to check if user is enrolled in a course
  Future<bool> isEnrolledInCourse(String courseId) async {
    try {
      if (currentUser != null) {
        final doc = await _firestore
            .collection('users')
            .doc(currentUser!.uid)
            .collection('enrolledCourses')
            .doc(courseId)
            .get();
        return doc.exists;
      }
      return false;
    } catch (e) {
      debugPrint('Error checking course enrollment: $e');
      return false;
    }
  }

  // Method to get enrolled courses
  Stream<QuerySnapshot> getEnrolledCoursesStream() {
    if (currentUser != null) {
      return _firestore
          .collection('users')
          .doc(currentUser!.uid)
          .collection('enrolledCourses')
          .orderBy('lastAccessed', descending: true)
          .snapshots();
    }
    // Return empty snapshot stream when user is null
    return Stream.empty();
  }

  Future<User?> signUpNewUsers(
      BuildContext context, String email, String password, String name) async {
    try {
      isLoading.value = true;

      // Create user with email and password
      UserCredential userCredential =
          await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Create user document in Firestore
      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'name': name,
        'email': email,
        'createdAt': FieldValue.serverTimestamp(),
        'lastLogin': FieldValue.serverTimestamp(),
        'enrolledCourses': [],
      });

      // Auto sign in after sign up
      await signInUsers(context, email, password);
      return userCredential.user;
    } on FirebaseAuthException catch (e) {
      String errorMessage;
      switch (e.code) {
        case 'email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'weak-password':
          errorMessage = 'The password is too weak.';
          break;
        default:
          errorMessage = 'An error occurred during registration: ${e.message}';
      }
      showErrorDialouge(context, errorMessage);
    } catch (e) {
      showErrorDialouge(context, 'An unexpected error occurred: $e');
    } finally {
      isLoading.value = false;
    }
    return null;
  }

  Future<User?> signInUsers(
      BuildContext context, String email, String password) async {
    try {
      isLoading.value = true;

      UserCredential userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Update last login time in Firestore
      await _firestore
          .collection('users')
          .doc(userCredential.user!.uid)
          .update({
        'lastLogin': FieldValue.serverTimestamp(),
      });

      return userCredential.user;
    } on FirebaseAuthException catch (e) {
      String errorMessage;
      switch (e.code) {
        case 'user-not-found':
          errorMessage = 'No user found with this email.';
          break;
        case 'wrong-password':
          errorMessage = 'Wrong password provided.';
          break;
        case 'invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'user-disabled':
          errorMessage = 'This user account has been disabled.';
          break;
        default:
          errorMessage = 'An error occurred during sign in: ${e.message}';
      }
      showErrorDialouge(context, errorMessage);
    } catch (e) {
      showErrorDialouge(context, 'An unexpected error occurred: $e');
    } finally {
      isLoading.value = false;
    }
    return null;
  }

  Future<bool> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      return true;
    } on FirebaseAuthException catch (e) {
      debugPrint('Error resetting password: ${e.message}');
      return false;
    }
  }

  Future<void> signOutUsers() async {
    try {
      isLoading.value = true;
      await _auth.signOut();
    } catch (e) {
      showErrorDialouge(Get.context!, 'Error signing out: ${e.toString()}');
    } finally {
      isLoading.value = false;
    }
  }
}
