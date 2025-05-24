import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Courses/course_play.dart';
import 'package:online_cource_app/Utils/enroll_dioulouge.dart';
import 'package:timeline_tile/timeline_tile.dart';
import 'package:online_cource_app/Model/course_model.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';
import 'package:online_cource_app/theme/app_theme.dart';
import 'package:readmore/readmore.dart';

class EnhancedCourseDetailsPage extends StatefulWidget {
  final CourseModel course;

  const EnhancedCourseDetailsPage({Key? key, required this.course})
      : super(key: key);

  @override
  State<EnhancedCourseDetailsPage> createState() =>
      _EnhancedCourseDetailsPageState();
}

class _EnhancedCourseDetailsPageState extends State<EnhancedCourseDetailsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final AuthController _authController = Get.find<AuthController>();
  bool _isEnrolled = false;
  bool _isLoading = true;

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
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _checkEnrollment();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _checkEnrollment() async {
    setState(() {
      _isLoading = true;
    });

    final isEnrolled =
        await _authController.isEnrolledInCourse(widget.course.id ?? "");

    setState(() {
      _isEnrolled = isEnrolled;
      _isLoading = false;
    });
  }

  Future<void> _startCourse() async {
    // Navigate to the course player
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CoursePage(course: widget.course),
      ),
    );
  }

  Future<void> _enrollCourse() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final result = await _authController.enrollInCourse(
          widget.course.id ?? "", widget.course.price);

      if (result) {
        setState(() {
          _isEnrolled = true;
        });

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Successfully enrolled in the course!'),
            backgroundColor: AppTheme.successColor,
          ),
        );
      } else {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to enroll in the course. Please try again.'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              _buildSliverAppBar(),
              SliverList(
                delegate: SliverChildListDelegate([
                  _buildTabBar(),
                  _buildTabBarView(),
                  const SizedBox(height: 80), // Space for bottom action button
                ]),
              ),
            ],
          ),
          _buildBottomActionButton(),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          widget.course.title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        background: _buildCoverImage(),
      ),
      backgroundColor: AppTheme.primaryColor,
      leading: Container(
        margin: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          shape: BoxShape.circle,
        ),
        child: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      actions: [
        Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.3),
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.favorite_border, color: Colors.white),
            onPressed: () {
              // Add course to favorites
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Added to favorites!'),
                  duration: Duration(seconds: 1),
                ),
              );
            },
          ),
        ),
        Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.3),
            shape: BoxShape.circle,
          ),
          child: IconButton(
            icon: const Icon(Icons.share, color: Colors.white),
            onPressed: () {
              // Share course
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Sharing functionality coming soon!'),
                  duration: Duration(seconds: 1),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCoverImage() {
    return Hero(
      tag: widget.course.cover,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: widget.course.cover,
            placeholder: (context, url) => Container(
              color: Colors.grey[300],
              child: const Center(child: CircularProgressIndicator()),
            ),
            errorWidget: (context, url, error) => Container(
              color: Colors.grey[300],
              child: const Icon(Icons.error, size: 50),
            ),
            fit: BoxFit.cover,
          ),
          // Gradient overlay for better text visibility
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [
                  Colors.black.withOpacity(0.7),
                  Colors.transparent,
                ],
              ),
            ),
          ),
          // Course info overlay
          Positioned(
            bottom: 60,
            left: 16,
            right: 16,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.accentColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'BESTSELLER',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.star, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            '4.8',
                            style: GoogleFonts.poppins(
                              color: Colors.black,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  widget.course.duration,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      color: Colors.white,
      child: TabBar(
        controller: _tabController,
        labelColor: AppTheme.primaryColor,
        unselectedLabelColor: AppTheme.secondaryTextColor,
        indicatorColor: AppTheme.primaryColor,
        indicatorWeight: 3,
        tabs: const [
          Tab(text: 'Overview'),
          Tab(text: 'Content'),
          Tab(text: 'Reviews'),
        ],
      ),
    );
  }

  Widget _buildTabBarView() {
    return Container(
      color: Colors.white,
      constraints: BoxConstraints(
        minHeight: MediaQuery.of(context).size.height * 0.5,
      ),
      child: TabBarView(
        controller: _tabController,
        children: [
          _buildOverviewTab(),
          _buildContentTab(),
          _buildReviewsTab(),
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: AnimationConfiguration.toStaggeredList(
          duration: const Duration(milliseconds: 375),
          childAnimationBuilder: (widget) => SlideAnimation(
            verticalOffset: 50.0,
            child: FadeInAnimation(
              child: widget,
            ),
          ),
          children: [
            _buildCourseInfoSection(),
            const SizedBox(height: 24),
            _buildInstructorsSection(),
            const SizedBox(height: 24),
            _buildDescriptionSection(),
            const SizedBox(height: 24),
            _buildWhatYouWillLearnSection(),
            const SizedBox(height: 24),
            _buildRequirementsSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildContentTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Course Content',
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '5 sections • ${widget.course.duration} • 24 lectures',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: AppTheme.secondaryTextColor,
            ),
          ),
          const SizedBox(height: 24),
          _buildTimelineTiles(),
        ],
      ),
    );
  }

  Widget _buildReviewsTab() {
    // Sample reviews
    final reviews = [
      {
        'name': 'John Doe',
        'avatar': 'https://randomuser.me/api/portraits/men/32.jpg',
        'rating': 5,
        'date': '2 weeks ago',
        'comment':
            'This course exceeded my expectations! The instructor explains complex concepts in a simple way. Highly recommended for beginners.',
      },
      {
        'name': 'Sarah Johnson',
        'avatar': 'https://randomuser.me/api/portraits/women/44.jpg',
        'rating': 4,
        'date': '1 month ago',
        'comment':
            'Great content and structure. I would have given 5 stars if there were more practical exercises.',
      },
      {
        'name': 'Michael Brown',
        'avatar': 'https://randomuser.me/api/portraits/men/67.jpg',
        'rating': 5,
        'date': '3 months ago',
        'comment':
            'Best course on this subject I\'ve found. The instructor is knowledgeable and responsive to questions.',
      },
    ];

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.star, color: Colors.amber, size: 24),
              const SizedBox(width: 8),
              Text(
                '4.8',
                style: GoogleFonts.poppins(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '(243 reviews)',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: AppTheme.secondaryTextColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Rating bars
          _buildRatingBar(5, 0.7, '70%'),
          const SizedBox(height: 4),
          _buildRatingBar(4, 0.2, '20%'),
          const SizedBox(height: 4),
          _buildRatingBar(3, 0.05, '5%'),
          const SizedBox(height: 4),
          _buildRatingBar(2, 0.03, '3%'),
          const SizedBox(height: 4),
          _buildRatingBar(1, 0.02, '2%'),

          const SizedBox(height: 24),
          Text(
            'Reviews',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Review list
          ...reviews.map((review) => _buildReviewItem(review)).toList(),

          const SizedBox(height: 16),
          Center(
            child: TextButton(
              onPressed: () {
                // Show more reviews
              },
              child: Text(
                'See All Reviews',
                style: GoogleFonts.poppins(
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBar(int rating, double percentage, String text) {
    return Row(
      children: [
        SizedBox(
          width: 20,
          child: Text(
            '$rating',
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: AppTheme.secondaryTextColor,
            ),
          ),
        ),
        const SizedBox(width: 8),
        const Icon(Icons.star, color: Colors.amber, size: 16),
        const SizedBox(width: 8),
        Expanded(
          child: LinearProgressIndicator(
            value: percentage,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(Colors.amber),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 8),
        SizedBox(
          width: 40,
          child: Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: AppTheme.secondaryTextColor,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReviewItem(Map<String, dynamic> review) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundImage: NetworkImage(review['avatar']),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    review['name'],
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Row(
                    children: [
                      ...List.generate(
                        review['rating'],
                        (index) => const Icon(Icons.star,
                            color: Colors.amber, size: 14),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        review['date'],
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: AppTheme.secondaryTextColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            review['comment'],
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: AppTheme.textColor,
            ),
          ),
          const SizedBox(height: 8),
          const Divider(),
        ],
      ),
    );
  }

  Widget _buildCourseInfoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.course.title,
          style: GoogleFonts.poppins(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.textColor,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            _buildInfoChip(Icons.people, '${(243).toString()} students'),
            const SizedBox(width: 16),
            _buildInfoChip(Icons.access_time, widget.course.duration),
            const SizedBox(width: 16),
            _buildInfoChip(Icons.topic, '5 modules'),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.accentColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  const Icon(Icons.attach_money,
                      color: AppTheme.accentColor, size: 18),
                  const SizedBox(width: 4),
                  Text(
                    'BDT ${widget.course.price.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.accentColor,
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            TextButton.icon(
              onPressed: () {
                // Show certificate info
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Certificate'),
                    content: const Text(
                        'Complete this course to earn a certificate of completion.'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('OK'),
                      ),
                    ],
                  ),
                );
              },
              icon: const Icon(Icons.verified, color: AppTheme.primaryColor),
              label: Text(
                'Certificate',
                style: GoogleFonts.poppins(
                  color: AppTheme.primaryColor,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.secondaryTextColor, size: 16),
          const SizedBox(width: 4),
          Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: AppTheme.secondaryTextColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInstructorsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Instructors',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ...widget.course.instructors.map((instructor) {
          return ListTile(
            contentPadding: EdgeInsets.zero,
            leading: CircleAvatar(
              backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
              child: Text(
                instructor[0].toUpperCase(),
                style: GoogleFonts.poppins(
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              instructor,
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.w600,
              ),
            ),
            subtitle: Text(
              'Expert Instructor',
              style: GoogleFonts.poppins(
                fontSize: 12,
                color: AppTheme.secondaryTextColor,
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildDescriptionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Description',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        ReadMoreText(
          widget.course.description,
          trimLines: 4,
          colorClickableText: AppTheme.primaryColor,
          trimMode: TrimMode.Line,
          trimCollapsedText: 'Show more',
          trimExpandedText: 'Show less',
          style: GoogleFonts.poppins(
            fontSize: 14,
            color: AppTheme.textColor,
          ),
          moreStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
          lessStyle: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryColor,
          ),
        ),
      ],
    );
  }

  Widget _buildWhatYouWillLearnSection() {
    final learningPoints = [
      'Complete understanding of the subject',
      'Practical skills that you can apply immediately',
      'Real-world project experience',
      'Certificate of completion',
      'Lifetime access to course materials',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'What You Will Learn',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ...learningPoints.map((point) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check,
                    color: AppTheme.primaryColor,
                    size: 16,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    point,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: AppTheme.textColor,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildRequirementsSection() {
    final requirements = [
      'Basic knowledge of the subject',
      'A computer with internet connection',
      'Willingness to learn and practice',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Requirements',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ...requirements.map((requirement) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.circle,
                  color: AppTheme.secondaryTextColor,
                  size: 8,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    requirement,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: AppTheme.textColor,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ],
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
            color: AppTheme.primaryColor,
            iconStyle: IconStyle(
              iconData: item.icon,
              color: Colors.white,
            ),
          ),
          beforeLineStyle:
              LineStyle(color: AppTheme.primaryColor, thickness: 4),
          afterLineStyle: LineStyle(color: AppTheme.primaryColor, thickness: 4),
          endChild: _buildTimelineContent(item),
        );
      }),
    );
  }

  Widget _buildTimelineContent(TimelineItem item) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.week,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                item.title,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                item.description,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: AppTheme.secondaryTextColor,
                ),
              ),
              if (_isEnrolled)
                TextButton.icon(
                  onPressed: () {
                    // Start the lesson
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CoursePage(course: widget.course),
                      ),
                    );
                  },
                  icon: const Icon(Icons.play_circle_outline,
                      color: AppTheme.accentColor),
                  label: Text(
                    'Start Lesson',
                    style: GoogleFonts.poppins(
                      color: AppTheme.accentColor,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomActionButton() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _isEnrolled
                ? ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              CoursePage(course: widget.course),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                    icon: const Icon(Icons.play_arrow),
                    label: const Text('Continue Learning'),
                  )
                : ElevatedButton(
                    onPressed: () {
                      showEnrollmentDialog(context, widget.course);
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Enroll for BDT ${widget.course.price.toStringAsFixed(2)}',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }
}

class TimelineItem {
  final String week;
  final String title;
  final String description;
  final IconData icon;

  TimelineItem(this.week, this.title, this.description, this.icon);
}
