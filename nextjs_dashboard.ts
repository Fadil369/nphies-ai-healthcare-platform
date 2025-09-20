// BRAINSAIT: NPHIES-AI Web Dashboard with Glass Morphism Design
// NEURAL: Next.js 14 with Tailwind CSS and BrainSAIT design system
// BILINGUAL: RTL/LTR support for Arabic/English admin interface

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

// BRAINSAIT: BrainSAIT Color System for Tailwind
const brainSAITColors = {
  midnightBlue: '#1a365d',
  medicalBlue: '#2b6cb8', 
  signalTeal: '#0ea5e9',
  deepOrange: '#ea580c',
  professionalGray: '#64748b',
  glassMorphBg: 'rgba(255, 255, 255, 0.1)',
  glassMorphBorder: 'rgba(255, 255, 255, 0.2)'
};

// Dashboard Data Types
interface DashboardStats {
  totalClaims: number;
  activeSessions: number;
  processedImages: number;
  complianceScore: number;
  todayClaims: number;
  avgProcessingTime: number;
}

interface NPHIESClaim {
  id: string;
  patientId: string;
  providerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  amount: number;
  createdAt: string;
  aiAnalysis?: any;
}

interface AgentMetrics {
  agentName: string;
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  status: 'active' | 'inactive' | 'maintenance';
}

// NEURAL: Glass Morphism Components
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const MeshGradientBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-black">
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            'linear-gradient(45deg, #1a365d, #2b6cb8, #0ea5e9)',
            'linear-gradient(45deg, #2b6cb8, #0ea5e9, #8b5cf6)',
            'linear-gradient(45deg, #1a365d, #2b6cb8, #0ea5e9)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, #2b6cb8 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </div>
);

// BRAINSAIT: Main Dashboard Component
const NPHIESDashboard: React.FC = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalClaims: 0,
    activeSessions: 0,
    processedImages: 0,
    complianceScore: 0,
    todayClaims: 0,
    avgProcessingTime: 0
  });
  const [claims, setClaims] = useState<NPHIESClaim[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);

  // BILINGUAL: Text content
  const texts = {
    ar: {
      title: 'لوحة تحكم نفيس الذكي',
      subtitle: 'BrainSAIT للرعاية الصحية',
      overview: 'نظرة عامة',
      claims: 'المطالبات',
      agents: 'العملاء الذكيين',
      compliance: 'الامتثال',
      settings: 'الإعدادات',
      totalClaims: 'إجمالي المطالبات',
      activeSessions: 'الجلسات النشطة',
      processedImages: 'الصور المعالجة',
      complianceScore: 'نقاط الامتثال',
      todayClaims: 'مطالبات اليوم',
      avgProcessingTime: 'متوسط وقت المعالجة',
      status: 'الحالة',
      pending: 'معلق',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      processing: 'قيد المعالجة',
      patientId: 'رقم المريض',
      providerId: 'رقم المقدم',
      amount: 'المبلغ',
      createdAt: 'تاريخ الإنشاء',
      agentName: 'اسم العميل',
      totalRequests: 'إجمالي الطلبات',
      avgResponseTime: 'متوسط وقت الاستجابة',
      successRate: 'معدل النجاح',
      active: 'نشط',
      inactive: 'غير نشط',
      maintenance: 'صيانة',
      hipaaCompliant: 'متوافق مع HIPAA',
      nphiesCompliant: 'متوافق مع نفيس',
      auditTrail: 'مسار المراجعة',
      encryptionStatus: 'حالة التشفير'
    },
    en: {
      title: 'NPHIES AI Dashboard',
      subtitle: 'BrainSAIT Healthcare',
      overview: 'Overview',
      claims: 'Claims',
      agents: 'AI Agents',
      compliance: 'Compliance',
      settings: 'Settings',
      totalClaims: 'Total Claims',
      activeSessions: 'Active Sessions',
      processedImages: 'Processed Images',
      complianceScore: 'Compliance Score',
      todayClaims: "Today's Claims",
      avgProcessingTime: 'Avg Processing Time',
      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      processing: 'Processing',
      patientId: 'Patient ID',
      providerId: 'Provider ID',
      amount: 'Amount',
      createdAt: 'Created At',
      agentName: 'Agent Name',
      totalRequests: 'Total Requests',
      avgResponseTime: 'Avg Response Time',
      successRate: 'Success Rate',
      active: 'Active',
      inactive: 'Inactive',
      maintenance: 'Maintenance',
      hipaaCompliant: 'HIPAA Compliant',
      nphiesCompliant: 'NPHIES Compliant',
      auditTrail: 'Audit Trail',
      encryptionStatus: 'Encryption Status'
    }
  };

  const t = texts[language];

  // BRAINSAIT: Load dashboard data
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // AGENT: Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setDashboardStats(stats);
      }

      // MEDICAL: Fetch recent claims
      const claimsResponse = await fetch('/api/dashboard/claims');
      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json();
        setClaims(claimsData);
      }

      // AGENT: Fetch agent metrics
      const agentsResponse = await fetch('/api/dashboard/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgentMetrics(agentsData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // BILINGUAL: Language toggle
  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    setIsRTL(newLanguage === 'ar');
  };

  // NEURAL: Navigation tabs
  const NavigationTabs: React.FC = () => {
    const tabs = [
      { id: 'overview', label: t.overview, icon: ChartBarIcon },
      { id: 'claims', label: t.claims, icon: DocumentTextIcon },
      { id: 'agents', label: t.agents, icon: UserGroupIcon },
      { id: 'compliance', label: t.compliance, icon: ShieldCheckIcon },
      { id: 'settings', label: t.settings, icon: CogIcon }
    ];

    return (
      <GlassCard className="mb-6">
        <nav className="flex space-x-4" dir={isRTL ? 'rtl' : 'ltr'}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500/30 text-white border border-blue-400/50'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95