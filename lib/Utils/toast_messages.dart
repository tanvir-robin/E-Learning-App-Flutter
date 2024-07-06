import 'package:flutter/material.dart';
import 'package:motion_toast/motion_toast.dart';

void showSuccessToast(BuildContext context, String message) {
  MotionToast.success(
    toastDuration: Duration(milliseconds: 1000),
    title: Text("Success"),
    description: Text(message),
  ).show(context);
}

void showErrorToast(BuildContext context, String message) {
  MotionToast.error(
          toastDuration: Duration(milliseconds: 1000),
          title: Text("Error"),
          description: Text(message))
      .show(context);
}
