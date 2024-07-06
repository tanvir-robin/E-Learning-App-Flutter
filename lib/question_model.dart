import 'package:json_annotation/json_annotation.dart';

part 'question_model.g.dart';

@JsonSerializable()
class Question {
  final String question;
  final List<String> options;
  final int correctAnswer;

  Question({
    required this.question,
    required this.options,
    required this.correctAnswer,
  });

  factory Question.fromJson(Map<String, dynamic> json) =>
      _$QuestionFromJson(json);
  Map<String, dynamic> toJson() => _$QuestionToJson(this);
}

@JsonSerializable()
class QuestionList {
  final List<Question> questions;

  QuestionList({required this.questions});

  factory QuestionList.fromJson(Map<String, dynamic> json) =>
      _$QuestionListFromJson(json);
  Map<String, dynamic> toJson() => _$QuestionListToJson(this);
}
