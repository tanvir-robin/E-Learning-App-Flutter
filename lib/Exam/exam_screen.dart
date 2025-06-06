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

  const ExamScreen({
    super.key,
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
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
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
                  style: const pw.TextStyle(
                      fontSize: 16, color: PdfColors.grey600),
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
                  style: const pw.TextStyle(
                      fontSize: 16, color: PdfColors.grey600),
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
                  style:
                      const pw.TextStyle(fontSize: 18, color: PdfColors.black),
                ),
                pw.SizedBox(height: 5),
                pw.Text(
                  'Date: ${DateFormat('dd MMMM yyyy').format(DateTime.now())}',
                  style: const pw.TextStyle(
                      fontSize: 14, color: PdfColors.grey600),
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
                          decoration: const pw.BoxDecoration(
                            border: pw.Border(
                              bottom: pw.BorderSide(color: PdfColors.grey),
                            ),
                          ),
                        ),
                        pw.Text(
                          'Authorized Signature',
                          style: const pw.TextStyle(
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
                          style: const pw.TextStyle(
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
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: Text(
          widget.examName,
          style: const TextStyle(
            color: Color(0xFF333333),
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: const IconThemeData(color: Color(0xFF333333)),
      ),
      body: FutureBuilder<QuestionList>(
        future: futureQuestions,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Color(0xFF5271FF)),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Loading Exam Questions...',
                    style: TextStyle(
                      color: Color(0xFF666666),
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: Colors.red,
                    size: 60,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading questions: ${snapshot.error}',
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF5271FF),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () => Get.back(),
                    child: const Text('Go Back'),
                  ),
                ],
              ),
            );
          } else {
            if (questions.isEmpty) {
              questions = snapshot.data!.questions;
            }

            if (currentIndex >= questions.length) {
              return _buildCompletionScreen();
            }

            final question = questions[currentIndex];
            return _buildExamContent(question);
          }
        },
      ),
    );
  }

  Widget _buildExamContent(Question question) {
    return Stack(
      children: [
        Column(
          children: [
            _buildProgressAndTimer(),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildQuestionCard(question),
                      const SizedBox(height: 16),
                      _buildOptionsGrid(question),
                      if (showResult) _buildResultFeedback(),
                      const SizedBox(height: 24),
                      if (showResult) _buildNextButton(),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        Align(
          alignment: Alignment.topCenter,
          child: ConfettiWidget(
            confettiController: _confettiController,
            blastDirectionality: BlastDirectionality.explosive,
            shouldLoop: false,
            colors: const [
              Colors.green,
              Colors.blue,
              Colors.pink,
              Colors.orange,
              Colors.purple
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildProgressAndTimer() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Question ${currentIndex + 1}/${questions.length}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF5271FF),
                ),
              ),
              Row(
                children: [
                  const Icon(
                    Icons.timer,
                    size: 20,
                    color: Colors.redAccent,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '$_remainingTime sec',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.redAccent,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: (currentIndex + 1) / questions.length,
            backgroundColor: const Color(0xFFE0E0E0),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF5271FF)),
            borderRadius: BorderRadius.circular(4),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionCard(Question question) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Question:',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Color(0xFF888888),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            question.question,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF333333),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOptionsGrid(Question question) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            'Select your answer:',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Color(0xFF888888),
            ),
          ),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: question.options.length,
          itemBuilder: (context, index) {
            final option = question.options[index];
            Color backgroundColor = Colors.white;
            Color borderColor = const Color(0xFFE0E0E0);

            if (showResult) {
              if (index == question.correctAnswer) {
                backgroundColor = Colors.green.shade50;
                borderColor = Colors.green;
              } else if (index == selectedOption) {
                backgroundColor = Colors.red.shade50;
                borderColor = Colors.red;
              }
            }

            return GestureDetector(
              onTap: () {
                if (!showResult) {
                  _checkAnswer(index, question.correctAnswer);
                }
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: borderColor, width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 8,
                      spreadRadius: 0,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      height: 36,
                      width: 36,
                      decoration: BoxDecoration(
                        color: showResult
                            ? (index == question.correctAnswer
                                ? Colors.green
                                : (index == selectedOption
                                    ? Colors.red
                                    : const Color(0xFFF0F0F0)))
                            : const Color(0xFFF0F0F0),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          String.fromCharCode(65 + index), // A, B, C, D...
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: showResult
                                ? (index == question.correctAnswer ||
                                        index == selectedOption
                                    ? Colors.white
                                    : const Color(0xFF666666))
                                : const Color(0xFF666666),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        option,
                        style: TextStyle(
                          fontSize: 16,
                          color: showResult
                              ? (index == question.correctAnswer
                                  ? Colors.green.shade700
                                  : (index == selectedOption
                                      ? Colors.red.shade700
                                      : const Color(0xFF333333)))
                              : const Color(0xFF333333),
                        ),
                      ),
                    ),
                    if (showResult)
                      Icon(
                        index == question.correctAnswer
                            ? Icons.check_circle
                            : (index == selectedOption ? Icons.cancel : null),
                        color: index == question.correctAnswer
                            ? Colors.green
                            : Colors.red,
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildResultFeedback() {
    return AnimatedOpacity(
      opacity: showResult ? 1.0 : 0.0,
      duration: const Duration(milliseconds: 300),
      child: Container(
        margin: const EdgeInsets.only(top: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isCorrect ? Colors.green.shade50 : Colors.red.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isCorrect ? Colors.green : Colors.red,
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isCorrect ? Icons.check_circle : Icons.cancel,
              color: isCorrect ? Colors.green : Colors.red,
              size: 28,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                isCorrect
                    ? 'Correct! Well done.'
                    : 'Incorrect. The correct answer is option ${String.fromCharCode(65 + questions[currentIndex].correctAnswer)}.',
                style: TextStyle(
                  fontSize: 16,
                  color:
                      isCorrect ? Colors.green.shade700 : Colors.red.shade700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNextButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32.0),
      child: ElevatedButton(
        onPressed: _nextQuestion,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF5271FF),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          minimumSize: const Size(double.infinity, 54),
          elevation: 0,
        ),
        child: Text(
          currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildCompletionScreen() {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/certificate.png', // Add this image to your assets
            height: 180,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return const Icon(
                Icons.emoji_events,
                size: 120,
                color: Color(0xFF5271FF),
              );
            },
          ),
          const SizedBox(height: 32),
          const Text(
            'Exam Completed!',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Color(0xFF333333),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(24),
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
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Score: ',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey.shade700,
                      ),
                    ),
                    Text(
                      '$score/${questions.length}',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF5271FF),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Your certificate has been generated and sent to your email.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF666666),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  widget.userEmail,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF5271FF),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          ElevatedButton(
            onPressed: () => Get.back(),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF5271FF),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              minimumSize: const Size(double.infinity, 54),
              elevation: 0,
            ),
            child: const Text(
              'Back to Exams',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<QuestionList> loadQuestions(String path) async {
    final jsonData = await rootBundle.rootBundle.loadString(path);
    return QuestionList.fromJson(json.decode(jsonData));
  }
}
