import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:online_cource_app/Home/home_page.dart';
import 'package:online_cource_app/Login/login_page.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return const Center(child: Text('Something went wrong!'));
        } else if (snapshot.hasData) {
          return const MyHomePage();
        } else {
          return LoginPage();
        }
      },
    );
  }
}
