import 'dart:io';
import 'package:mailer/mailer.dart';
import 'package:mailer/smtp_server.dart';

class CertificationEmailService {
  final String username = '@gmail.com';
  final String password = '';

  /// Method to send certification email with attached PDF
  Future<void> sendCertification({
    required String receiverEmail,
    required File pdfFile,
    required String candidateName,
    required String examName,
    required String score,
    required String examDate,
  }) async {
    // Configure the SMTP server
    final smtpServer = SmtpServer(
      'smtp.gmail.com',
      port: 465,
      ssl: true,
      username: username,
      password: password,
    );

    // Create the email message
    final message = Message()
      ..from = Address(username, 'PSTU E-Learning')
      ..recipients.add(receiverEmail)
      ..subject = 'Certification of Achievement - $examName'
      ..html = '''
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="margin: 20px auto; width: 80%; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00466a;">PSTU Certification Board</h2>
        <p>Dear $candidateName,</p>
        <p>Congratulations on successfully completing the <strong>$examName</strong> exam! Below are your exam details:</p>
        
        <div style="margin: 15px 0; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
          <p><strong>Exam Name:</strong> $examName</p>
          <p><strong>Score:</strong> $score</p>
          <p><strong>Exam Date:</strong> $examDate</p>
        </div>
        
        <p>Please find your official certification attached to this email. If you have any questions or require further assistance, feel free to contact us.</p>
        
        <p style="font-size: 0.9em; color: #555;">Thank you for choosing PSTU Certification Board!</p>
        
        <p style="font-size: 0.9em;">Regards,<br>PSTU E-Learning Team</p>
        <hr style="border-top: 1px solid #ddd;">
        <p style="font-size: 0.8em; color: #999;">PSTU Certification Board | Bangladesh</p>
      </div>
    </div>
    ''';

    // Attach the PDF using FileAttachment
    try {
      message.attachments.add(FileAttachment(pdfFile)
        ..fileName = '${candidateName}_Certification.pdf');
    } catch (e) {
      print('Failed to attach the PDF file: ${e.toString()}');
      return;
    }

    // Send the email
    try {
      final sendReport = await send(message, smtpServer);
      print('Certification email sent: $sendReport');
    } on MailerException catch (e) {
      print('Certification email not sent. \n${e.toString()}');
      for (var p in e.problems) {
        print('Problem: ${p.code}: ${p.msg}');
      }
    }
  }
}
