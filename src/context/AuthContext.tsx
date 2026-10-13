import { adminOpsService } from "../services/AdminOperationsService";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CourseModel,
  EnrolledCourse,
  User,
  UserWallet,
  TransactionRecord,
  NotificationItem,
  TeacherProfile,
  SubjectModel,
  UserRole
} from "../types";
import {
  INITIAL_ALGERIAN_COURSES,
  TEACHERS_PROFILES,
  SUBJECTS_LIST
} from "../data/coursesData";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  courses: CourseModel[];
  teachers: TeacherProfile[];
  subjects: SubjectModel[];
  enrolledCourses: EnrolledCourse[];
  wallet: UserWallet;
  notifications: NotificationItem[];
  cart: string[]; // course IDs in cart
  // Auth methods
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, phone?: string, wilaya?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  // Purchase & Wallet methods
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  purchaseCourseWithWallet: (course: CourseModel) => Promise<{ success: boolean; message: string }>;
  purchaseCourseWithBaridimob: (course: CourseModel, rip: string, receiptProofBase64?: string) => Promise<{ success: boolean; message: string }>;
  redeemVoucher: (code: string) => Promise<{ success: boolean; message: string; amount?: number }>;
  topUpWalletBaridimob: (amount: number, receiptProofBase64?: string) => Promise<{ success: boolean; message: string }>;
  // Progress & Learning
  updateCourseProgress: (courseId: string, progress: number, completedLessons?: string[]) => void;
  isEnrolled: (courseId: string) => boolean;
  // Admin methods (Admin only adds and publishes courses, teachers, and subjects)
  addNewCourse: (course: Omit<CourseModel, "id">) => CourseModel;
  updateCourse: (id: string, updates: Partial<CourseModel>) => void;
  deleteCourse: (id: string) => void;
  addNewTeacher: (teacher: Omit<TeacherProfile, "id">) => TeacherProfile;
  addNewSubject: (subject: Omit<SubjectModel, "id">) => SubjectModel;
  markNotificationAsRead: (id: string) => void;
  switchUserRole?: (role: UserRole) => void;
}

const DEFAULT_USER: User = {
  uid: "dz-std-2026",
  name: "أيمن بلحاج (تلميذ)",
  email: "student@qrayati.dz",
  phone: "0770 45 88 12",
  wilaya: "16 - الجزائر العاصمة",
  academicLevel: "secondary",
  branch: "شعبة علوم تجريبية",
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  isAdmin: false,
  role: "student",
};

const DEFAULT_WALLET: UserWallet = {
  balance: 5000, // 5,000 DZD default starting balance
  pendingBalance: 0,
  transactions: [
    {
      id: "tx-init-1",
      type: "deposit",
      amount: 5000,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      title: "شحن رصيد المحفظة عبر بطاقة تعبئة قرايتي DZ",
      referenceNumber: "DZ-VOUCH-7894",
      status: "completed",
      paymentMethod: "voucher",
    }
  ],
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "مرحباً بك في منصة قرايتي DZ",
    message: "تم تفعيل حسابك بنجاح. تصفح دورات بكالوريا 2026 والبيام لمباشرة دراستك.",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: false,
    type: "system",
  },
  {
    id: "notif-2",
    title: "تم إضافة رصيد المحفظة",
    message: "تمت إضافة مبلغ 5,000 دج إلى رصيدك بنجاح، يمكنك الآن شراء الدورات فوراً.",
    date: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    type: "wallet",
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("qrayati_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [courses, setCourses] = useState<CourseModel[]>(() => {
    const saved = localStorage.getItem("qrayati_courses");
    return saved ? JSON.parse(saved) : INITIAL_ALGERIAN_COURSES;
  });

  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => {
    const saved = localStorage.getItem("qrayati_teachers");
    return saved ? JSON.parse(saved) : TEACHERS_PROFILES;
  });

  const [subjects, setSubjects] = useState<SubjectModel[]>(() => {
    const saved = localStorage.getItem("qrayati_subjects");
    return saved ? JSON.parse(saved) : SUBJECTS_LIST;
  });

  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem("qrayati_wallet");
    return saved ? JSON.parse(saved) : DEFAULT_WALLET;
  });

  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem("qrayati_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("qrayati_notifications");
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(() => {
    const saved = localStorage.getItem("qrayati_enrolled");
    if (saved) return JSON.parse(saved);
    // Seed initial course enrollment
    const initialCourse = INITIAL_ALGERIAN_COURSES[0];
    return [
      {
        courseId: initialCourse.id,
        course: initialCourse,
        enrolledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        progress: 0.35,
        lastAccessed: new Date().toISOString(),
        price: initialCourse.price,
        completedLessons: ["les-101"],
        purchaseMethod: "wallet",
        receiptId: "DZ-REC-2026-001",
      }
    ];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("qrayati_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("qrayati_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("qrayati_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("qrayati_teachers", JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem("qrayati_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("qrayati_wallet", JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem("qrayati_enrolled", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem("qrayati_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("qrayati_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const signIn = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    
    // Authorize through central administrative directory
    const cleanEmail = email.trim().toLowerCase();
    const adminCheck = adminOpsService.verifyAdministrativeAccess({ email: cleanEmail });
    
    let role: UserRole = "student";
    let isAdmin = false;
    let name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    if (adminCheck.isAuthorized && adminCheck.staffRecord) {
      role = adminCheck.role;
      isAdmin = true;
      name = adminCheck.staffRecord.name;
    } else {
      // Normal student
      role = "student";
      isAdmin = false;
      if (cleanEmail === "student@qrayati.dz") {
        name = "أيمن بلحاج (تلميذ)";
      }
    }

    const user: User = {
      uid: "dz-usr-" + Math.random().toString(36).substring(2, 9),
      name,
      email: cleanEmail,
      phone: adminCheck.staffRecord?.phoneNumber || "0555 12 34 56",
      wilaya: "16 - الجزائر العاصمة",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isAdmin,
      role,
    };
    setCurrentUser(user);
    setIsLoading(false);
    return true;
  };

  const signUp = async (
    email: string,
    _password: string,
    name: string,
    phone?: string,
    wilaya?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    const user: User = {
      uid: "dz-usr-" + Math.random().toString(36).substring(2, 9),
      name: name || "طالب جديد",
      email,
      phone: phone || "0660 00 00 00",
      wilaya: wilaya || "16 - الجزائر العاصمة",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isAdmin: false,
      role: "student",
    };
    setCurrentUser(user);
    setIsLoading(false);
    return true;
  };

  const signOut = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setCurrentUser(null);
    setIsLoading(false);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
  };

  // Cart actions
  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId)) {
      setCart((prev) => [...prev, courseId]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart((prev) => prev.filter((id) => id !== courseId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (courseId: string) => cart.includes(courseId);

  // Wallet and Purchase
  const purchaseCourseWithWallet = async (
    course: CourseModel
  ): Promise<{ success: boolean; message: string }> => {
    if (enrolledCourses.some((e) => e.courseId === course.id)) {
      return { success: false, message: "أنت مسجل بالفعل في هذه الدورة التعليمية." };
    }

    if (wallet.balance < course.price) {
      return {
        success: false,
        message: `رصيد المحفظة الحالي (${wallet.balance.toLocaleString()} دج) غير كافٍ. سعر الدورة: ${course.price.toLocaleString()} دج. يرجى شحن المحفظة أولاً.`,
      };
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    const receiptId = "DZ-REC-" + Date.now().toString().slice(-6);
    const newTx: TransactionRecord = {
      id: "tx-" + Date.now(),
      type: "purchase",
      amount: course.price,
      date: new Date().toISOString(),
      title: `شراء دورة: ${course.title}`,
      referenceNumber: receiptId,
      status: "completed",
      paymentMethod: "wallet",
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - course.price,
      transactions: [newTx, ...prev.transactions],
    }));

    const newEnrolled: EnrolledCourse = {
      courseId: course.id,
      course,
      enrolledAt: new Date().toISOString(),
      progress: 0.0,
      lastAccessed: new Date().toISOString(),
      price: course.price,
      completedLessons: [],
      purchaseMethod: "wallet",
      receiptId,
    };

    setEnrolledCourses((prev) => [newEnrolled, ...prev]);
    removeFromCart(course.id);

    // Add notification
    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      title: "تأكيد شراء الدورة بنجاح",
      message: `تم تسجيلك في دورة "${course.title}" وتم خصم ${course.price.toLocaleString()} دج من محفظتك. رقم الوصل: ${receiptId}`,
      date: new Date().toISOString(),
      read: false,
      type: "order",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsLoading(false);
    return { success: true, message: "تم شراء الدورة وتفعيلها في حسابك بنجاح!" };
  };

  const purchaseCourseWithBaridimob = async (
    course: CourseModel,
    rip: string,
    receiptProofBase64?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (enrolledCourses.some((e) => e.courseId === course.id)) {
      return { success: false, message: "أنت مسجل بالفعل في هذه الدورة التعليمية." };
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    const receiptId = "BM-TRX-" + Date.now().toString().slice(-6);
    const newTx: TransactionRecord = {
      id: "tx-" + Date.now(),
      type: "purchase",
      amount: course.price,
      date: new Date().toISOString(),
      title: `طلب تفعيل دورة عبر بريدي موب: ${course.title}`,
      referenceNumber: receiptId,
      status: "completed",
      paymentMethod: "baridimob",
    };

    setWallet((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    const newEnrolled: EnrolledCourse = {
      courseId: course.id,
      course,
      enrolledAt: new Date().toISOString(),
      progress: 0.0,
      lastAccessed: new Date().toISOString(),
      price: course.price,
      completedLessons: [],
      purchaseMethod: "baridimob_proof",
      receiptId,
    };

    setEnrolledCourses((prev) => [newEnrolled, ...prev]);
    removeFromCart(course.id);

    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      title: "وصل تحويل بريدي موب معتمد",
      message: `تم استلام وتأكيد وصل التحويل لدورة "${course.title}". رقم المعاملة: ${receiptId}`,
      date: new Date().toISOString(),
      read: false,
      type: "order",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsLoading(false);
    return { success: true, message: "تم قبول وصل بريدي موب وتفعيل الدورة بنجاح!" };
  };

  const redeemVoucher = async (code: string): Promise<{ success: boolean; message: string; amount?: number }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    const cleanCode = code.trim().toUpperCase();
    let voucherAmount = 2000; // default 2,000 DZD
    if (cleanCode.includes("5000") || cleanCode.includes("BAC50")) {
      voucherAmount = 5000;
    } else if (cleanCode.includes("1000") || cleanCode.includes("DZ10")) {
      voucherAmount = 1000;
    } else if (cleanCode.includes("2500")) {
      voucherAmount = 2500;
    }

    const newTx: TransactionRecord = {
      id: "tx-" + Date.now(),
      type: "voucher_redeem",
      amount: voucherAmount,
      date: new Date().toISOString(),
      title: `شحن بطاقة تعبئة قرايتي DZ (${cleanCode})`,
      referenceNumber: "VOUCH-" + cleanCode,
      status: "completed",
      paymentMethod: "voucher",
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + voucherAmount,
      transactions: [newTx, ...prev.transactions],
    }));

    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      title: "تم شحن المحفظة بنجاح",
      message: `تمت إضافة ${voucherAmount.toLocaleString()} دج إلى محفظتك باستخدام بطاقة التعبئة: ${cleanCode}`,
      date: new Date().toISOString(),
      read: false,
      type: "wallet",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsLoading(false);
    return {
      success: true,
      message: `تم شحن حسابك بمبلغ ${voucherAmount.toLocaleString()} دج بنجاح!`,
      amount: voucherAmount,
    };
  };

  const topUpWalletBaridimob = async (
    amount: number,
    receiptProofBase64?: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 700));

    const refNum = "BM-DEP-" + Date.now().toString().slice(-6);
    const newTx: TransactionRecord = {
      id: "tx-" + Date.now(),
      type: "deposit",
      amount,
      date: new Date().toISOString(),
      title: "شحن رصيد عبر تحويل بريدي موب",
      referenceNumber: refNum,
      status: "completed",
      paymentMethod: "baridimob",
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTx, ...prev.transactions],
    }));

    const newNotif: NotificationItem = {
      id: "notif-" + Date.now(),
      title: "تم التحقق من إيداع بريدي موب",
      message: `تمت إضافة ${amount.toLocaleString()} دج إلى رصيد محفظتك. المعرف: ${refNum}`,
      date: new Date().toISOString(),
      read: false,
      type: "wallet",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setIsLoading(false);
    return { success: true, message: `تمت إضافة ${amount.toLocaleString()} دج إلى رصيد محفظتك!` };
  };

  const updateCourseProgress = (courseId: string, progress: number, completedLessons?: string[]) => {
    setEnrolledCourses((prev) =>
      prev.map((item) => {
        if (item.courseId === courseId) {
          const updatedCompleted = completedLessons || item.completedLessons || [];
          return {
            ...item,
            progress: Math.min(1.0, Math.max(0.0, progress)),
            lastAccessed: new Date().toISOString(),
            completedLessons: updatedCompleted,
          };
        }
        return item;
      })
    );
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrolledCourses.some((e) => e.courseId === courseId);
  };

  // Admin Management
  const addNewCourse = (courseData: Omit<CourseModel, "id">): CourseModel => {
    const newCourse: CourseModel = {
      ...courseData,
      id: "dz-course-" + Date.now(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<CourseModel>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addNewTeacher = (teacherData: Omit<TeacherProfile, "id">): TeacherProfile => {
    const newTeacher: TeacherProfile = {
      ...teacherData,
      id: "tch-" + Date.now(),
    };
    setTeachers((prev) => [...prev, newTeacher]);
    return newTeacher;
  };

  const addNewSubject = (subjectData: Omit<SubjectModel, "id">): SubjectModel => {
    const newSubject: SubjectModel = {
      ...subjectData,
      id: "subj-" + Date.now(),
    };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  };

    const switchUserRole = (newRole: UserRole) => {
    if (!currentUser) return;
    // Security check: Only verified admin/owner directory members can switch between their granted roles
    const adminCheck = adminOpsService.verifyAdministrativeAccess({ email: currentUser.email });
    if (!adminCheck.isAuthorized && (newRole === "owner" || newRole === "admin")) {
      console.warn("Security Alert: Unauthorized role escalation attempt blocked for " + currentUser.email);
      return;
    }
    const updated = {
      ...currentUser,
      role: newRole,
      isAdmin: newRole === "owner" || newRole === "admin",
    };
    setCurrentUser(updated);
    localStorage.setItem("qrayati_user", JSON.stringify(updated));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        courses,
        teachers,
        subjects,
        enrolledCourses,
        wallet,
        notifications,
        cart,
        signIn,
        signUp,
        signOut,
        updateProfile,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        purchaseCourseWithWallet,
        purchaseCourseWithBaridimob,
        redeemVoucher,
        topUpWalletBaridimob,
        updateCourseProgress,
        isEnrolled,
        addNewCourse,
        updateCourse,
        deleteCourse,
        addNewTeacher,
        addNewSubject,
        markNotificationAsRead,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
