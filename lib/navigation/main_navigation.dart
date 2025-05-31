import 'package:flutter/material.dart';

import 'package:online_cource_app/About/profile_screen.dart';
import 'package:online_cource_app/Courses/alll_courses.dart';
import 'package:online_cource_app/Courses/enrolled_course.dart';
import 'package:online_cource_app/Exam/exam_home.dart';
import 'package:online_cource_app/Home/home_page.dart';
import 'package:online_cource_app/theme/app_theme.dart';

class MainNavigationScreen extends StatefulWidget {
  final int initialIndex;

  const MainNavigationScreen({Key? key, this.initialIndex = 0})
      : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen>
    with SingleTickerProviderStateMixin {
  late int _currentIndex;
  late TabController _tabController;
  late PageController _pageController;

  final List<Widget> _pages = [
    const MyHomePage(),
    CourseListPage(),
    const EnrolledCoursesScreen(),
    const ExamHome(),
    const ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
    _tabController = TabController(
        length: _pages.length, vsync: this, initialIndex: _currentIndex);

    // Simplified listener that only updates when needed
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging &&
          _currentIndex != _tabController.index) {
        setState(() {
          _currentIndex = _tabController.index;
          _pageController.jumpToPage(_currentIndex);
        });
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _changePage(int index) {
    if (_currentIndex == index) return; // Avoid unnecessary updates

    setState(() {
      _currentIndex = index;
      // Sync both controllers
      _tabController.animateTo(index);
      _pageController.jumpToPage(
          index); // Using jumpToPage instead of animate to avoid potential conflicts
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: _pages,
        onPageChanged: (index) {
          if (_currentIndex != index) {
            setState(() {
              _currentIndex = index;
              _tabController.animateTo(
                  index); // Use animateTo instead of direct index assignment
            });
          }
        },
      ),
      bottomNavigationBar: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
          child: AnimatedBuilder(
              animation: _tabController.animation!,
              builder: (context, child) {
                return BottomNavigationBar(
                  currentIndex: _currentIndex,
                  onTap: _changePage,
                  type: BottomNavigationBarType.fixed,
                  backgroundColor: Colors.white,
                  selectedItemColor: AppTheme.primaryColor,
                  unselectedItemColor: AppTheme.secondaryTextColor,
                  selectedLabelStyle: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 12),
                  unselectedLabelStyle: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 12),
                  elevation: 0,
                  items: [
                    _buildNavItem(
                        0, Icons.home_rounded, Icons.home_outlined, 'Home'),
                    _buildNavItem(1, Icons.school_rounded,
                        Icons.school_outlined, 'Courses'),
                    _buildNavItem(2, Icons.book_rounded, Icons.book_outlined,
                        'My Learning'),
                    _buildNavItem(3, Icons.assignment_rounded,
                        Icons.assignment_outlined, 'Exams'),
                    _buildNavItem(4, Icons.person_rounded,
                        Icons.person_outlined, 'Profile'),
                  ],
                );
              }),
        ),
      ),
      floatingActionButton: _buildFloatingActionButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }

  Widget _buildFloatingActionButton() {
    return Container(
      margin: const EdgeInsets.only(top: 30),
      height: 65,
      width: 65,
      child: FloatingActionButton(
        backgroundColor: AppTheme.primaryColor,
        elevation: 8,
        onPressed: () {
          // Show quick actions menu
          _showQuickActionsMenu(context);
        },
        child: const Icon(
          Icons.add,
          size: 30,
        ),
      ),
    );
  }

  void _showQuickActionsMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: 300,
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
          ),
        ),
        child: Column(
          children: [
            Container(
              width: 50,
              height: 5,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(5),
              ),
            ),
            Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.textColor,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: GridView.count(
                crossAxisCount: 3,
                children: [
                  _buildGridActionItem(
                    icon: Icons.search,
                    label: 'Find Courses',
                    onTap: () {
                      Navigator.pop(context);
                      _changePage(1); // Navigate to Courses tab
                    },
                  ),
                  _buildGridActionItem(
                    icon: Icons.play_circle_outline,
                    label: 'My Learning',
                    onTap: () {
                      Navigator.pop(context);
                      _changePage(2); // Navigate to Enrolled Courses tab
                    },
                  ),
                  _buildGridActionItem(
                    icon: Icons.assignment,
                    label: 'Take Quiz',
                    onTap: () {
                      Navigator.pop(context);
                      _changePage(3); // Navigate to Exam tab
                    },
                  ),
                  _buildGridActionItem(
                    icon: Icons.bookmark,
                    label: 'Bookmarks',
                    onTap: () {
                      Navigator.pop(context);
                      // Navigate to bookmarks screen
                    },
                  ),
                  _buildGridActionItem(
                    icon: Icons.downloading,
                    label: 'Downloads',
                    onTap: () {
                      Navigator.pop(context);
                      // Navigate to downloads screen
                    },
                  ),
                  _buildGridActionItem(
                    icon: Icons.settings,
                    label: 'Settings',
                    onTap: () {
                      Navigator.pop(context);
                      _changePage(4); // Navigate to Profile tab
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridActionItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              color: AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.textColor,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  BottomNavigationBarItem _buildNavItem(
      int index, IconData selectedIcon, IconData unselectedIcon, String label) {
    return BottomNavigationBarItem(
      icon: Icon(_currentIndex == index ? selectedIcon : unselectedIcon),
      label: label,
    );
  }
}
