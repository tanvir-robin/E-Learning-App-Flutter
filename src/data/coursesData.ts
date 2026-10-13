import { TeacherProfile, SubjectModel, CourseModel, PromotionalBanner } from "../types";

export const ALGERIAN_WILAYAS = [
  "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة",
  "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
  "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو",
  "16 - الجزائر العاصمة", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
  "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة",
  "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
  "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس",
  "36 - الطارف", "37 - تندوف", "38 - تسمسيلت", "39 - الوادي", "40 - خنشلة",
  "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة",
  "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - تيميمون", "50 - برج باجي مختار",
  "51 - أولاد جلال", "52 - بني عباس", "53 - عين صالح", "54 - عين قزام", "55 - تقرت",
  "56 - جانت", "57 - المغير", "58 - المنيعة"
];

export const TEACHERS_PROFILES: TeacherProfile[] = [
  {
    id: "tch-1",
    name: "الأستاذ عبد القادر بن سالم",
    title: "أستاذ مكون في العلوم الفيزيائية - خبرة 18 سنة",
    bio: "مفتش ومؤلف مذكرات بكالوريا متميزة. متخصص في المتابعة الزمنية والظواهر الكهربائية والميكانيك لطلبة البكالوريا.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    wilaya: "19 - سطيف",
    specialty: "العلوم الفيزيائية والتكنولوجيا",
    experienceYears: 18,
    courseCount: 3,
  },
  {
    id: "tch-2",
    name: "الأستاذة مريم خروبي",
    title: "أستاذة الرياضيات للطور الثانوي والتحضيري",
    bio: "أستاذة ذات شهرة وطنية في تبسيط الدوال العددية، المتتاليات، والاحتمالات مع حل أكثر من 120 تمريناً نموذجياً للبكالوريا.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    wilaya: "16 - الجزائر العاصمة",
    specialty: "الرياضيات",
    experienceYears: 14,
    courseCount: 4,
  },
  {
    id: "tch-3",
    name: "الأستاذ سليم معوش",
    title: "أستاذ علوم الطبيعة والحياة - شعبة علوم تجريبية",
    bio: "متخصص في منهجية الإجابة الجديدة للبكالوريا، تركيب البروتين، والمناعة والجيولوجيا مع ملخصات ورسوم تخطيطية حصرية.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    wilaya: "31 - وهران",
    specialty: "علوم الطبيعة والحياة",
    experienceYears: 12,
    courseCount: 2,
  },
  {
    id: "tch-4",
    name: "الأستاذ رشيد شريف",
    title: "أستاذ مادة الفلسفة واللغة العربية",
    bio: "خبير صياغة المقالات الفلسفية (المقارنة، الجدلية، والاستقصاء بالوضع) وطرق الحصول على العلامة الكاملة في بكالوريا الآداب والعلوم.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    wilaya: "25 - قسنطينة",
    specialty: "الفلسفة والعلوم الإنسانية",
    experienceYears: 16,
    courseCount: 2,
  },
  {
    id: "tch-5",
    name: "الأستاذة ياسمين بلقاسم",
    title: "أستاذة اللغة الإنجليزية والفرنسية للمتوسط والبكالوريا",
    bio: "إتقان اللغات الأجنبية وفق البرنامج الوزاري، مع حل نصوص البكالوريا السابقة وشرح القواعد بأسلوب مبسط وشيق.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    wilaya: "09 - البليدة",
    specialty: "اللغات الأجنبية",
    experienceYears: 10,
    courseCount: 2,
  }
];

export const SUBJECTS_LIST: SubjectModel[] = [
  {
    id: "subj-math",
    name: "الرياضيات",
    code: "MATH",
    level: "secondary",
    iconName: "Calculator",
    colorHex: "#0284C7",
    description: "الدوال العددية، المتتاليات، الهندسة الفضائية، الأعداد المركبة والاحتمالات للبكالوريا والبيام.",
  },
  {
    id: "subj-physics",
    name: "العلوم الفيزيائية",
    code: "PHYS",
    level: "secondary",
    iconName: "Atom",
    colorHex: "#0D9488",
    description: "المتابعة الزمنية، الكهرباء RC و RL، الميكانيك وتطبيقات قوانين نيوتن، والاسترة والظواهر النووية.",
  },
  {
    id: "subj-science",
    name: "علوم الطبيعة والحياة",
    code: "SNV",
    level: "secondary",
    iconName: "Microscope",
    colorHex: "#16A34A",
    description: "تركيب البروتين، النشاط الإنزيمي، دور البروتينات في الدفاع عن الذات (المناعة)، والاتصال العصبي.",
  },
  {
    id: "subj-philosophy",
    name: "الفلسفة",
    code: "PHIL",
    level: "secondary",
    iconName: "BookOpenCheck",
    colorHex: "#EA580C",
    description: "منهجيات كتابة المقال الفلسفي ومناقشة الإشكاليات لجميع الشعب العلمية والأدبية.",
  },
  {
    id: "subj-arabic",
    name: "اللغة العربية وآدابها",
    code: "ARAB",
    level: "secondary",
    iconName: "PenTool",
    colorHex: "#9333EA",
    description: "عصر الضعف، عصر النهضة، شعر المهجر، الالتزام في الشعر، البلاغة والقواعد والإعراب التام.",
  },
  {
    id: "subj-languages",
    name: "اللغات الأجنبية (فرنسية / إنجليزية)",
    code: "LANG",
    level: "secondary",
    iconName: "Globe",
    colorHex: "#4F46E5",
    description: "Le texte d'histoire, l'appel, le débat d'idées، وقواعد اللغة الإنجليزية للبكالوريا والبيام.",
  },
  {
    id: "subj-history-geo",
    name: "التاريخ والجغرافيا",
    code: "HIST",
    level: "secondary",
    iconName: "MapPin",
    colorHex: "#B45309",
    description: "الحرب الباردة، الثورة التحريرية الجزائرية، القوى الاقتصادية الكبرى، مصطلحات وتواريخ وخريطة التوقيع.",
  },
  {
    id: "subj-accounting",
    name: "التسيير المالي والمحاسبي",
    code: "GEST",
    level: "secondary",
    iconName: "FileSpreadsheet",
    colorHex: "#059669",
    description: "أعمال نهاية السنة، تسوية المخزونات، الميزانية الوظيفية وجدول حسابات النتائج لشعبة تسيير واقتصاد.",
  }
];

export const INITIAL_ALGERIAN_COURSES: CourseModel[] = [
  {
    id: "dz-course-101",
    title: "مراجعة شاملة ومكثفة في العلوم الفيزيائية - بكالوريا 2026",
    description: "دورة شاملة ومفصلة لجميع وحدات المنهاج الجزائري: المتابعة الزمنية لقياس الناقلية وحجم الغازات، الدارات الكهربائية RC و RL، الميكانيك وقوانين نيوتن وحركة الكواكب والقذائف، مع حل بكالوريات سابقة نموذجية خطوة بخطوة بالمنهجية الرسمية.",
    price: 2500,
    oldPrice: 3500,
    duration: "32 ساعة تدريبية",
    instructors: ["الأستاذ عبد القادر بن سالم"],
    teacherIds: ["tch-1"],
    subjectId: "subj-physics",
    subjectName: "العلوم الفيزيائية",
    academicLevel: "secondary",
    levelLabel: "3 ثانوي - بكالوريا",
    branch: "شعبة علوم تجريبية / رياضيات / تقني رياضي",
    session: 28,
    category: "بكالوريا 2026",
    isBestSeller: true,
    isFeatured: true,
    isNew: false,
    cover: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "الوحدة 1: المتابعة الزمنية لتحول كيميائي في وسط مائي",
      "الوحدة 2: تطور جملة ميكانيكية وقوانين نيوتن",
      "الوحدة 3: الظواهر الكهربائية (ثنائي القطب RC و RL)",
      "الوحدة 4: تطور جملة كيميائية نحو حالة التوازن",
      "حل 15 موضوع بكالوريا رسمية مع سلم التنقيط الوزاري"
    ],
    sections: [
      {
        id: "sec-1",
        title: "الوحدة الأولى: المتابعة الزمنية لتحول كيميائي",
        order: 1,
        lessons: [
          {
            id: "les-101",
            title: "مدخل وتذكير بجدول التقدم وتفاعلات أكسدة-إرجاع",
            duration: "35 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            isPreview: true,
            attachments: [
              {
                id: "att-1",
                title: "ملخص القوانين وجداول التقدم الشاملة (PDF)",
                type: "summary",
                size: "2.4 ميغابايت",
                fileUrl: "#"
              },
              {
                id: "att-2",
                title: "سلسلة تمارين الوحدة الأولى مع الحل النموذجي",
                type: "exam_paper",
                size: "4.8 ميغابايت",
                fileUrl: "#"
              }
            ]
          },
          {
            id: "les-102",
            title: "المتابعة الزمنية عن طريق قياس الناقلية الكهربائية G و σ",
            duration: "48 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            attachments: [
              {
                id: "att-3",
                title: "مذكرة تفصيلية لتطبيقات الناقلية في البكالوريا",
                type: "pdf",
                size: "1.9 ميغابايت",
                fileUrl: "#"
              }
            ]
          },
          {
            id: "les-103",
            title: "سرعة التفاعل، السرعة الحجمية، وزمن نصف التفاعل t 1/2",
            duration: "52 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          }
        ]
      },
      {
        id: "sec-2",
        title: "الوحدة الثانية: تطور جملة ميكانيكية (الميكانيك)",
        order: 2,
        lessons: [
          {
            id: "les-201",
            title: "القوانين الثلاثة لنيوتن وتحديد الشروط الابتدائية",
            duration: "40 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            attachments: [
              {
                id: "att-4",
                title: "مخطط القوى والمراجع العطالية (ملخص بصري)",
                type: "summary",
                size: "3.1 ميغابايت",
                fileUrl: "#"
              }
            ]
          },
          {
            id: "les-202",
            title: "حركة الأقمار الاصطناعية والكواكب وقوانين كبلر",
            duration: "45 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
          {
            id: "les-203",
            title: "حركة القذائف في حقل الجاذبية الأرضية المنتظم وتعيين المدى والذروة",
            duration: "58 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
          }
        ]
      },
      {
        id: "sec-3",
        title: "الوحدة الثالثة: الظواهر الكهربائية (RC و RL)",
        order: 3,
        lessons: [
          {
            id: "les-301",
            title: "ثنائي القطب RC: شحن وتفريغ مكثفة والمعادلات التفاضلية",
            duration: "50 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          },
          {
            id: "les-302",
            title: "ثنائي القطب RL: تطبيق وشيعة وتأثير التحريض الذاتي L",
            duration: "46 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          }
        ]
      }
    ]
  },
  {
    id: "dz-course-102",
    title: "الماستر كلاس في الدوال العددية واللوغاريتمية والأسية",
    description: "كورس تدريبي احترافي للسيطرة على 7 نقاط كاملة في موضوع الرياضيات للبكالوريا. دراسة التغيرات، حساب النهايات، المستقيمات المقاربة، المناقشة البيانية بأنواعها، ودراسة الدوال الأصلية وحساب التكامل وحساب المساحات.",
    price: 2000,
    oldPrice: 2800,
    duration: "26 ساعة تدريبية",
    instructors: ["الأستاذة مريم خروبي"],
    teacherIds: ["tch-2"],
    subjectId: "subj-math",
    subjectName: "الرياضيات",
    academicLevel: "secondary",
    levelLabel: "3 ثانوي - بكالوريا",
    branch: "جميع الشعب العلمية والتقنية",
    session: 24,
    category: "بكالوريا 2026",
    isBestSeller: true,
    isFeatured: true,
    isNew: false,
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "دراسة الدوال العددية واشتقاق الدوال المركبة",
      "الدوال الأسية Exp والدوال اللوغاريتمية النيبيرية Ln",
      "المناقشة البيانية (الأفقية، المائلة، والدورانية)",
      "مبرهنة القيم المتوسطة ونقاط الانعطاف والتماثل",
      "حل 20 مسألة نموذجية شاملة من بكالوريات سابقة"
    ],
    sections: [
      {
        id: "sec-m1",
        title: "القسم الأول: الدوال العددية والنهايات والاشتقاقية",
        order: 1,
        lessons: [
          {
            id: "les-m101",
            title: "مفهوم النهاية وطرق إزالة حالات عدم التعيين الأربعة",
            duration: "42 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            isPreview: true,
            attachments: [
              {
                id: "att-m1",
                title: "مذكرة قواعد النهايات والعمليات عليها (PDF)",
                type: "summary",
                size: "1.8 ميغابايت",
                fileUrl: "#"
              }
            ]
          },
          {
            id: "les-m102",
            title: "الاشتقاقية، التفسير الهندسي، ومعادلة المماس ونقاط الانعطاف",
            duration: "47 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          }
        ]
      },
      {
        id: "sec-m2",
        title: "القسم الثاني: الدوال الأسية واللوغاريتمية",
        order: 2,
        lessons: [
          {
            id: "les-m201",
            title: "الخواص الجبرية للدالة الأسية والنهايات الشهيرة وحل المعادلات",
            duration: "55 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          },
          {
            id: "les-m202",
            title: "الدالة اللوغاريتمية النيبيرية ومسائل البكالوريا المشتركة",
            duration: "50 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          }
        ]
      }
    ]
  },
  {
    id: "dz-course-103",
    title: "المنهجية الرسمية في علوم الطبيعة والحياة - شعبة علوم تجريبية",
    description: "تعلم أسرار الصياغة العلمية للبكالوريا حسب دليل التصحيح الوزاري المعتمد. كيفية تحليل المنحنيات البيانية، استغلال الوثائق، صياغة الفرضيات، والاستدلال العلمي في تركيب البروتين، التخصص الوظيفي للبروتينات، والمناعة والاتصال العصبي.",
    price: 1800,
    oldPrice: 2400,
    duration: "20 ساعة تدريبية",
    instructors: ["الأستاذ سليم معوش"],
    teacherIds: ["tch-3"],
    subjectId: "subj-science",
    subjectName: "علوم الطبيعة والحياة",
    academicLevel: "secondary",
    levelLabel: "3 ثانوي - بكالوريا",
    branch: "شعبة علوم تجريبية",
    session: 18,
    category: "بكالوريا 2026",
    isBestSeller: false,
    isFeatured: true,
    isNew: true,
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "منهجية التعامل مع التمرين الأول (استرجاع المعلومات - 5 نقاط)",
      "منهجية التمرين الثاني (التفسير العلمي والاستدلال - 7 نقاط)",
      "منهجية التمرين الثالث (المسعى العلمي والتحقق من الفرضيات - 8 نقاط)",
      "وحدات تركيب البروتين والمناعة بالتفصيل"
    ],
    sections: [
      {
        id: "sec-s1",
        title: "الوحدة 1: آليات تركيب البروتين (الاستنساخ والترجمة)",
        order: 1,
        lessons: [
          {
            id: "les-s101",
            title: "المقر والآلية: الاستنساخ ومراحله ومقارنة بنية DNA و RNA",
            duration: "38 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            isPreview: true,
            attachments: [
              {
                id: "att-s1",
                title: "مخطط تحصيلي لآلية تركيب البروتين ملون (PDF)",
                type: "summary",
                size: "3.5 ميغابايت",
                fileUrl: "#"
              }
            ]
          },
          {
            id: "les-s102",
            title: "الشفرة الوراثية وتنشيط الأحماض الأمينية ومرحلة الترجمة",
            duration: "44 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          }
        ]
      }
    ]
  },
  {
    id: "dz-course-104",
    title: "فن المقال الفلسفي والحصول على 16+ في البكالوريا",
    description: "الدورة الأقوى لكسر عقدة الفلسفة لجميع الشعب. تدريب عملي مكثف على المقارنة والجدلية والاستقصاء بالوضع وتحليل النص الفلسفي، مع بنك نماذج فلسفية جاهزة ومحفوظة وفق معايير المصحح الوزاري.",
    price: 1500,
    oldPrice: 2000,
    duration: "16 ساعة تدريبية",
    instructors: ["الأستاذ رشيد شريف"],
    teacherIds: ["tch-4"],
    subjectId: "subj-philosophy",
    subjectName: "الفلسفة",
    academicLevel: "secondary",
    levelLabel: "3 ثانوي - بكالوريا",
    branch: "شعبة آداب وفلسفة / لغات / علوم ورياضيات",
    session: 14,
    category: "بكالوريا 2026",
    isBestSeller: true,
    isFeatured: false,
    isNew: false,
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "خطوات بناء المقال الجدلي (المقدمة، الموقف الأول، نقيض الموقف، التركيب، الخاتمة)",
      "طريقة الاستقصاء بالوضع والدفاع عن أطروحة تبدو غير صحيحة",
      "أبرز مقالات البكالوريا المقترحة لعام 2026 مع الأقوال الفلسفية"
    ],
    sections: [
      {
        id: "sec-p1",
        title: "القسم الأول: المنهجيات الأساسية لصياغة المقال",
        order: 1,
        lessons: [
          {
            id: "les-p101",
            title: "قواعد التقديم السليم وصياغة الإشكال الفلسفي بدون حفظ أعمى",
            duration: "30 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            isPreview: true,
            attachments: [
              {
                id: "att-p1",
                title: "دليل المقالات الفلسفية المقررة ومصطلحاتها (PDF)",
                type: "summary",
                size: "2.1 ميغابايت",
                fileUrl: "#"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "dz-course-105",
    title: "التحضير المتكامل لشهادة التعليم المتوسط BEM 2026 - الرياضيات",
    description: "برنامج مكثف لتلاميذ سنة رابعة متوسط (BEM). الحساب على الجذور، القاسم المشترك الأكبر PGCD، الحساب الحرفي والنشر والتحليل، مبرهنة طالس وفيثاغورس، الأشعة والمعالم والدوال الخطية والتآلفية، مع حل أكثر من 50 وضعية إدماجية.",
    price: 1200,
    oldPrice: 1800,
    duration: "18 ساعة تدريبية",
    instructors: ["الأستاذة مريم خروبي"],
    teacherIds: ["tch-2"],
    subjectId: "subj-math",
    subjectName: "الرياضيات",
    academicLevel: "middle",
    levelLabel: "4 متوسط - شهادة BEM",
    branch: "التعليم المتوسط",
    session: 16,
    category: "شهادة البيام BEM",
    isBestSeller: false,
    isFeatured: true,
    isNew: true,
    cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "الأعداد الطبيعية والناطقة وحساب PGCD",
      "الحساب على الجذور وتبسيط العبارات الجبرية",
      "الهندسة في الفضاء والنسب المثلثية وطالس",
      "حلول الوضعيات الإدماجية لشهادات BEM السابقة"
    ],
    sections: [
      {
        id: "sec-bem1",
        title: "المحور 1: الأعداد والحساب على الجذور",
        order: 1,
        lessons: [
          {
            id: "les-bem101",
            title: "خوارزمية إقليدس لتعيين القاسم المشترك الأكبر PGCD والكسور غير القابلة للاختزال",
            duration: "32 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            isPreview: true,
          }
        ]
      }
    ]
  },
  {
    id: "dz-course-106",
    title: "قواعد اللغة الإنجليزية للطور الثانوي وتحصيل العلامة الكاملة",
    description: "شرح شامل ومبسط لقواعد البكالوريا: Direct and Indirect Speech, Passive Voice, Conditional type 2 & 3, Wishes and regrets, بالإضافة إلى منهجية كتابة فقرة معبرة (Written Expression) وتجنب الأخطاء الإملائية.",
    price: 1000,
    oldPrice: 1500,
    duration: "14 ساعة تدريبية",
    instructors: ["الأستاذة ياسمين بلقاسم"],
    teacherIds: ["tch-5"],
    subjectId: "subj-languages",
    subjectName: "اللغات الأجنبية",
    academicLevel: "secondary",
    levelLabel: "3 ثانوي - بكالوريا",
    branch: "جميع الشعب",
    session: 12,
    category: "اللغات الأجنبية",
    isBestSeller: false,
    isFeatured: false,
    isNew: false,
    cover: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=900&auto=format&fit=crop&q=80",
    curriculumOverview: [
      "Grammar essentials and verb tenses",
      "Morphology: roots, prefixes, and suffixes",
      "Pronunciation: final 'ed' and final 's'",
      "Writing tips for high score in the exam"
    ],
    sections: [
      {
        id: "sec-eng1",
        title: "Unit 1: Grammar & Syntax Mastery",
        order: 1,
        lessons: [
          {
            id: "les-eng101",
            title: "Conditional Sentences & Expressing Wishes in BAC Exams",
            duration: "34 دقيقة",
            contentType: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            isPreview: true,
          }
        ]
      }
    ]
  }
];

export const PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: "ban-1",
    title: "عرض البكالوريا الذهبي 2026",
    subtitle: "خصم 30% على دورات المراجعة النهائية في الفيزياء والرياضيات",
    badge: "تخفيض محدود",
    bgColor: "from-emerald-700 to-emerald-900",
    targetCourseId: "dz-course-101",
  },
  {
    id: "ban-2",
    title: "طرق الدفع الجزائرية مفعّلة بالكامل",
    subtitle: "اشحن محفظتك ببطاقات التعبئة أو التحويل الفوري عبر بريدي موب BaridiMob",
    badge: "دفع محلي 100%",
    bgColor: "from-blue-700 to-indigo-900",
  },
  {
    id: "ban-3",
    title: "شعب التعليم الثانوي والمتوسط",
    subtitle: "محتوى موثوق ومفصل حسب التدرج السنوي لوزارة التربية الوطنية الجزائرية",
    badge: "المنهاج الرسمي",
    bgColor: "from-amber-700 to-red-900",
  }
];

export const DZ_FAQ_LIST = [
  {
    question: "كيف يمكنني شراء دورة تعليمية على منصة قرايتي DZ؟",
    answer: "يمكنك شراء أي دورة مباشرة عبر رصيد محفظتك الرقمية داخل التطبيق، أو باختيار الدفع عبر بريدي موب (BaridiMob) بإرسال المبلغ لحساب المنصة ورفع صورة وصل التحويل لتفعيل الدورة فوراً، أو استخدام بطاقات التعبئة (Vouchers) المتوفرة في المكتبات ونقاط البيع المعتمدة عبر التراب الوطني."
  },
  {
    question: "هل أحتاج إلى إنترنت سريع لمشاهدة الدروس؟",
    answer: "تم تصميم منصة قرايتي DZ لتعمل بكفاءة على مختلف سرعات الإنترنت في الجزائر. تدعم مقاطع الفيديو التكيف التلقائي مع سرعة الاتصال، كما تتوفر الملخصات والوثائق كملفات PDF خفيفة الحجم للقراءة والمراجعة."
  },
  {
    question: "كيف تتم حماية الدورات والدروس من القرصنة وتصوير الشاشة؟",
    answer: "تعتمد المنصة تقنية العلامة المائية الديناميكية المتحركة التي تعرض رقم هاتف الطالب واسمه بشكل شفاف فوق الفيديو، مما يمنع إعادة النشر أو التسجيل غير المصرح به ويحمي حقوق المحتوى التعليمي."
  },
  {
    question: "هل يمكنني التواصل مع الأستاذ لطرح الاستفسارات؟",
    answer: "نعم، كل دورة توفر ملخصات ومرفقات رسمية ومصادر مساعدة. يتم إرفاق مذكرات الأستاذ وتدريباته النموذجية في خانة المرفقات مع كل درس."
  },
  {
    question: "ما هي العملة المستخدمة في المنصة؟",
    answer: "جميع الأسعار والمعاملات داخل المنصة تتم بالدينار الجزائري (DZD)، بأسعار مدروسة في متناول العائلات والطلبة الجزائريين."
  }
];

import { Exam } from "../types";

export const EXAMS_DATA: Exam[] = [
  {
    id: "exam-dz-1",
    name: "اختبار تقييمي: المتابعة الزمنية والناقلية (فيزياء بكالوريا)",
    time: "20 دقيقة",
    timeSeconds: 1200,
    questionCount: 4,
    questionAssetName: "physics_bac.json",
    questions: [
      {
        question: "ما هي الوحدة الدولية للناقلية النوعية σ في المحاليل المائية؟",
        options: ["S/m (سيمنس على المتر)", "Ohm (أوم)", "Mol/L (مول على اللتر)", "Volt (فولت)"],
        correctAnswer: 0
      },
      {
        question: "ما هو دور وسيط التفاعل (Catalyseur) في التحول الكيميائي؟",
        options: ["تسريع التفاعل دون أن يظهر في المعادلة الإجمالية", "تغيير الحالة النهائية للجملة", "إيقاف التفاعل", "زيادة كمية النواتج القصوى"],
        correctAnswer: 0
      },
      {
        question: "عند زمن نصف التفاعل t 1/2، يكون تقدم التفاعل x مساوياً لـ:",
        options: ["x = x_max / 2", "x = x_max", "x = 2 * x_max", "x = 0"],
        correctAnswer: 0
      },
      {
        question: "أي من العوامل الحركية التالية يؤدي لزيادة سرعة التصادمات الفعالة؟",
        options: ["رفع درجة الحرارة وتركيز المتفاعلات", "خفض درجة الحرارة", "إضافة الماء المقطر", "تقليل مساحة التلامس"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "exam-dz-2",
    name: "اختبار تقييمي: النهايات والدوال الأسية (رياضيات بكالوريا)",
    time: "25 دقيقة",
    timeSeconds: 1500,
    questionCount: 3,
    questionAssetName: "math_bac.json",
    questions: [
      {
        question: "ما هي نهاية الدالة Exp(x) عندما يؤول x إلى +∞؟",
        options: ["+∞", "0", "1", "-∞"],
        correctAnswer: 0
      },
      {
        question: "ما هو مشتق الدالة f(x) = exp(2x + 1)؟",
        options: ["f'(x) = 2 * exp(2x + 1)", "f'(x) = exp(2x + 1)", "f'(x) = 2x * exp(2x + 1)", "f'(x) = exp(2)"],
        correctAnswer: 0
      },
      {
        question: "المستقيم ذو المعادلة y = 0 يمثل مستقيماً مقارباً لمنحنى الدالة الأسية عند:",
        options: ["-∞", "+∞", "عند 0", "عند 1"],
        correctAnswer: 0
      }
    ]
  }
];
