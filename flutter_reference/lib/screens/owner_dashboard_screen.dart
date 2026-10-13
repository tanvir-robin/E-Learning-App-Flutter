import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import '../models/admin_staff_model.dart';

class OwnerDashboardScreen extends StatefulWidget {
  const OwnerDashboardScreen({Key? key}) : super(key: key);

  @override
  State<OwnerDashboardScreen> createState() => _OwnerDashboardScreenState();
}

class _OwnerDashboardScreenState extends State<OwnerDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final AuthController authController = Get.find<AuthController>();

  // Sample managed staff list in Flutter
  final List<AdminStaffModel> staffMembers = [
    AdminStaffModel(
      id: 'staff-01',
      name: 'أيمن بلحاج (المالك والمؤسس)',
      email: 'aymen.belhadj@qrayati.dz',
      phoneNumber: '0661 12 34 56',
      department: AdminDepartment.fullAccess,
      role: 'owner',
      isOwner: true,
      status: StaffStatus.active,
      permissions: ['full_access', 'manage_staff', 'financial_oversight', 'revoke_devices', 'drm_licensing'],
      lastLogin: DateTime.now(),
      lastAction: 'إدارة تراخيص البث والتشفير',
      createdAt: DateTime(2024, 1, 1),
      invitedBy: 'المؤسس',
    ),
    AdminStaffModel(
      id: 'staff-02',
      name: 'أمينة بوقرة (الرقابة المالية)',
      email: 'amina.bouguerra@qrayati.dz',
      phoneNumber: '0550 88 12 43',
      department: AdminDepartment.finance,
      role: 'admin',
      isOwner: false,
      status: StaffStatus.active,
      permissions: ['view_finances', 'approve_recharges', 'process_refunds'],
      lastLogin: DateTime.now().subtract(const Duration(hours: 3)),
      lastAction: 'اعتماد 12 حوالة بريدي موب وCIB',
      createdAt: DateTime(2024, 3, 15),
      invitedBy: 'أيمن بلحاج',
    ),
    AdminStaffModel(
      id: 'staff-03',
      name: 'ياسين بن عودة (الدعم - الغرب)',
      email: 'yacine.benouda@qrayati.dz',
      phoneNumber: '0662 99 88 77',
      department: AdminDepartment.support,
      role: 'admin',
      isOwner: false,
      status: StaffStatus.active,
      permissions: ['reset_sessions', 'unbind_devices'],
      isTemporary: true,
      expiresAt: DateTime(2026, 11, 1),
      assignedWilayas: ['31 - وهران', '13 - تلمسان'],
      lastLogin: DateTime.now().subtract(const Duration(hours: 1)),
      lastAction: 'إلغاء ربط هاتف قديم لطالب بعد التحقق',
      createdAt: DateTime(2024, 9, 1),
      invitedBy: 'أيمن بلحاج',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        appBar: AppBar(
          title: const Text(
            'لوحة المالك العام — قرايتي DZ',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white),
          ),
          backgroundColor: const Color(0xFF020617),
          elevation: 0,
          bottom: TabBar(
            controller: _tabController,
            isScrollable: true,
            indicatorColor: const Color(0xFF10B981),
            labelColor: const Color(0xFF10B981),
            unselectedLabelColor: const Color(0xFF94A3B8),
            tabs: const [
              Tab(icon: Icon(Icons.dashboard_outlined), text: 'نظرة عامة'),
              Tab(icon: Icon(Icons.people_alt_outlined), text: 'الموظفون (RBAC)'),
              Tab(icon: Icon(Icons.monetization_on_outlined), text: 'المالية والتحويلات'),
              Tab(icon: Icon(Icons.security_outlined), text: 'الأمان والتدقيق'),
              Tab(icon: Icon(Icons.phonelink_setup_outlined), text: 'الأجهزة المرتبطة'),
            ],
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildOverviewTab(),
            _buildStaffTab(),
            _buildFinanceTab(),
            _buildSecurityTab(),
            _buildDevicesTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.4)),
            ),
            child: const Row(
              children: [
                Icon(Icons.workspace_premium, color: Color(0xFFF59E0B), size: 36),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'سيادة المالك وحصانة المنصة',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Text(
                        'جميع الجلسات والأجهزة وطاقم الإدارة تحت الرقابة التامة وحصانة الحساب المؤسس.',
                        style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Metric Cards
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  title: 'إيرادات المنصة',
                  value: '4,850,000 دج',
                  subtitle: '+142,500 دج اليوم',
                  color: const Color(0xFF10B981),
                  icon: Icons.payments_outlined,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(
                  title: 'الأجهزة الموثوقة',
                  value: '948 جهاز',
                  subtitle: 'Keystore Hardware L3',
                  color: const Color(0xFF38BDF8),
                  icon: Icons.fingerprint,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStaffTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: staffMembers.length,
      itemBuilder: (context, index) {
        final staff = staffMembers[index];
        return Card(
          color: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: staff.isOwner ? const Color(0xFFF59E0B) : const Color(0xFF334155),
            ),
          ),
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      staff.name,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: staff.isOwner ? Colors.amber.withOpacity(0.2) : Colors.emerald.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        staff.isOwner ? 'المالك' : 'إداري',
                        style: TextStyle(
                          color: staff.isOwner ? Colors.amber : Colors.emerald,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${staff.email} • ${staff.phoneNumber}',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                ),
                const SizedBox(height: 8),
                Text(
                  'آخر إجراء: ${staff.lastAction}',
                  style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12),
                ),
                if (staff.assignedWilayas != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'نطاق العمل: ${staff.assignedWilayas!.join("، ")}',
                    style: const TextStyle(color: Color(0xFF818CF8), fontSize: 11),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFinanceTab() {
    return const Center(
      child: Text(
        'تدقيق الحوالات وإيصالات بريدي موب وSATIM نشط ومربوط بـ 15% عمولة تشغيلية',
        style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
      ),
    );
  }

  Widget _buildSecurityTab() {
    return const Center(
      child: Text(
        'نظام الكشف عن البث المتزامن ومحاولات التحايل يعمل في الوقت الفعلي',
        style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
      ),
    );
  }

  Widget _buildDevicesTab() {
    return const Center(
      child: Text(
        'إدارة الأجهزة المعتمدة وتشفير التخزين عبر Biometric Keystore L3',
        style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
      ),
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required String subtitle,
    required Color color,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 2),
          Text(subtitle, style: TextStyle(color: color, fontSize: 10)),
        ],
      ),
    );
  }
}
