enum AdminDepartment {
  support,
  finance,
  content,
  security,
  fullAccess,
}

enum StaffStatus {
  active,
  suspended,
  pendingInvite,
}

class AdminStaffModel {
  final String id;
  final String name;
  final String email;
  final String phoneNumber;
  final AdminDepartment department;
  final String role; // 'admin' | 'owner'
  final bool isOwner;
  final StaffStatus status;
  final List<String> permissions;
  final bool isTemporary;
  final DateTime? expiresAt;
  final List<String>? assignedWilayas;
  final DateTime lastLogin;
  final String lastAction;
  final DateTime createdAt;
  final String invitedBy;

  AdminStaffModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.department,
    required this.role,
    required this.isOwner,
    required this.status,
    required this.permissions,
    this.isTemporary = false,
    this.expiresAt,
    this.assignedWilayas,
    required this.lastLogin,
    required this.lastAction,
    required this.createdAt,
    required this.invitedBy,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phoneNumber': phoneNumber,
      'department': department.name,
      'role': role,
      'isOwner': isOwner,
      'status': status.name,
      'permissions': permissions,
      'isTemporary': isTemporary,
      'expiresAt': expiresAt?.toIso8601String(),
      'assignedWilayas': assignedWilayas,
      'lastLogin': lastLogin.toIso8601String(),
      'lastAction': lastAction,
      'createdAt': createdAt.toIso8601String(),
      'invitedBy': invitedBy,
    };
  }

  factory AdminStaffModel.fromMap(Map<String, dynamic> map) {
    return AdminStaffModel(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      phoneNumber: map['phoneNumber'] ?? '',
      department: AdminDepartment.values.firstWhere(
        (e) => e.name == map['department'],
        orElse: () => AdminDepartment.support,
      ),
      role: map['role'] ?? 'admin',
      isOwner: map['isOwner'] ?? false,
      status: StaffStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => StaffStatus.active,
      ),
      permissions: List<String>.from(map['permissions'] ?? []),
      isTemporary: map['isTemporary'] ?? false,
      expiresAt: map['expiresAt'] != null ? DateTime.tryParse(map['expiresAt']) : null,
      assignedWilayas: map['assignedWilayas'] != null ? List<String>.from(map['assignedWilayas']) : null,
      lastLogin: DateTime.tryParse(map['lastLogin'] ?? '') ?? DateTime.now(),
      lastAction: map['lastAction'] ?? '',
      createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
      invitedBy: map['invitedBy'] ?? '',
    );
  }
}
