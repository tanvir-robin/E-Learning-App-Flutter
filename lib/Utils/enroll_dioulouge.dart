import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Model/course_model.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';
import 'package:online_cource_app/Utils/toast_messages.dart';

void showEnrollmentDialog(BuildContext context, CourseModel course) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (BuildContext context) {
      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 8,
        child: AnimatedOpacity(
          opacity: 1.0,
          duration: const Duration(milliseconds: 300),
          child: Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Confirm Enrollment',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.blueAccent,
                      ),
                ),
                const SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        course.cover,
                        width: 100,
                        height: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            course.title,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Duration: ${course.duration}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Instructors: ${course.instructors.join(', ')}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Price: BDT ${course.price.toStringAsFixed(2)}',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Colors.green,
                                      fontWeight: FontWeight.bold,
                                    ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            course.description,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          color: Colors.redAccent,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: () async {
                        // Handle the enrollment action here
                        showLoadingDialouge(
                            context, "Saving Changes. Please wait...");
                        FirebaseFirestore.instance
                            .collection('users')
                            .doc(FirebaseAuth.instance.currentUser?.uid)
                            .collection('enrollment')
                            .add(course.toJson());
                        Get.back();
                        Get.back();
                        showSuccessToast(context,
                            'You Have Successfully enrolled to the Course');
                      },
                      child: const Text(
                        'Enroll',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}
