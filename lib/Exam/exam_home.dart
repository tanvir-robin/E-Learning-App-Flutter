import 'package:flutter/material.dart';
import 'package:online_cource_app/Utils/exam_tile.dart';

class ExamHome extends StatelessWidget {
  const ExamHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Exam'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Text('Choose your desired Exam'),
            const SizedBox(
              height: 10,
            ),
            ListView(
              shrinkWrap: true,
              children: [
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
            )
          ],
        ),
      ),
    );
  }
}
