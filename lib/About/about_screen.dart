import 'package:flutter/material.dart';

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('About Us'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'About E-Learn',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              Text(
                'Welcome to E-Learn, your go-to platform for online education. Our mission is to make quality education accessible to everyone, anywhere, anytime. Whether you’re looking to advance your career, learn a new skill, or simply gain knowledge, E-Learn offers a wide range of courses tailored to meet your needs.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 16),
              Text(
                'Our Courses',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                'At E-Learn, we provide a diverse selection of courses spanning various fields such as technology, business, arts, science, and personal development. Our courses are designed by industry experts and experienced educators to ensure that you receive the most up-to-date and practical knowledge.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 16),
              Text(
                'Our Vision',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                'Our vision is to bridge the gap between traditional and modern education by leveraging the power of technology. We believe in the potential of every individual to learn and grow, and we are committed to providing the resources and support needed to achieve your learning goals.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 16),
              Text(
                'Join Us',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                'Join millions of learners around the world who have chosen E-Learn as their learning partner. Sign up today and start your educational journey with us!',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 32),
              Text(
                'Frequently Asked Questions (FAQ)',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              _buildFAQItem(
                'What is E-Learn?',
                'E-Learn is an online learning platform offering a wide range of courses across various fields, designed to help you achieve your educational and professional goals.',
              ),
              _buildFAQItem(
                'How do I sign up?',
                'Signing up is easy! Just click on the "Sign Up" button on our homepage and follow the instructions. You can use your email address or social media accounts to register.',
              ),
              _buildFAQItem(
                'Are the courses free?',
                'We offer both free and paid courses. The course details page will indicate whether a course is free or has a fee.',
              ),
              _buildFAQItem(
                'Can I get a certificate?',
                'Yes, upon successful completion of a course, you will receive a certificate that you can share with employers or include in your professional profile.',
              ),
              _buildFAQItem(
                'What if I have technical issues?',
                'If you encounter any technical issues, please contact our support team through the "Help" section in the app or email us at support@elearn.com.',
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ExpansionTile(
        title: Text(
          question,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              answer,
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}
