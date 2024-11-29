import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:online_cource_app/Exam/exam_screen.dart';

class ExamTile extends StatelessWidget {
  const ExamTile({
    super.key,
    required this.name,
    required this.timne,
    required this.question,
    required this.questionAssetName,
  });
  final String name;
  final String question;
  final String timne;
  final String questionAssetName;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => ExamScreen(
                      questionPath: questionAssetName,
                      examName: name,
                      userEmail: FirebaseAuth.instance.currentUser!.email!,
                      userName: 'Test',
                    )),
          );
        },
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        tileColor: Colors.grey.shade300,
        title: Text(
          name,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text('$question Questions | $timne'),
        trailing: IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => ExamScreen(
                          examName: name,
                          userEmail: FirebaseAuth.instance.currentUser!.email!,
                          userName: 'Test',
                          questionPath: questionAssetName,
                        )),
              );
            },
            icon: Image.asset('images/exam.png')),
      ),
    );
  }
}
