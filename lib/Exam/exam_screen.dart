import 'dart:async'; // Add this import
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart' as rootBundle;
import 'package:online_cource_app/question_model.dart';
import 'package:confetti/confetti.dart'; // Add this import

class ExamScreen extends StatefulWidget {
  ExamScreen({required this.questionPath});
  final String questionPath;
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
  late AnimationController _controller;
  late Animation<Offset> _offsetAnimation;
  int score = 0;
  late ConfettiController _confettiController; // Add this controller
  late Timer _timer; // Add this line
  int _remainingTime = 0; // Add this line

  @override
  void initState() {
    super.initState();
    futureQuestions = loadQuestions(widget.questionPath);
    futureQuestions.then((questionList) {
      setState(() {
        questions = questionList.questions;
        _remainingTime = questions.length * 10; // 10 seconds per question
        startTimer(); // Start the timer
      });
    });

    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _offsetAnimation = Tween<Offset>(
      begin: Offset(1.0, 0.0),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _confettiController = ConfettiController(
        duration:
            const Duration(milliseconds: 700)); // Initialize ConfettiController
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
        _confettiController.play(); // Play confetti animation
      }
    });
  }

  void _nextQuestion() {
    if (currentIndex < questions.length - 1) {
      _controller.reverse().then((_) {
        setState(() {
          showResult = false;
          selectedOption = null;
          currentIndex++;
        });
        _controller.forward();
      });
    } else {
      _endExam();
    }
  }

  void _endExam() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) =>
            ScoreScreen(score: score, total: questions.length),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _confettiController.dispose(); // Dispose ConfettiController
    _timer.cancel(); // Dispose timer
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
                      'You have completed the exam!',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 20),
                    Text(
                      'Your score is $score / ${questions.length}',
                      style: TextStyle(fontSize: 20),
                    ),
                  ],
                ),
              );
            }

            final question = questions[currentIndex];
            _controller.forward();

            return SlideTransition(
              position: _offsetAnimation,
              child: Stack(
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Text(
                          'Time: $_remainingTime seconds',
                          style: TextStyle(
                            fontSize: 36,
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
                            fontSize: 36,
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
                              fontSize: 24, fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      ...question.options.asMap().entries.map((entry) {
                        final index = entry.key;
                        final option = entry.value;
                        return Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16.0, vertical: 8.0),
                          child: GestureDetector(
                            onTap: () {
                              if (!showResult) {
                                _checkAnswer(index, question.correctAnswer);
                              }
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: showResult
                                      ? (index == question.correctAnswer
                                          ? Colors.green
                                          : (index == selectedOption
                                              ? Colors.red
                                              : Colors.grey))
                                      : Colors.grey,
                                ),
                                borderRadius: BorderRadius.circular(12),
                                color: showResult
                                    ? (index == question.correctAnswer
                                        ? Colors.green[100]
                                        : (index == selectedOption
                                            ? Colors.red[100]
                                            : Colors.grey[300]))
                                    : Colors.white,
                              ),
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      option,
                                      style: TextStyle(fontSize: 18),
                                    ),
                                  ),
                                  if (showResult)
                                    Icon(
                                      index == question.correctAnswer
                                          ? Icons.check_circle
                                          : Icons.cancel,
                                      color: index == question.correctAnswer
                                          ? Colors.green
                                          : Colors.red,
                                    ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                      if (showResult)
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            isCorrect ? 'Correct!' : 'Wrong!',
                            style: TextStyle(
                              color: isCorrect ? Colors.green : Colors.red,
                              fontSize: 20,
                            ),
                          ),
                        ),
                      ElevatedButton(
                        onPressed: _nextQuestion,
                        child: Text('Next'),
                      ),
                    ],
                  ),
                  Align(
                    alignment: Alignment.topCenter,
                    child: ConfettiWidget(
                      confettiController: _confettiController,
                      blastDirection: -3.14 / 2, // upwards
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
              ),
            );
          }
        },
      ),
    );
  }
}

class ScoreScreen extends StatelessWidget {
  final int score;
  final int total;

  const ScoreScreen({Key? key, required this.score, required this.total})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Your Score'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Your Score',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              '$score / $total',
              style: TextStyle(fontSize: 20),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('Back to Home'),
            ),
          ],
        ),
      ),
    );
  }
}

// Function to load and parse JSON data
Future<QuestionList> loadQuestions(String path) async {
  // Load JSON file from assets
  final jsonString = await rootBundle.rootBundle.loadString(path);

  // Decode JSON string to a Map
  final jsonResponse = json.decode(jsonString);

  // Parse the JSON data using the QuestionList model
  return QuestionList.fromJson(jsonResponse);
}
