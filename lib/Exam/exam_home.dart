import 'package:flutter/material.dart';
import 'package:online_cource_app/Utils/exam_tile.dart';

class ExamHome extends StatelessWidget {
  const ExamHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: const Text(
          'Examinations',
          style: TextStyle(
            color: Color(0xFF333333),
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        iconTheme: const IconThemeData(color: Color(0xFF333333)),
      ),
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Choose your exam',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF555555),
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Select from our curated list of assessments to test your knowledge',
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF888888),
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: ListView(
                  children: const [
                    ExamTile(
                        name: 'Basic Knowledge',
                        timne: '30 Seconds',
                        question: '3',
                        questionAssetName: 'images/question.json'),
                    ExamTile(
                        name: 'Mobile App Development',
                        timne: '5 Min',
                        question: '10',
                        questionAssetName: 'images/mobile_app.json'),
                    ExamTile(
                        name: 'Web Development',
                        timne: '3 Min',
                        question: '5',
                        questionAssetName: 'images/web_dev.json'),
                    ExamTile(
                        name: 'English Spoken',
                        timne: '9 Min',
                        question: '14',
                        questionAssetName: 'images/english_spoken.json'),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
