import 'package:flutter/material.dart';
import 'package:online_cource_app/Login/login_page.dart';

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
              // Navigate to home screen or perform desired action
            },
          ),
          ListTile(
            leading: Icon(Icons.menu_book),
            title: Text('All Courses'),
            onTap: () {
              // Navigate to all courses screen or perform desired action
            },
          ),
          ListTile(
            leading: Icon(Icons.assignment),
            title: Text('Enrolled'),
            onTap: () {
              // Navigate to enrolled courses screen or perform desired action
            },
          ),
          ListTile(
            leading: Icon(Icons.local_offer),
            title: Text('Promos'),
            onTap: () {
              // Navigate to promos screen or perform desired action
            },
          ),
          ListTile(
            leading: Icon(Icons.exit_to_app),
            title: Text('Sign Out'),
            onTap: () {
              // Navigate to LoginPage
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LoginPage()),
              );
            },
          ),
        ],
      ),
    );
  }
}
