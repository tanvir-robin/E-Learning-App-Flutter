import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';

class AuthController extends GetxController {
  Future<User?> signUpNewUsers(
      BuildContext context, String email, String password) async {
    try {
      UserCredential userCredential =
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await signInUsers(context, email, password);
      return userCredential.user;
    } catch (e) {
      showErrorDialouge(context, e.toString());
    }
    return null;
  }

  Future<User?> signInUsers(
      BuildContext context, String email, String password) async {
    try {
      UserCredential userCredential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential.user;
    } catch (e) {
      showErrorDialouge(context, e.toString());
    }
    return null;
  }

  Future<void> signOutUsers() async {
    try {
      await FirebaseAuth.instance.signOut();
    } catch (e) {
      showErrorDialouge(Get.context!, e.toString());
    }
  }
}
