import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:online_cource_app/Detail/course_content.dart';
import 'package:online_cource_app/constants.dart';
import 'dart:ui';

class CoursesDetail extends StatefulWidget {
  final String imgDetail;
  final String title;
  final String price;
  const CoursesDetail({
    super.key,
    required this.imgDetail,
    required this.title,
    required this.price,
  });

  @override
  State<CoursesDetail> createState() => _CoursesDetailState();
}

class _CoursesDetailState extends State<CoursesDetail>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Stack(
          children: [
            // Background Image with Gradient Overlay
            Hero(
              tag: 'img1',
              child: Container(
                height: size.height * 0.5,
                width: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage(widget.imgDetail),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Stack(
                  children: [
                    // Enhanced Gradient Overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withOpacity(0.0),
                            Colors.black.withOpacity(0.4),
                            Colors.black.withOpacity(0.8),
                          ],
                          stops: const [0.0, 0.6, 1.0],
                        ),
                      ),
                    ),

                    // Top Navigation Bar with Enhanced Blur Effect
                    SafeArea(
                      child: ClipRRect(
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 15.0, sigmaY: 15.0),
                          child: Container(
                            height: 60,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              border: Border(
                                bottom: BorderSide(
                                  color: Colors.white.withOpacity(0.1),
                                  width: 0.5,
                                ),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                IconButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                  },
                                  icon: const Icon(
                                    Icons.arrow_back_ios,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                                const Text(
                                  "Course Details",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                IconButton(
                                  onPressed: () {},
                                  icon: const Icon(
                                    Icons.bookmark_border_rounded,
                                    color: Colors.white,
                                    size: 22,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Enhanced Course Info Section
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 120, 20, 20),
                      child: FadeTransition(
                        opacity: _fadeAnimation,
                        child: SlideTransition(
                          position: _slideAnimation,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              // Elegant Bestseller Badge
                              Container(
                                decoration: BoxDecoration(
                                  color: yellow,
                                  borderRadius: BorderRadius.circular(30),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.15),
                                      blurRadius: 8,
                                      offset: const Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 6),
                                  child: Text(
                                    "BESTSELLER",
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                      letterSpacing: 1,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Enhanced Title with Text Shadow
                              Text(
                                widget.title,
                                style: const TextStyle(
                                  fontSize: 30,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  height: 1.2,
                                  letterSpacing: 0.5,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black45,
                                      blurRadius: 15,
                                      offset: Offset(0, 5),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Enhanced Rating and User Count Row
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(30),
                                      border: Border.all(
                                        color: Colors.white.withOpacity(0.1),
                                        width: 1,
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        SvgPicture.asset(
                                          "images/user_icon.svg",
                                          colorFilter: const ColorFilter.mode(
                                            Colors.white,
                                            BlendMode.srcIn,
                                          ),
                                          height: 16,
                                        ),
                                        const SizedBox(width: 8),
                                        const Text(
                                          "18k",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 15),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(30),
                                      border: Border.all(
                                        color: Colors.white.withOpacity(0.1),
                                        width: 1,
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        SvgPicture.asset(
                                          "images/star_icon.svg",
                                          colorFilter: const ColorFilter.mode(
                                            Colors.amber,
                                            BlendMode.srcIn,
                                          ),
                                          height: 16,
                                        ),
                                        const SizedBox(width: 8),
                                        const Text(
                                          "4.8",
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 25),

                              // Enhanced Price Row with Elegant Discount Badge
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    widget.price,
                                    style: const TextStyle(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Padding(
                                    padding: EdgeInsets.only(bottom: 6),
                                    child: Text(
                                      "\$70",
                                      style: TextStyle(
                                        fontSize: 18,
                                        decoration: TextDecoration.lineThrough,
                                        color: Colors.white70,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: green,
                                      borderRadius: BorderRadius.circular(20),
                                      boxShadow: [
                                        BoxShadow(
                                          color: green.withOpacity(0.3),
                                          blurRadius: 10,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: const Text(
                                      "30% OFF",
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Course Content Widget
            CourseContent(size: size),
          ],
        ),
      ),
      bottomSheet: bottomParts(),
    );
  }

  Container bottomParts() {
    var size = MediaQuery.of(context).size;
    return Container(
      width: size.width,
      height: 100,
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            spreadRadius: 5,
            blurRadius: 20,
            color: Colors.black.withOpacity(0.08),
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              height: 60,
              width: 70,
              decoration: BoxDecoration(
                color: redLight,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.withOpacity(0.15),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: SvgPicture.asset(
                "images/cart_icon.svg",
                colorFilter: const ColorFilter.mode(
                  Colors.red,
                  BlendMode.srcIn,
                ),
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Container(
                height: 60,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [primary, Color(0xFF4F74FA)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: primary.withOpacity(0.4),
                      blurRadius: 15,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    "ENROLL NOW",
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
