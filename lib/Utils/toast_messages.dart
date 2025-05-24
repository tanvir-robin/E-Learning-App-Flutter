import 'package:flutter/material.dart';
import 'package:motion_toast/motion_toast.dart';

void showSuccessToast(BuildContext context, String message) {
  MotionToast.success(
    toastDuration: const Duration(milliseconds: 1000),
    title: const Text("Success"),
    description: Text(message),
  ).show(context);
}

void showErrorToast(BuildContext context, String message) {
  MotionToast.error(
          toastDuration: const Duration(milliseconds: 1000),
          title: const Text("Error"),
          description: Text(message))
      .show(context);
}
