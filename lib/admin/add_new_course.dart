import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';

class AddCourseScreen extends StatefulWidget {
  @override
  _AddCourseScreenState createState() => _AddCourseScreenState();
}

class _AddCourseScreenState extends State<AddCourseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firestore = FirebaseFirestore.instance;

  String _cover = '';
  String _title = '';
  String _duration = '';
  List<String> _instructors = [];
  String _tempInstructor = '';

  void _addCourse() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      try {
        // Show loading indicator
        EasyLoading.show(status: 'Adding course...');

        // Add the course to Firestore
        await _firestore.collection('courses').add({
          'cover': _cover,
          'title': _title,
          'duration': _duration,
          'instructor': _instructors,
        });

        // Hide loading indicator
        EasyLoading.dismiss();

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Course added successfully!')),
        );

        // Clear form
        _formKey.currentState!.reset();
        setState(() {
          _instructors = [];
        });
      } catch (e) {
        // Hide loading indicator
        EasyLoading.dismiss();

        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add course: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Add New Course',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Cover Image URL Input
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Cover Image URL',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a cover image URL';
                    }
                    return null;
                  },
                  onSaved: (value) {
                    _cover = value!;
                  },
                ),
                const SizedBox(height: 20),

                // Course Title Input
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Course Title',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a course title';
                    }
                    return null;
                  },
                  onSaved: (value) {
                    _title = value!;
                  },
                ),
                const SizedBox(height: 20),

                // Course Duration Input
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Duration',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the duration';
                    }
                    return null;
                  },
                  onSaved: (value) {
                    _duration = value!;
                  },
                ),
                const SizedBox(height: 20),

                // Instructor Input
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Instructors:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    ..._instructors.map(
                      (instructor) => ListTile(
                        title: Text(instructor),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                            setState(() {
                              _instructors.remove(instructor);
                            });
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            decoration: const InputDecoration(
                              labelText: 'Add Instructor',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (value) {
                              _tempInstructor = value;
                            },
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.add, color: Colors.green),
                          onPressed: () {
                            if (_tempInstructor.isNotEmpty) {
                              setState(() {
                                _instructors.add(_tempInstructor);
                                _tempInstructor = '';
                              });
                            }
                          },
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Add Course Button
                ElevatedButton(
                  onPressed: _addCourse,
                  child: const Text('Add Course'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
