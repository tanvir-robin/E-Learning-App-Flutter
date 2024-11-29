import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' as rootBundle;
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';
import 'package:online_cource_app/Utils/email_helper.dart';
import 'package:online_cource_app/question_model.dart';
import 'package:confetti/confetti.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

class ExamScreen extends StatefulWidget {
  final String questionPath;
  final String userName;
  final String userEmail;
  final String examName;

  ExamScreen({
    required this.questionPath,
    required this.userName,
    required this.userEmail,
    required this.examName,
  });

  @override
  _ExamScreenState createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen>
    with SingleTickerProviderStateMixin {
  late Future<QuestionList> futureQuestions;
  int currentIndex = 0;
  bool showResult = false;
  bool isCorrect = false;
  int? selectedOption;
  List<Question> questions = [];
  int score = 0;
  late ConfettiController _confettiController;
  late Timer _timer;
  int _remainingTime = 0;

  @override
  void initState() {
    super.initState();
    futureQuestions = loadQuestions(widget.questionPath);
    futureQuestions.then((questionList) {
      setState(() {
        questions = questionList.questions;
        _remainingTime = questions.length * 10; // 10 seconds per question
        startTimer();
      });
    });
    _confettiController =
        ConfettiController(duration: const Duration(milliseconds: 700));
  }

  void startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingTime > 0) {
          _remainingTime--;
        } else {
          _timer.cancel();
          _endExam();
        }
      });
    });
  }

  void _checkAnswer(int selectedIndex, int correctIndex) {
    setState(() {
      showResult = true;
      isCorrect = selectedIndex == correctIndex;
      selectedOption = selectedIndex;
      if (isCorrect) {
        score++;
        _confettiController.play();
      }
    });
  }

  void _nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setState(() {
        showResult = false;
        selectedOption = null;
        currentIndex++;
      });
    } else {
      _endExam();
    }
  }

  void _endExam() async {
    showLoadingDialouge(context, 'Analyzing Results...');
    await _generateAndSendPDF();
    setState(() {
      currentIndex = questions.length; // Show final score screen
    });
    Get.back();
  }

  Future<void> _generateAndSendPDF() async {
    final pdf = pw.Document();
    final output = await getTemporaryDirectory();
    final file = File("${output.path}/certificate.pdf");

    final logo = await rootBundle.rootBundle.load('assets/logo.png');
    final logoImage = pw.MemoryImage(logo.buffer.asUint8List());

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4.landscape,
        build: (context) => pw.Center(
          child: pw.Container(
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.grey, width: 2),
              borderRadius: pw.BorderRadius.circular(10),
            ),
            padding: const pw.EdgeInsets.all(20),
            child: pw.Column(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              crossAxisAlignment: pw.CrossAxisAlignment.center,
              children: [
                // Logo and Header
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.SizedBox(width: 100),
                    pw.Image(logoImage, height: 80),
                    pw.SizedBox(width: 100), // Placeholder for symmetry
                  ],
                ),
                pw.SizedBox(height: 20),
                pw.Text(
                  'Certificate of Completion',
                  style: pw.TextStyle(
                    fontSize: 28,
                    fontWeight: pw.FontWeight.bold,
                    color: PdfColors.blueGrey900,
                  ),
                ),
                pw.Divider(thickness: 1.5, color: PdfColors.grey700),
                pw.SizedBox(height: 15),

                // Recipient's Name
                pw.Text(
                  'This is to certify that',
                  style: pw.TextStyle(fontSize: 16, color: PdfColors.grey600),
                ),
                pw.SizedBox(height: 5),
                pw.Text(
                  widget.userName,
                  style: pw.TextStyle(
                    fontSize: 24,
                    fontWeight: pw.FontWeight.bold,
                    fontStyle: pw.FontStyle.italic,
                    color: PdfColors.black,
                  ),
                ),
                pw.SizedBox(height: 10),
                pw.Text(
                  'has successfully completed the exam:',
                  style: pw.TextStyle(fontSize: 16, color: PdfColors.grey600),
                ),
                pw.SizedBox(height: 5),
                pw.Text(
                  widget.examName,
                  style: pw.TextStyle(
                    fontSize: 20,
                    fontWeight: pw.FontWeight.bold,
                    color: PdfColors.blueGrey900,
                  ),
                ),
                pw.SizedBox(height: 15),

                // Score and Date
                pw.Text(
                  'Achieved a score of $score / ${questions.length}.',
                  style: pw.TextStyle(fontSize: 18, color: PdfColors.black),
                ),
                pw.SizedBox(height: 5),
                pw.Text(
                  'Date: ${DateFormat('dd MMMM yyyy').format(DateTime.now())}',
                  style: pw.TextStyle(fontSize: 14, color: PdfColors.grey600),
                ),
                pw.SizedBox(height: 30),

                // Footer with signature
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceAround,
                  children: [
                    // Placeholder for signature
                    pw.Column(
                      children: [
                        pw.Container(
                          height: 50,
                          width: 150,
                          decoration: pw.BoxDecoration(
                            border: pw.Border(
                              bottom: pw.BorderSide(color: PdfColors.grey),
                            ),
                          ),
                        ),
                        pw.Text(
                          'Authorized Signature',
                          style: pw.TextStyle(
                              fontSize: 12, color: PdfColors.grey600),
                        ),
                      ],
                    ),
                    // Placeholder for stamp
                    pw.Container(
                      height: 50,
                      width: 50,
                      decoration: pw.BoxDecoration(
                        shape: pw.BoxShape.circle,
                        border: pw.Border.all(color: PdfColors.grey),
                      ),
                      child: pw.Center(
                        child: pw.Text(
                          'Stamp',
                          style: pw.TextStyle(
                              fontSize: 12, color: PdfColors.grey600),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );

    await file.writeAsBytes(await pdf.save());
    await CertificationEmailService().sendCertification(
        receiverEmail: widget.userEmail,
        pdfFile: file,
        candidateName: widget.userName,
        examName: widget.examName,
        score: '$score / ${questions.length}',
        examDate: DateFormat('h:mm a, d MMM, yyyy').format(DateTime.now()));
  }

  @override
  void dispose() {
    _confettiController.dispose();
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('MCQ Exam'),
      ),
      body: FutureBuilder<QuestionList>(
        future: futureQuestions,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error loading questions'));
          } else {
            if (questions.isEmpty) {
              questions = snapshot.data!.questions;
            }

            if (currentIndex >= questions.length) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Exam Completed!',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 20),
                    Text(
                      'Your final score is $score / ${questions.length} \nYou will find your certificate in your email.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 20),
                    ),
                  ],
                ),
              );
            }

            final question = questions[currentIndex];

            return Stack(
              children: [
                Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Time: $_remainingTime seconds',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'Question ${currentIndex + 1} of ${questions.length}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        question.question,
                        style: TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    Expanded(
                      child: ListView.builder(
                        itemCount: question.options.length,
                        itemBuilder: (context, index) {
                          final option = question.options[index];
                          return Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16.0, vertical: 8.0),
                            child: GestureDetector(
                              onTap: () {
                                if (!showResult) {
                                  _checkAnswer(index, question.correctAnswer);
                                }
                              },
                              child: Card(
                                color: showResult
                                    ? (index == question.correctAnswer
                                        ? Colors.green[100]
                                        : (index == selectedOption
                                            ? Colors.red[100]
                                            : Colors.white))
                                    : Colors.white,
                                elevation: 6,
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Center(
                                    child: Text(
                                      option,
                                      style: TextStyle(
                                          fontSize: 18, color: Colors.black),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    if (showResult)
                      ElevatedButton(
                        onPressed: _nextQuestion,
                        child: Text(currentIndex < questions.length - 1
                            ? 'Next Question'
                            : 'Finish Exam'),
                      ),
                  ],
                ),
                Align(
                  alignment: Alignment.topCenter,
                  child: ConfettiWidget(
                    confettiController: _confettiController,
                    blastDirectionality: BlastDirectionality.explosive,
                    shouldLoop: false,
                    colors: [Colors.green, Colors.blue, Colors.orange],
                  ),
                ),
              ],
            );
          }
        },
      ),
    );
  }

  Future<QuestionList> loadQuestions(String path) async {
    final jsonData = await rootBundle.rootBundle.loadString(path);
    return QuestionList.fromJson(json.decode(jsonData));
  }
}
