# تقرير الفحص المعماري والتدقيق الهندسي لمشروع "قرايتي DZ"
**وثيقة التدقيق الهندسي الشامل وخطة التحول لمنصة تعليمية جزائرية**
*الملف: docs/ALGERIA_MIGRATION_AUDIT.md*
*التاريخ: أكتوبر 2026*

---

## 1. ملخص حالة المشروع (Executive Summary)

### 1.1 طبيعة المشروع المستورد
- **اسم المستودع الأصلي:** `E-Learning-App-Flutter` (المستورد من GitHub: `dzza9352-hub/E-Learning-App-Flutter`).
- **الإطار واللغة:** تطبيق هاتف محمول مبني باستخدام **Flutter (Dart)**، مع مكتبة **GetX** لإدارة الحالة والتوجيه (Navigation)، وخدمات **Firebase** (Firebase Authentication, Cloud Firestore, Firebase Storage) للبنية الخلفية.
- **الهدف الاستراتيجي الحالي:** فحص المشروع، تثبيت الأساس الهندسي، وإعداده للتحول التدريجي إلى منصة تعليمية جزائرية متكاملة تحت مسمى **"قرايتي DZ"** تلبي متطلبات المنهاج الجزائري واحتياجات الأساتذة والطلاب وطرق الدفع المحلية.

### 1.2 حالة بيئة التشغيل الحالية والقيود التقنية
> **تنبيه هندسي للشفافية والمطابقة:**  
> تم فحص بيئة عمل الحاوية الحالية بدقة عبر سطر الأوامر:
> - مثبت حالياً: `Node.js` و `npm` (مخصصة لمعاينة الويب على المنفذ 3000).
> - **غير متوفر حالياً في بيئة الحاوية:** أدوات `flutter` و `dart` CLI.
> - **الإجراء المتبع:** تدوين هذا القيد بوضوح كامل دون ادعاء تشغيل أوامر تعذر تشغيلها في الحاوية، مع التركيز على التدقيق الثابت والصارم للكود (Static Code Analysis & Architecture Audit)، وتصميم البنية الهندسية المستهدفة بما يضمن عدم حذف أي وظائف أو ملفات أصلية.

---

## 2. بنية الملفات الفعلية للكود الأصلي (Actual File Structure)

```text
├── analysis_options.yaml           # إعدادات لغة Dart وقواعد التدقيق البرمجي
├── pubspec.yaml                    # تعريف الحزم والاعتماديات وملفات الأصول
├── android/                        # إعدادات نظام أندرويد و Gradle وملف google-services.json
├── ios/                            # إعدادات نظام iOS وملف GoogleService-Info.plist
├── assets/                         # الصور والشعارات الثابتة للمشروع
├── images/                         # أيقونات SVG وملفات أسئلة بصيغة JSON
├── questions/                      # بنوك الأسئلة (mobile_app.json, web_dev.json, ...)
└── lib/
    ├── main.dart                   # نقطة الدخول، تهيئة Firebase، إعداد EasyLoading
    ├── auth_gate.dart              # بوابة توجيه المستخدم حسب حالة المصادقة (StreamBuilder)
    ├── constants.dart             # الألوان العامة (primary, grey, yellow, green)
    ├── firebase_options.dart      # إعدادات منصات Firebase
    ├── question_model.dart        # نموذج الأسئلة والاختبارات (JsonSerializable)
    ├── theme/
    │   └── app_theme.dart         # ثيم التطبيق، الألوان، الخطوط وتدرجات الألوان
    ├── controllers/
    │   └── auth_controller.dart   # متحكم GetxController للمصادقة وتحديث الحسابات
    ├── navigation/
    │   └── main_navigation.dart   # شريط التنقل السفلي المكون من 5 صفحات والقائمة العائمة
    ├── Model/
    │   ├── course_model.dart      # نموذج الدورة CourseModel (تحويل JSON)
    │   └── model.dart.dart        # بيانات تجريبية محلية ثابتة وقوائم الدروس
    ├── Home/
    │   └── home_page.dart         # الشاشة الرئيسية، لافتة العرض، البحث، والتصنيفات
    ├── Courses/
    │   ├── alll_courses.dart      # قائمة كل الدورات المجلوبة من Firestore
    │   ├── course_details.dart    # تفاصيل الدورة، الخطة الزمنية، زر الشراء
    │   ├── enhanced_course_details.dart # نسخة محسنة من تفاصيل الدورة مع التبويبات
    │   ├── enrolled_course.dart   # استعراض الدورات المسجلة للطالب
    │   └── course_play.dart       # مشغل الفيديو (Chewie/VideoPlayer) ومتابعة الدروس
    ├── Detail/
    │   ├── course_detail.dart     # واجهة تفاصيل بديلة مع تأثيرات حركية
    │   └── course_content.dart    # واجهة عرض المحاضرات والمدة الزمنية
    ├── Exam/
    │   ├── exam_home.dart         # شاشة اختيار الاختبارات الأربعة
    │   └── exam_screen.dart       # شاشة أداء الامتحان، المؤقت، والشهادة بصيغة PDF
    ├── About/
    │   ├── profile_screen.dart    # الملف الشخصي وإحصائيات التعلم وخيارات الحساب
    │   └── about_screen.dart      # من نحن، الرؤية، والأسئلة الشائعة
    ├── Login/
    │   └── login_page.dart        # واجهة تسجيل الدخول
    ├── SignUp/
    │   └── sign_up_scree.dart     # واجهة إنشاء حساب جديد
    ├── admin/
    │   ├── admin_all_course.dart  # واجهة الإدارة لعرض جميع الدورات
    │   └── add_new_course.dart    # نموذج إضافة دورة جديدة إلى Firestore
    └── Utils/
        ├── custom_drawer.dart     # القائمة الجانبية المنزلقة
        ├── dialouge_utils.dart    # نوافذ التنبيه وأشرطة التحميل
        ├── email_helper.dart      # وحدة إرسال البريد الإلكتروني
        ├── enroll_dioulouge.dart  # نافذة تأكيد التسجيل في الدورة
        ├── exam_tile.dart         # بطاقة عرض الاختبار الفردي
        ├── helper.dart            # دوال مساعدة عامة
        └── toast_messages.dart    # إشعارات التنبيه المنبثقة
```

---

## 3. التقنيات والاعتماديات المستخدمة (Technologies & Dependencies)

بحسب فحص ملف `pubspec.yaml`:
| الحزمة (Package) | الإصدار | الاستخدام الفعلي في المشروع | التوافقية والتوصية |
| :--- | :--- | :--- | :--- |
| `get` | `^4.6.6` | إدارة الحالة، التوجيه الذكي، وحقن الاعتماديات | مستقر ومناسب للاحتفاظ به |
| `firebase_core` | `^3.1.1` | تهيئة وتوصيل خدمات Firebase الأساسية | حديث ومناسب |
| `firebase_auth` | `^5.1.1` | مصادقة المستخدمين عبر البريد الإلكتروني | مستقر |
| `cloud_firestore` | `^5.0.2` | قاعدة البيانات غير العلائقية NoSQL | مستقر |
| `firebase_storage` | `^12.2.0` | تخزين وسائط ومستندات وفيديوهات الدورات | مستقر |
| `video_player` | `^2.9.1` | المحرك الأساسي لتشغيل ملفات الفيديو | أساسي |
| `chewie` | `^1.8.4` | واجهة تحكم وتخصيص مشغل الفيديو | ممتاز لمشغل الدورات |
| `pdf` | `^3.11.1` | بناء وتوليد ملفات ومستندات PDF برمجياً | مستقر |
| `confetti` | `^0.7.0` | تأثيرات احتفالية عند إتمام الاختبارات | جمالي ومناسب |
| `flutter_easyloading`| `^3.0.5` | مؤشرات تحميل الشاشة أثناء العمليات | خفيف ويعمل جيداً |
| `google_fonts` | `^6.2.1` | تحميل خط Poppins (سيتم دمجه مع خط Cairo) | مستقر |
| `icons_plus` | `^5.0.0` | مجموعة أيقونات إضافية للأقسام | مناسب |
| `timeline_tile` | `^2.0.0` | رسم المخطط الزمني للأسبوع الدراسي | يعطي تجربة مستخدم ممتازة |

---

## 4. فحص الوظائف الموجودة حالياً (Existing Features Audit)

1. **نظام المصادقة (Authentication):**
   - تسجيل الدخول وإنشاء الحساب باستخدام البريد الإلكتروني وكلمة المرور عبر Firebase Auth.
   - حفظ وثيقة المستخدم في مسار Firestore: `users/{uid}`.
   - التحقق التلقائي من حالة تسجيل الدخول عبر `AuthGate` وتوجيه المستخدم مباشرة.

2. **عرض واستكشاف الدورات (Course Browsing):**
   - شاشة رئيسية تضم لافتة دعائية، شريط تصنيفات، وعرض الكورسات المتوفرة.
   - صفحة "جميع الدورات" تقرأ مباشرة من كولكشن `courses` في Firestore.
   - صفحة تفاصيل الدورة تتضمن السعر، المدرس، المدة، المخطط الزمني الأسبوعي، والدروس.

3. **التسجيل في الدورات (Course Enrollment):**
   - نافذة تأكيد اشتراك (`showEnrollmentDialog`).
   - إضافة الدورة إلى المسار الفرعي للمستخدم: `users/{uid}/enrollment`.
   - استعراض الكورسات المشترك بها في شاشة `EnrolledCoursesScreen`.

4. **مشاهدة المحتوى وتشغيل الوسائط (Media Playback):**
   - تشغيل الفيديو عبر `Chewie` و `video_player`.
   - واجهة مخصصة لعرض نسبة إنجاز المحاضرات ومربعات التحديد.

5. **نظام الاختبارات والتقييم والشهادات (Exams & Certification):**
   - 4 اختبارات محددة بزمن وعدد أسئلة تُقرأ من ملفات JSON محلية.
   - مؤقت زمني تنازلي وتصحيح تفاعلي فوري.
   - توليد شهادة إتمام بصيغة PDF تتضمن اسم الطالب ودرجته مع إمكانية حفظها.

6. **لوحة تحكم الإدارة الأولية (Admin Management):**
   - شاشة استعراض كورسات الإدارة `AdminCoursesScreen`.
   - نموذج إضافة كورس جديد `AddCourseScreen` يرفع البيانات مباشرة إلى Firestore.

---

## 5. الوظائف الناقصة للتحول إلى "قرايتي DZ" (Missing Features for Algeria Platform)

لتحويل المشروع إلى منصة تعليمية جزائرية رائدة، تفتقر النسخة الحالية إلى ما يلي:

1. **بوابة الدفع والمعاملات المالية الجزائرية:**
   - لا يوجد دعم لخدمة **بريدي موب (BaridiMob)** لتحويل الأموال عبر رقم RIP مع إرفاق وصل الدفع والمصادقة اليدوية أو الآلية.
   - لا يوجد دعم للبطاقة النقدية **الذهبية (Edahabia)** أو بطاقة **CIB** عبر منصة ساتيم (SATIM).
   - لا يوجد دعم لنظام **بطاقات التعبئة أو القسائم (Vouchers / Scratch Cards)**، وهي الطريقة الأكثر شيوعاً ونجاحاً لطلاب المدارس والثانويات في الجزائر.

2. **هيكل المنظومة التعليمية الجزائرية:**
   - غياب تقسيم الأطوار: الطور الثانوي (1 ثانوي، 2 ثانوي، 3 ثانوي - بكالوريا Bac)، الطور المتوسط (شهادة التعليم المتوسط BEM)، والجامعي.
   - غياب تقسيم الشعب: (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد، لغات أجنبية، آداب وفلسفة).
   - غياب تصنيف المواد الجزائرية الرسمية (العلوم الفيزيائية، العلوم الطبيعية، الرياضيات، الفلسفة، الأدب العربي...).

3. **نموذج علاقات متعدد الأبعاد (الأستاذ / المادة / القسم):**
   - حالياً اسم المدرس مجرد نص بسيط في قائمة ولا يوجد كيان مستقل للأستاذ (`Teacher/Professor`)، ولا يوجد ملف شخصي للأستاذ، ولا تقسيم الدورة إلى فصول ووحدات متسلسلة.

4. **محفظة المستخدم المالية (User Wallet):**
   - عدم وجود رصيد بالدينار الجزائري (DZD)، ولا يوجد سجل عمليات إيداع وشراء (Transaction Ledger).

5. **حماية المحتوى ومنع القرصنة:**
   - عدم وجود علامة مائية ديناميكية (Dynamic Watermark) برقم هاتف واسم الطالب على الفيديو لمنع تسجيل الشاشة.
   - روابط الفيديو حالياً مفتوحة وتفتقر إلى تشفير أو روابط موقعة مؤقتة (Signed URLs).

---

## 6. الأخطاء البرمجية التي أمكن إثباتها بالكود (Demonstrated Code Bugs & Smells)

خلال الفحص الدقيق لملفات الكود المصدري الأصلي، تم إثبات المشكلات التالية:

1. **خطأ إدارة الحالة وحقن الاعتماديات في `custom_drawer.dart`:**
   - **السطر 78:** استدعاء `AuthController().signOutUsers();` بإنشاء كائن جديد فارغ بدلاً من استخدام الحاوية المسجلة `Get.find<AuthController>()`، مما يؤدي إلى فقدان مراقبة الحالة (State loss) وسلوك غير متوقع عند تسجيل الخروج.

2. **تضارب وعدم اتساق حقول الـ JSON في `course_model.dart`:**
   - **في `fromJson` (السطر 26):** يقرأ المفتاح بالمفرد: `json['instructor']`.
   - **في `toJson` (السطر 42):** يحفظه أيضاً كـ `instructor`، بينما في واجهات أخرى ووثائق أخرى يتم تمريره بصيغة الجمع `instructors`.
   - غياب إدارة حقول الـ `null` الآمنة في حالة عدم وجود الحقول، واستخدام أرقام ثابتة افتراضية قد تضلل العميل.

3. **ارتباط رابط الفيديو بمسار تخزين محلي غير مؤكد في `course_play.dart`:**
   - **السطر 58:** يتم استدعاء `FirebaseStorage.instance.ref().child('demo/demo.mp4')`. في حال عدم وجود هذا الملف في باكت التخزين الجديد، يتوقف المشغل بالكامل مسبباً استثناءً غير معالج (Unhandled Exception).

4. **تضارب مصادر البيانات في الصفحة الرئيسية `home_page.dart`:**
   - الصفحة الرئيسية تستعرض بيانات تجريبية ثابتة من ملف `model.dart.dart` (`onlineCourceOne`) بدلاً من قراءة الكورسات من قاعدة بيانات Firestore المربوطة في صفحة `alll_courses.dart`.

5. **عدم دعم الاتجاه من اليمين لليسار (RTL) وعدم تعريب الواجهة:**
   - كل النصوص باللغة الإنجليزية، وواجهة المستخدم مصممة باتجاه LTR، مما يحتاج إلى إعادة تهيئة الثيم للغة العربية مع الحفاظ على معايير Material 3.

---

## 7. نقاط المخاطرة الأمنية الحرجة (Security Risks Audit)

1. **كشف مفاتيح وبيانات اعتماد Firebase في ملفات البناء:**
   - تم فحص ملف `android/app/google-services.json`:
     - معرف المشروع الحقيقي: `"project_id": "elearning-raisa"`
     - مفتاح الـ API المكشوف: `"current_key": "AIzaSyCoHuLlxgH4-z6ykQFHZfH4wVg99B1y0Ww"`
   - **التوصية الأمنية:** عزل المفاتيح وتفعيل قيود النطاق (API Key Restrictions) في لوحة Google Cloud Console بحيث تقتصر على بصمة تطبيق Android (SHA-1 fingerprint) ومعرف الحزمة، وعدم رفع المفاتيح الإنتاجية على مستودعات عامة.

2. **انعدام التحقق من صحة عمليات الشراء (Client-Side Trust):**
   - في ملف `enroll_dioulouge.dart` (السطر 118-122): العميل يقوم مباشرة بإضافة الدورة إلى حسابه في Firestore من خلال كود الواجهة دون أي وسيط أو دالة سحابية (Cloud Function) تتحقق من دفع المقابل المالي.
   - **المخاطرة:** يمكن لأي مستخدم تجاوز الدفع والاشتراك مجاناً عبر تتبع استدعاءات الشبكة.

3. **صلاحيات الإدارة المفتوحة:**
   - في `admin_all_course.dart` و `add_new_course.dart`: يتم الدخول إلى شاشات الإدارة دون فحص حقل الصلاحية (Role-Based Access Control - RBAC) في وثيقة المستخدم، مما قد يسمح لأي طالب بالوصول لإضافة أو تعديل الدورات إذا لم تكن هناك قواعد أمان صارمة في `firestore.rules`.

---

## 8. البنية المستهدفة لمنصة "قرايتي DZ" (Target Architecture & Relational Schema)

تصميم البنية يضمن العلاقات المطلوبة دون الحاجة لإعادة بناء قاعدة البيانات مستقبلاً:

### مخطط العلاقات الكيانية (Entity-Relationship Diagram):

```text
[المادة التعليمية (Subject)] 1 ─── N [المادة لدى الأستاذ (TeacherSubject)]
                                           │
                                           │ 1
                                           └─── N [الدورة التعليمية (Course)]
                                                        │
                                                        │ 1
                                                        └─── N [الوحدة / القسم (Section)]
                                                                    │
                                                                    │ 1
                                                                    └─── N [الدرس (Lesson)]
                                                                                │
                                                                                ├── N [المرفقات (Attachments)]
                                                                                └── 1 [المحتوى: فيديو/نص/اختبار]

[المستخدم (User)] 1 ─── 1 [المحفظة (Wallet)] 1 ─── N [المعاملات (Transactions)]
       │
       ├── N [الدورات المشتراة (Enrollments)] 1 ─── N [سجل التقدم (LessonProgress)]
       └── N [الإشعارات (Notifications)]
```

### توصيف النماذج البرمجية المستهدفة (Data Models Specification):

#### 1. نموذج المادة التعليمية (`SubjectModel`)
```dart
class SubjectModel {
  final String id;              // مثل: sub_math_bac
  final String title;           // الرياضيات
  final String educationPhase;   // ثانوي، متوسط، جامعي
  final String academicYear;     // 3 ثانوي (بكالوريا)
  final String stream;           // علوم تجريبية، رياضيات...
  final String iconUrl;
  final bool isActive;
}
```

#### 2. نموذج الأستاذ (`TeacherModel`)
```dart
class TeacherModel {
  final String id;              // معرف الأستاذ
  final String fullName;        // أ. نور الدين، أ. شريفي...
  final String bio;             // نبذة عن الخبرة والشهادات
  final String photoUrl;
  final List<String> subjectIds;// المواد التي يدرسها
  final double rating;          // تقييم الطلاب
  final int totalStudents;
  final bool isVerified;
}
```

#### 3. نموذج الدورة (`CourseModel` المحدث)
```dart
class CourseModel {
  final String id;
  final String title;           // المراجعة الشاملة للدوال العددية
  final String subjectId;       // ارتباط بالمادة
  final String teacherId;       // ارتباط بالأستاذ
  final String description;
  final String thumbnailUrl;
  final double priceDzd;        // السعر بالدينار الجزائري (مثال: 2500 DZD)
  final int durationHours;
  final List<CourseSection> sections; // أقسام الدورة
  final CourseLevel level;      // مبتدئ، بكالوريا مكثف...
  final bool isPublished;
}
```

#### 4. نموذج القسم والدرس (`CourseSection` & `LessonModel`)
```dart
class CourseSection {
  final String id;
  final String title;           // الوحدة 1: دراسة التغيرات
  final int order;
  final List<LessonModel> lessons;
}

enum LessonType { video, document, quiz, text }

class LessonModel {
  final String id;
  final String title;
  final LessonType type;        // فيديو / نص / اختبار
  final String mediaUrl;        // رابط الفيديو أو الاختبار
  final int durationSeconds;
  final List<AttachmentModel> attachments; // PDF، ملخصات، تمارين
  final bool isFreePreview;     // درس تجريبي مجاني
}

class AttachmentModel {
  final String id;
  final String title;           // ملخص القوانين.pdf
  final String fileUrl;
  final String fileType;
  final int fileSizeBytes;
}
```

#### 5. نموذج المستخدم والمحفظة (`UserModel` & `WalletModel`)
```dart
class UserModel {
  final String uid;
  final String fullName;
  final String email;
  final String phoneNumber;     // ضروري للدفع والتأكيد بالجزائر
  final String wilaya;          // الولاية (1 - 58)
  final String academicYear;     // السنة الدراسية
  final UserRole role;          // طالب، أستاذ، مشرف
}

class WalletModel {
  final String userId;
  final double balanceDzd;      // الرصيد الحالي بالدينار الجزائري
  final DateTime lastUpdated;
}

class TransactionModel {
  final String id;
  final String userId;
  final double amountDzd;
  final TransactionType type;   // شحن رصيد، شراء دورة، استرداد
  final PaymentMethod method;   // بريدي موب، بطاقة شحن، ذهبية
  final TransactionStatus status;// معلق، مكتمل، مرفوض
  final String? receiptUrl;     // صورة وصل بريدي موب
  final DateTime createdAt;
}
```

---

## 9. خطة تطوير التطبيق على مراحل زمنية (Step-by-Step Migration Roadmap)

### المرحلة 1: التأسيس المعماري وضبط الأمان
- **الهدف:** عزل أسرار Firebase، تنظيف بيئة التطوير، وإصلاح أخطاء GetX.
- **الملفات المتأثرة:**
  - `lib/constants.dart`
  - `lib/theme/app_theme.dart` (إضافة دعم الخط العربي Cairo وضبط اتجاه RTL)
  - `lib/Utils/custom_drawer.dart` (إصلاح استدعاء Get.find)
  - `lib/controllers/auth_controller.dart`

### المرحلة 2: تحديث طبقة البيانات والنماذج (Data Layer & Repositories)
- **الهدف:** إدخال النماذج الجديدة المتوافقة مع النظام الجزائري (المواد، الأساتذة، الأقسام، الدروس، المرفقات).
- **الملفات المتأثرة:**
  - `lib/Model/course_model.dart`
  - `lib/Model/subject_model.dart` (جديد)
  - `lib/Model/teacher_model.dart` (جديد)
  - `lib/Model/wallet_model.dart` (جديد)

### المرحلة 3: تطوير واجهات الاستكشاف الجزائرية
- **الهدف:** إتاحة اختيار الطور الدراسي (مثل: 3 ثانوي بكالوريا)، واختيار المادة، ثم الأستاذ، ثم الدورة.
- **الملفات المتأثرة:**
  - `lib/Home/home_page.dart`
  - `lib/Courses/alll_courses.dart`
  - `lib/Courses/course_details.dart`

### المرحلة 4: تكامل الدفع الجزائري والمحفظة الرقمية
- **الهدف:** تفعيل شحن الرصيد عبر بطاقات التعبئة، والتحويل اليدوي عبر بريدي موب برفع صورة الوصل.
- **الملفات المتأثرة:**
  - إنشاء `lib/wallet/wallet_screen.dart`
  - إنشاء `lib/wallet/recharge_voucher_dialog.dart`
  - إنشاء `lib/wallet/baridimob_payment_screen.dart`
  - تعديل `lib/Utils/enroll_dioulouge.dart` للخصم من رصيد المحفظة بمصادقة آمنة.

### المرحلة 5: تحسين مشغل المحتوى وحماية الشاشة
- **الهدف:** دعم العلامة المائية برقم هاتف الطالب لمنع التصوير، ودعم قراءة ملخصات الـ PDF داخل التطبيق دون تنزيل مباشر غير محمي.
- **الملفات المتأثرة:**
  - `lib/Courses/course_play.dart`
  - إضافة `WatermarkOverlay` على مشغل Chewie.

---

## 10. خطة الاختبار والتحقق بعد كل مرحلة (Test & Verification Plan)

لكل مرحلة من مراحل التطوير، يجب تطبيق البروتوكول الاختباري التالي:

1. **اختبارات الوحدات لنماذج البيانات (Unit Tests):**
   - التحقق من دقة دوال `fromJson` و `toJson` لجميع النماذج والتعامل السليم مع الحقول الفارغة (Null-safety).
   - التحقق من دوال حساب الأسعار واقتطاع الرصيد بالدينار الجزائري.

2. **اختبارات طبقة إدارة الحالة (Controller Tests):**
   - اختبار دورة حياة `AuthController` و `CourseController` باستخدام `Get.testMode = true`.
   - التحقق من تفاعل الواجهات مع تدفق البيانات (Streams) عند تغير رصيد المحفظة أو تسجيل كورس جديد.

3. **اختبارات الأمان وقواعد Firestore (Security Rules Simulation):**
   - محاكاة منع تسجيل أي طالب في كورس دون خصم مسجل مسبقاً من المحفظة أو موافقة المشرف.
   - منع أي مستخدم عادي من إنشاء أو تعديل بيانات كولكشن `courses` أو `subjects`.

4. **اختبارات واجهة المستخدم وتجربة الاستخدام (UI & Localization Testing):**
   - فحص اتجاه النصوص (RTL) وعدم حدوث Overflow في الشاشات ذات المقاسات المختلفة.
   - التحقق من سلاسة تشغيل الفيديوهات وفتح المرفقات في بيئات الاتصال البطيء.

---

> **خلاصة:**  
> هذا التقرير يمثل الأساس الهندسي المتين للانتقال بالمشروع من حالته كنموذج أولي مفتوح المصدر إلى بنية منصة تعليمية تجارية وقابلة للتوسع تحت اسم **"قرايتي DZ"**، دون التفريط بأي من مكتسبات الكود المصدري الأصلي.
