import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:video_player/video_player.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../services/playback_authorization_service.dart';

class QrayatiVideoPlayer extends StatefulWidget {
  final PlaybackAuthorizationToken authToken;
  final String title;
  final VoidCallback? onEnded;
  final Function(Duration current, Duration total)? onProgress;

  const QrayatiVideoPlayer({
    Key? key,
    required this.authToken,
    required this.title,
    this.onEnded,
    this.onProgress,
  }) : super(key: key);

  @override
  State<QrayatiVideoPlayer> createState() => _QrayatiVideoPlayerState();
}

class _QrayatiVideoPlayerState extends State<QrayatiVideoPlayer> {
  late VideoPlayerController _controller;
  bool _isInitialized = false;
  bool _showControls = true;
  double _watermarkTop = 0.2;
  double _watermarkLeft = 0.2;
  Timer? _watermarkTimer;
  Timer? _controlsTimer;
  double _currentSpeed = 1.0;

  @override
  void initState() {
    super.initState();
    _initPlayer();
    _startWatermarkJitter();
    WakelockPlus.enable(); // إبقاء الشاشة مضاءة أثناء مشاهدة الدرس
  }

  void _initPlayer() {
    _controller = VideoPlayerController.networkUrl(
      Uri.parse(widget.authToken.signedUrl),
      httpHeaders: {
        'X-Qrayati-Auth': widget.authToken.sessionId,
        'User-Agent': 'QrayatiDZ-App-Secured/2.0',
      },
    )..initialize().then((_) {
        setState(() {
          _isInitialized = true;
        });
        _controller.play();
      });

    _controller.addListener(() {
      if (_controller.value.position >= _controller.value.duration &&
          _controller.value.duration > Duration.zero) {
        widget.onEnded?.call();
      }
      widget.onProgress?.call(_controller.value.position, _controller.value.duration);
    });
  }

  void _startWatermarkJitter() {
    _scheduleNextWatermarkJump();
  }

  void _scheduleNextWatermarkJump() {
    if (!mounted) return;
    final rand = Random();
    // Non-predictable random duration between 7 and 14 seconds
    final int nextSeconds = 7 + rand.nextInt(8);
    _watermarkTimer = Timer(Duration(seconds: nextSeconds), () {
      if (!mounted) return;
      setState(() {
        _watermarkTop = 0.10 + rand.nextDouble() * 0.70;
        _watermarkLeft = 0.10 + rand.nextDouble() * 0.70;
      });
      _scheduleNextWatermarkJump();
    });
  }

  void _togglePlayPause() {
    setState(() {
      if (_controller.value.isPlaying) {
        _controller.pause();
      } else {
        _controller.play();
      }
    });
  }

  @override
  void dispose() {
    _watermarkTimer?.cancel();
    _controlsTimer?.cancel();
    _controller.dispose();
    WakelockPlus.disable();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return Container(
        aspectRatio: 16 / 9,
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(
          child: CircularProgressIndicator(color: Color(0xFF047857)),
        ),
      );
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: AspectRatio(
        aspectRatio: _controller.value.aspectRatio,
        child: Stack(
          alignment: Alignment.bottomCenter,
          children: [
            VideoPlayer(_controller),
            
            // Dynamic Anti-Piracy Watermark
            Positioned(
              top: MediaQuery.of(context).size.height * _watermarkTop * 0.4,
              left: MediaQuery.of(context).size.width * _watermarkLeft * 0.6,
              child: IgnorePointer(
                child: Opacity(
                  opacity: 0.35,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black87,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'قرايتي DZ - ${widget.authToken.watermarkData["userName"]}',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${widget.authToken.watermarkData["userPhone"]} | ${widget.authToken.watermarkData["deviceId"]}',
                          style: const TextStyle(color: Colors.white70, fontSize: 8),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // Controls Bar Overlay
            if (_showControls)
              Container(
                color: Colors.black45,
                padding: const EdgeInsets.all(8),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(
                        _controller.value.isPlaying ? Icons.pause : Icons.play_arrow,
                        color: Colors.white,
                      ),
                      onPressed: _togglePlayPause,
                    ),
                    Expanded(
                      child: VideoProgressIndicator(
                        _controller,
                        allowScrubbing: true,
                        colors: const VideoProgressColors(
                          playedColor: Color(0xFF047857),
                          bufferedColor: Colors.white30,
                          backgroundColor: Colors.white12,
                        ),
                      ),
                    ),
                    PopupMenuButton<double>(
                      icon: const Icon(Icons.speed, color: Colors.white),
                      onSelected: (speed) {
                        setState(() => _currentSpeed = speed);
                        _controller.setPlaybackSpeed(speed);
                      },
                      itemBuilder: (context) => [0.75, 1.0, 1.25, 1.5, 2.0]
                          .map((s) => PopupMenuItem(value: s, child: Text('${s}x')))
                          .toList(),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
