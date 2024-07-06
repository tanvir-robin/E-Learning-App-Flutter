import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/About/about_screen.dart';
import 'package:online_cource_app/Courses/alll_courses.dart';
import 'package:online_cource_app/Exam/exam_home.dart';
import 'package:online_cource_app/Exam/exam_screen.dart';
import 'package:online_cource_app/Home/home_page.dart';
import 'package:online_cource_app/Login/login_page.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';

class CustomDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
            child: Center(
              child: Image.asset(
                'images/logo.png', // Replace 'assets/logo.png' with your logo asset path
                width: 200,
                height: 200,
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.home),
            title: Text('Home'),
            onTap: () {
              Get.to(() => MyHomePage());
            },
          ),
          ListTile(
            leading: Icon(Icons.menu_book),
            title: Text('All Courses'),
            onTap: () {
              Get.to(() => CourseListPage());
            },
          ),
          ListTile(
            leading: Icon(Icons.check),
            title: Text('Exam'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ExamHome()),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.info),
            title: Text('About'),
            onTap: () {
              Get.to(() => AboutPage());
            },
          ),
          ListTile(
            leading: Icon(Icons.exit_to_app),
            title: Text('Sign Out'),
            onTap: () {
              // Navigate to LoginPage
              AuthController().signOutUsers();
            },
          ),
        ],
      ),
    );
  }
}
