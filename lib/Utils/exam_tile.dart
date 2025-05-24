import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Exam/exam_screen.dart';

class ExamTile extends StatelessWidget {
  final String name;
  final String timne;
  final String question;
  final String questionAssetName;

  const ExamTile({
    super.key,
    required this.name,
    required this.timne,
    required this.question,
    required this.questionAssetName,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            Get.to(() => ExamScreen(
                  questionPath: questionAssetName,
                  userName: "User Name", // Replace with actual user name
                  userEmail: "user@example.com", // Replace with actual email
                  examName: name,
                ));
          },
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              children: [
                Container(
                  height: 56,
                  width: 56,
                  decoration: BoxDecoration(
                    color: getExamColor(name).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Icon(
                      getExamIcon(name),
                      color: getExamColor(name),
                      size: 28,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF333333),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.timer_outlined,
                                size: 16,
                                color: Color(0xFF888888),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                timne,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFF888888),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Row(
                            children: [
                              const Icon(
                                Icons.quiz_outlined,
                                size: 16,
                                color: Color(0xFF888888),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                "$question Questions",
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFF888888),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: Color(0xFF888888),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color getExamColor(String examName) {
    switch (examName) {
      case 'Basic Knowledge':
        return Colors.blue;
      case 'Mobile App Development':
        return Colors.purple;
      case 'Web Development':
        return Colors.orange;
      case 'English Spoken':
        return Colors.green;
      default:
        return Colors.blueGrey;
    }
  }

  IconData getExamIcon(String examName) {
    switch (examName) {
      case 'Basic Knowledge':
        return Icons.lightbulb_outline;
      case 'Mobile App Development':
        return Icons.smartphone;
      case 'Web Development':
        return Icons.web;
      case 'English Spoken':
        return Icons.record_voice_over;
      default:
        return Icons.quiz;
    }
  }
}
