import 'package:flutter/material.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:online_cource_app/Model/course_model.dart';

class CourseViewPage extends StatefulWidget {
  final CourseModel course;

  const CourseViewPage({Key? key, required this.course}) : super(key: key);

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
            icon: Icon(Icons.fullscreen),
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
              duration: Duration(milliseconds: 300),
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
                        Center(
                          child: CircularProgressIndicator(
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
            ),
            SizedBox(height: 16),
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
                  SizedBox(height: 8),
                  Text(
                    'Duration: ${widget.course.duration}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[700]),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Instructors: ${widget.course.instructors.join(', ')}',
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[700]),
                  ),
                  SizedBox(height: 8),
                  Text(
                    widget.course.description,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: Colors.grey[600]),
                  ),
                  SizedBox(height: 16),
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
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.blueGrey[50],
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
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
          SizedBox(height: 12),
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
          SizedBox(height: 8),
          LinearProgressIndicator(
            value: 0.5,
            color: Colors.blue,
            backgroundColor: Colors.grey[300],
          ),
          SizedBox(height: 16),
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
          SizedBox(height: 8),
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

  const FullScreenVideoPage({Key? key, required this.chewieController})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Chewie(controller: chewieController),
      ),
    );
  }
}
