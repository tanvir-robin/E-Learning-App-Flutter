import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:online_cource_app/Home/home_page.dart';
import 'package:online_cource_app/SignUp/sign_up_scree.dart';
import 'package:online_cource_app/Utils/dialouge_utils.dart';
import 'package:online_cource_app/Utils/toast_messages.dart';
import 'package:online_cource_app/controllers/auth_controller.dart';

class LoginApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Animated Login Page',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;
  TextEditingController _usernameController = TextEditingController();
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
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    String username = _usernameController.text.trim();
    String password = _passwordController.text.trim();
    final user = await auth.signInUsers(context, username, password);
    if (user == null) {
      Get.back();
      showErrorToast(context, 'Invalid username or password');
    } else {
      Get.off(() => MyHomePage());
    }
    // Check if the username and password match the expected values
    // if (username == 'raisa' && password == '123') {
    //   Navigator.pushReplacement(
    //     context,
    //     MaterialPageRoute(builder: (context) => MyHomePage()),
    //   );
    // } else {
    //   showDialog(
    //     context: context,
    //     builder: (context) => AlertDialog(
    //       title: Text('Incorrect'),
    //       content: Text('Username or password is incorrect.'),
    //       actions: [
    //         TextButton(
    //           onPressed: () {
    //             Navigator.pop(context);
    //           },
    //           child: Text('OK'),
    //         ),
    //       ],
    //     ),
    //   );
    // }
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
                  //    height: 150,
                ),
              ),
              const Text('Welcome Back!',
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
                    controller: _usernameController,
                    decoration: InputDecoration(
                      hintText: 'Username',
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
                  onPressed: _login,
                  minWidth: MediaQuery.of(context).size.width * 0.8,
                  padding: EdgeInsets.symmetric(vertical: 15),
                  color: Colors.blue,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              const SizedBox(
                height: 30,
              ),
              const Text(
                'Or',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
              ),
              TextButton(
                  onPressed: () {
                    Get.to(() => SignUpPage());
                  },
                  child: const Text('Sign Up',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 18)))
            ],
          ),
        ),
      ),
    );
  }
}
