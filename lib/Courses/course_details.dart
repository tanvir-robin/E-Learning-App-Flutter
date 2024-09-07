import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:online_cource_app/Utils/enroll_dioulouge.dart';
import 'package:timeline_tile/timeline_tile.dart';
import 'package:online_cource_app/Model/course_model.dart';

class CourseDetailsPage extends StatelessWidget {
  final CourseModel course;

  CourseDetailsPage({required this.course});

  final List<TimelineItem> timelineItems = [
    TimelineItem(
        'Week 1', 'Basics', 'Introduction to fundamentals.', Icons.school),
    TimelineItem(
        'Week 2', 'Setup', 'Environment setup for learning.', Icons.computer),
    TimelineItem('Week 3', 'Intermediate', 'Going deeper into the course.',
        Icons.settings),
    TimelineItem(
        'Week 4', 'Advanced', 'Advanced topics and techniques.', Icons.science),
    TimelineItem('Week 5', 'Final Project', 'Real-world project application.',
        Icons.star),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // The scrollable content
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 300.0,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    course.title,
                    style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: Colors.white),
                  ),
                  background: _buildCoverImage(),
                ),
                backgroundColor: Colors.teal,
                elevation: 10.0,
              ),
              SliverList(
                delegate: SliverChildListDelegate(
                  [
                    _buildCourseInfo(),
                    _buildInstructorsSection(),
                    _buildDescriptionSection(),
                    _buildTimelineSection(),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),

          // The fixed bottom section for price and button
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Price section
                  Text(
                    'BDT ${course.price.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                  // Buy Now button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          vertical: 16, horizontal: 32),
                      backgroundColor: Colors.blueAccent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () {
                      // print(FirebaseAuth.instance.currentUser?.uid);
                      showEnrollmentDialog(context, course);
                    },
                    child: Text(
                      'Buy Now',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCoverImage() {
    return Hero(
      tag: course.cover,
      child: Stack(
        children: [
          CachedNetworkImage(
            imageUrl: course.cover,
            placeholder: (context, url) =>
                Center(child: CircularProgressIndicator()),
            errorWidget: (context, url, error) => Icon(Icons.error),
            imageBuilder: (context, imageProvider) => Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: imageProvider,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.black.withOpacity(0.5), Colors.transparent],
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseInfo() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            course.title,
            style: GoogleFonts.poppins(
                fontSize: 28, fontWeight: FontWeight.bold, color: Colors.teal),
          ),
          SizedBox(height: 8),
          Text(
            'Duration: ${course.duration}',
            style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }

  Widget _buildInstructorsSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Instructors',
            style: GoogleFonts.poppins(
                fontSize: 22, fontWeight: FontWeight.w600, color: Colors.black),
          ),
          SizedBox(height: 8),
          Column(
            children: course.instructors.map((instructor) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 6.0),
                child: Text(
                  instructor,
                  style: GoogleFonts.poppins(
                      fontSize: 16, color: Colors.grey[800]),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildDescriptionSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Course Description',
            style: GoogleFonts.poppins(
                fontSize: 22, fontWeight: FontWeight.w600, color: Colors.black),
          ),
          SizedBox(height: 8),
          Text(
            course.description,
            style: GoogleFonts.poppins(fontSize: 16, color: Colors.grey[700]),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Learning Timeline',
            style: GoogleFonts.poppins(
                fontSize: 22, fontWeight: FontWeight.w600, color: Colors.black),
          ),
          SizedBox(height: 10),
          _buildTimelineTiles(),
        ],
      ),
    );
  }

  Widget _buildTimelineTiles() {
    return Column(
      children: List.generate(timelineItems.length, (index) {
        final item = timelineItems[index];
        final isFirst = index == 0;
        final isLast = index == timelineItems.length - 1;

        return TimelineTile(
          isFirst: isFirst,
          isLast: isLast,
          indicatorStyle: IndicatorStyle(
            width: 40,
            color: Colors.teal,
            iconStyle: IconStyle(
              iconData: item.icon,
              color: Colors.white,
            ),
          ),
          beforeLineStyle: LineStyle(color: Colors.teal, thickness: 4),
          afterLineStyle: LineStyle(color: Colors.teal, thickness: 4),
          endChild: _buildTimelineContent(item),
        );
      }),
    );
  }

  Widget _buildTimelineContent(TimelineItem item) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.week,
                style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.teal),
              ),
              SizedBox(height: 6),
              Text(
                item.title,
                style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black),
              ),
              SizedBox(height: 8),
              Text(
                item.description,
                style:
                    GoogleFonts.poppins(fontSize: 14, color: Colors.grey[700]),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Updated TimelineItem class to accommodate icons
class TimelineItem {
  final String week;
  final String title;
  final String description;
  final IconData icon;

  TimelineItem(this.week, this.title, this.description, this.icon);
}
