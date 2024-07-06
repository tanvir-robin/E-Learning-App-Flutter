import 'package:flutter/material.dart';
import 'package:quickalert/quickalert.dart';

void showConfirmDialouge(
    BuildContext context, String title, void Function()? onConfirm) {
  QuickAlert.show(
      context: context,
      type: QuickAlertType.confirm,
      text: title,
      confirmBtnText: 'Yes',
      cancelBtnText: 'No',
      confirmBtnColor: Colors.green,
      onConfirmBtnTap: onConfirm);
}

void showLoadingDialouge(BuildContext context, String title) {
  QuickAlert.show(
    context: context,
    type: QuickAlertType.loading,
    title: 'Loading',
    text: title,
  );
}

void showSuccessDialouge(
    BuildContext context, String title, void Function()? onConfirm) {
  QuickAlert.show(
      context: context,
      type: QuickAlertType.success,
      text: title,
      onConfirmBtnTap: onConfirm);
}

void showErrorDialouge(BuildContext context, String title,
    [String heading = 'Oops...']) {
  QuickAlert.show(
    context: context,
    type: QuickAlertType.error,
    title: heading,
    text: title,
  );
}

void showInfoDialouge(BuildContext context, String title) {
  QuickAlert.show(
    context: context,
    type: QuickAlertType.info,
    text: title,
  );
}
