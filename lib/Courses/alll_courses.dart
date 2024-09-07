import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Courses/course_details.dart';
import 'package:online_cource_app/Model/course_model.dart';

class CourseListPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Courses'),
      ),
      body: StreamBuilder(
        stream: FirebaseFirestore.instance.collection('courses').snapshots(),
        builder: (context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          var courses = snapshot.data!.docs;

          return ListView.builder(
            itemCount: courses.length,
            itemBuilder: (context, index) {
              var course = CourseModel.fromJson(
                  courses[index].data() as Map<String, dynamic>);

              return CourseCard(
                course: course,
              );
            },
          );
        },
      ),
    );
  }
}

class CourseCard extends StatelessWidget {
  final CourseModel course;
  CourseCard({
    required this.course,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Get.to(() => CourseDetailsPage(course: course));
      },
      child: Card(
        margin: const EdgeInsets.all(10.0),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(15.0),
          child: Stack(
            children: [
              Image.network(
                course.cover,
                fit: BoxFit.cover,
                width: double.infinity,
                height: 200.0,
              ),
              Container(
                width: double.infinity,
                height: 200.0,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black54],
                  ),
                ),
              ),
              Positioned(
                bottom: 10.0,
                left: 10.0,
                right: 10.0,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            offset: Offset(2.0, 2.0),
                            blurRadius: 3.0,
                            color: Colors.black,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'Duration: ${course.duration}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                        shadows: [
                          Shadow(
                            offset: Offset(2.0, 2.0),
                            blurRadius: 3.0,
                            color: Colors.black,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'Instructor: ${course.instructors.join(', ')}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                        shadows: [
                          Shadow(
                            offset: Offset(2.0, 2.0),
                            blurRadius: 3.0,
                            color: Colors.black,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
