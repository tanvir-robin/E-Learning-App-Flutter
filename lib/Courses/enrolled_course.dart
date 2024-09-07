import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Courses/course_play.dart';
import 'package:online_cource_app/Model/course_model.dart'; // Import Firestore if you're using it

class EnrolledCourseItem extends StatelessWidget {
  final CourseModel course;

  const EnrolledCourseItem({Key? key, required this.course}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Get.to(() => CourseViewPage(
              course: course,
            ));
      },
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 5,
        margin: EdgeInsets.all(8),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  course.cover,
                  width: double.infinity,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(height: 8),
              Text(
                course.title,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              SizedBox(height: 4),
              Text(
                'Instructors: ${course.instructors.join(', ')}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class EnrolledCoursesScreen extends StatelessWidget {
  const EnrolledCoursesScreen({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Enrolled Courses'),
      ),
      body: StreamBuilder<List<CourseModel>>(
        stream: getCoursesStream(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No enrolled courses found.'));
          }

          final courses = snapshot.data!;

          return GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 0.75, // Adjust aspect ratio for better fit
            ),
            itemCount: courses.length,
            itemBuilder: (context, index) {
              final course = courses[index];
              return EnrolledCourseItem(course: course);
            },
          );
        },
      ),
    );
  }
}

Stream<List<CourseModel>> getCoursesStream() {
  return FirebaseFirestore.instance
      .collection('users')
      .doc(FirebaseAuth.instance.currentUser?.uid)
      .collection('enrollment')
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map(
              (doc) => CourseModel.fromJson(doc.data() as Map<String, dynamic>))
          .toList());
}
