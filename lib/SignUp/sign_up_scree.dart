import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Login/login_page.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';
import 'package:online_cource_app/Utils/toast_messages.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';

class SignUpPage extends StatefulWidget {
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;
  TextEditingController _nameController = TextEditingController();
  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  AuthController auth = Get.find<AuthController>();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1000),
    );

    _animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(_animationController);

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onSignUp() async {
    showLoadingDialouge(context, 'Signing up...');
    if (_emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty) {
      await auth.signUpNewUsers(
          context, _emailController.text, _passwordController.text);
      Get.back();
      showSuccessToast(context, 'Successfully signed up');
    } else {
      Get.back();
      showErrorToast(context, 'Please fill all the required fields');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          margin: MediaQuery.of(context).viewInsets,
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("images/background.jpg"),
              fit: BoxFit.cover,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              FadeTransition(
                opacity: _animation,
                child: Image.asset(
                  "images/logo.png",
                  width: MediaQuery.of(context).size.width * .5,
                ),
              ),
              const Text('New User Sign Up',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
              SizedBox(height: 20),
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.0, -1.5),
                  end: Offset.zero,
                ).animate(_animation),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  padding: EdgeInsets.symmetric(vertical: 10),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      hintText: 'Name',
                      border: InputBorder.none,
                      prefixIcon: Icon(Icons.person),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20),
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.0, -1.5),
                  end: Offset.zero,
                ).animate(_animation),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  padding: EdgeInsets.symmetric(vertical: 10),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      hintText: 'Email',
                      border: InputBorder.none,
                      prefixIcon: Icon(Icons.email),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20),
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.0, -1.5),
                  end: Offset.zero,
                ).animate(_animation),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  padding: EdgeInsets.symmetric(vertical: 10),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: TextFormField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      hintText: 'Password',
                      border: InputBorder.none,
                      prefixIcon: Icon(Icons.lock),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20),
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.0, -1.5),
                  end: Offset.zero,
                ).animate(_animation),
                child: MaterialButton(
                  onPressed: _onSignUp,
                  minWidth: MediaQuery.of(context).size.width * 0.8,
                  padding: EdgeInsets.symmetric(vertical: 15),
                  color: Colors.blue,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Text(
                    'Sign Up',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              const Text(
                'Already have an account?',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
              ),
              TextButton(
                  onPressed: () {
                    Get.to(() => LoginPage());
                  },
                  child: const Text('Log in',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 18)))
            ],
          ),
        ),
      ),
    );
  }
}
