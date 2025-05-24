// File: course_play.dart
import 'package:flutter/material.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:online_cource_app/Model/course_model.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';
import 'package:online_cource_app/theme/app_theme.dart';

class CourseViewPage extends StatefulWidget {
  final CourseModel course;

  const CourseViewPage({super.key, required this.course});

  @override
  _CourseViewPageState createState() => _CourseViewPageState();
}

class _CourseViewPageState extends State<CourseViewPage> {
  late VideoPlayerController _videoController;
  ChewieController? _chewieController;
  bool _isFullScreen = false;
  bool _isVideoLoaded = false;

  @override
  void initState() {
    super.initState();
    _initializeVideoPlayer();
  }

  Future<void> _initializeVideoPlayer() async {
    final videoUrl = await _getVideoUrl();
    _videoController = VideoPlayerController.network(videoUrl)
      ..initialize().then((_) {
        setState(() {
          _chewieController = ChewieController(
            videoPlayerController: _videoController,
            autoPlay: true,
            looping: false,
            showControls: true,
            allowFullScreen: true,
            materialProgressColors: ChewieProgressColors(
              playedColor: Colors.blue,
              handleColor: Colors.blue,
              backgroundColor: Colors.grey,
              bufferedColor: Colors.lightBlueAccent,
            ),
            fullScreenByDefault: false,
          );
          _isVideoLoaded = true;
        });
      });
  }

  Future<String> _getVideoUrl() async {
    final ref = FirebaseStorage.instance.ref().child('demo/demo.mp4');
    return await ref.getDownloadURL();
  }

  @override
  void dispose() {
    _videoController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.course.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.fullscreen),
            onPressed: () {
              setState(() {
                _isFullScreen = !_isFullScreen;
              });
              if (_isFullScreen) {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => FullScreenVideoPage(
                      chewieController: _chewieController!,
                    ),
                  ),
                );
              }
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _isVideoLoaded
                  ? Container(
                      color: Colors.black,
                      width: double.infinity,
                      height: _isFullScreen
                          ? MediaQuery.of(context).size.height
                          : 250,
                      child: Chewie(controller: _chewieController!),
                    )
                  : Stack(
                      children: [
                        Container(
                          color: Colors.grey[800],
                          width: double.infinity,
                          height: _isFullScreen
                              ? MediaQuery.of(context).size.height
                              : 250,
                          child: Center(
                            child: Image.network(
                              widget.course.cover,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const Center(
                          child: CircularProgressIndicator(
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.course.title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold, color: Colors.black87),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Duration: ${widget.course.duration}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[700]),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Instructors: ${widget.course.instructors.join(', ')}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[700]),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.course.description,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 16),
                  _buildLectureProgressSection(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLectureProgressSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blueGrey[50],
        borderRadius: BorderRadius.circular(8),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Lecture Progress',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold, color: Colors.blueGrey[800]),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Lecture 1: Introduction',
                  style: Theme.of(context).textTheme.bodySmall),
              Text('50% completed',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: Colors.green)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: 0.5,
            color: Colors.blue,
            backgroundColor: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Lecture 2: Basics of Flutter',
                  style: Theme.of(context).textTheme.bodySmall),
              Text('20% completed',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: Colors.orange)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: 0.2,
            color: Colors.orange,
            backgroundColor: Colors.grey[300],
          ),
        ],
      ),
    );
  }
}

class FullScreenVideoPage extends StatelessWidget {
  final ChewieController chewieController;

  const FullScreenVideoPage({super.key, required this.chewieController});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Chewie(controller: chewieController),
      ),
    );
  }
}

class CoursePage extends StatefulWidget {
  final CourseModel course;

  const CoursePage({Key? key, required this.course}) : super(key: key);

  @override
  State<CoursePage> createState() => _CoursePageState();
}

class _CoursePageState extends State<CoursePage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final AuthController _authController = Get.find<AuthController>();
  bool _isLoading = true;
  double _currentProgress = 0.0;
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;

  // Sample video URL
  final String _sampleVideoUrl =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadCourseData();
    _initializeVideoPlayer();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _videoPlayerController?.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  Future<void> _loadCourseData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulating loading course data
      await Future.delayed(const Duration(seconds: 1));

      // In a real app, you'd fetch the user's progress for this course
      _currentProgress = 0.25; // 25% completion as an example

      // Update the progress in the database if course has an ID
      if (widget.course.id != null) {
        await _authController.updateCourseProgress(
            widget.course.id!, _currentProgress);
      }
    } catch (e) {
      debugPrint('Error loading course data: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _initializeVideoPlayer() async {
    _videoPlayerController = VideoPlayerController.network(_sampleVideoUrl);

    await _videoPlayerController!.initialize();

    _chewieController = ChewieController(
      videoPlayerController: _videoPlayerController!,
      autoPlay: false,
      looping: false,
      aspectRatio: 16 / 9,
      placeholder: Container(
        color: Colors.black,
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
      materialProgressColors: ChewieProgressColors(
        playedColor: AppTheme.primaryColor,
        handleColor: AppTheme.primaryColor,
        backgroundColor: Colors.grey[300]!,
        bufferedColor: AppTheme.primaryColor.withOpacity(0.3),
      ),
    );

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text(
          widget.course.title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: AppTheme.secondaryTextColor,
          indicatorColor: AppTheme.primaryColor,
          indicatorWeight: 3,
          tabs: const [
            Tab(text: 'Lessons'),
            Tab(text: 'Resources'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Video player
                _chewieController != null &&
                        _chewieController!
                            .videoPlayerController.value.isInitialized
                    ? AspectRatio(
                        aspectRatio: 16 / 9,
                        child: Chewie(controller: _chewieController!),
                      )
                    : AspectRatio(
                        aspectRatio: 16 / 9,
                        child: Container(
                          color: Colors.black,
                          child: const Center(
                            child: CircularProgressIndicator(),
                          ),
                        ),
                      ),

                // Progress indicator
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.white,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your Progress',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: _currentProgress,
                        backgroundColor: Colors.grey[200],
                        valueColor:
                            AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
                        minHeight: 10,
                        borderRadius: BorderRadius.circular(5),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${(_currentProgress * 100).toInt()}% Complete',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: AppTheme.secondaryTextColor,
                        ),
                      ),
                    ],
                  ),
                ),

                // Tab content
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildLessonsTab(),
                      _buildResourcesTab(),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildLessonsTab() {
    // Sample lessons
    final lessons = [
      {
        'title': 'Introduction to the Course',
        'duration': '10 min',
        'isCompleted': true,
        'isCurrent': false,
      },
      {
        'title': 'Getting Started with the Basics',
        'duration': '15 min',
        'isCompleted': true,
        'isCurrent': false,
      },
      {
        'title': 'Core Concepts Explained',
        'duration': '20 min',
        'isCompleted': false,
        'isCurrent': true,
      },
      {
        'title': 'Advanced Techniques',
        'duration': '25 min',
        'isCompleted': false,
        'isCurrent': false,
      },
      {
        'title': 'Real-world Applications',
        'duration': '30 min',
        'isCompleted': false,
        'isCurrent': false,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: lessons.length,
      itemBuilder: (context, index) {
        final lesson = lessons[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: lesson['isCompleted'] == true
                    ? AppTheme.accentColor
                    : lesson['isCurrent'] == true
                        ? AppTheme.primaryColor
                        : Colors.grey[300],
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  lesson['isCompleted'] == true
                      ? Icons.check
                      : Icons.play_arrow,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
            title: Text(
              lesson['title'].toString(),
              style: GoogleFonts.poppins(
                fontWeight: lesson['isCurrent'] == true
                    ? FontWeight.bold
                    : FontWeight.normal,
              ),
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                lesson['duration'].toString(),
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: AppTheme.secondaryTextColor,
                ),
              ),
            ),
            trailing: lesson['isCurrent'] == true
                ? Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Current',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  )
                : null,
            onTap: () {
              // Play the selected lesson
              setState(() {
                for (var i = 0; i < lessons.length; i++) {
                  lessons[i]['isCurrent'] = i == index;
                }
              });
            },
          ),
        );
      },
    );
  }

  Widget _buildResourcesTab() {
    // Sample resources
    final resources = [
      {
        'title': 'Course Slides',
        'type': 'PDF',
        'size': '2.5 MB',
        'icon': Icons.picture_as_pdf,
      },
      {
        'title': 'Exercise Files',
        'type': 'ZIP',
        'size': '4.2 MB',
        'icon': Icons.folder_zip,
      },
      {
        'title': 'Additional Reading',
        'type': 'PDF',
        'size': '1.8 MB',
        'icon': Icons.picture_as_pdf,
      },
      {
        'title': 'Source Code',
        'type': 'ZIP',
        'size': '3.7 MB',
        'icon': Icons.code,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: resources.length,
      itemBuilder: (context, index) {
        final resource = resources[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppTheme.primaryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  resource['icon'] as IconData,
                  color: AppTheme.primaryColor,
                  size: 20,
                ),
              ),
            ),
            title: Text(
              resource['title'].toString(),
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.w500,
              ),
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                '${resource['type']} • ${resource['size']}',
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  color: AppTheme.secondaryTextColor,
                ),
              ),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.download, color: AppTheme.primaryColor),
              onPressed: () {
                // Download the resource
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Downloading ${resource['title']}...'),
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
            ),
            onTap: () {
              // Open the resource
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Opening ${resource['title']}...'),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
