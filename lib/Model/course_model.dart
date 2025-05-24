class CourseModel {
  final String? id;
  final String cover;
  final String duration;
  final List<String> instructors;
  final String title;
  final String description;
  final double price;

  CourseModel({
    this.id,
    required this.cover,
    required this.duration,
    required this.instructors,
    required this.title,
    this.description = 'No description available', // Default value
    this.price = 0.0, // Default value
  });

  // fromJSON constructor with default values
  factory CourseModel.fromJson(Map<String, dynamic> json) {
    return CourseModel(
      id: json['id'] as String?,
      cover: json['cover'] as String,
      duration: json['duration'] as String,
      instructors: List<String>.from(json['instructor'] ?? []),
      title: json['title'] as String,
      description:
          json['description'] ?? 'No description available', // Default value
      price: json['price'] != null
          ? (json['price'] as num).toDouble()
          : 1400.0, // Default value
    );
  }

  // toJSON method for converting the object back to JSON format
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'cover': cover,
      'duration': duration,
      'instructor': instructors,
      'title': title,
      'description': description,
      'price': price,
    };
  }
}
