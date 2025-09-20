import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBarIcon, UserGroupIcon, DocumentTextIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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
  aiAnalysis: {
    confidence: number;
    recommendations: string[];
  };
}

interface AgentMetrics {
  agentName: string;
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  status: 'active' | 'inactive' | 'maintenance';
}

const API_URL = 'http://brainsait-nphies-alb-1821626782.us-east-1.elb.amazonaws.com';

const BrainSAITColors = {
  midnightBlue: '#1a365d',
  medicalBlue: '#2b6cb8',
  signalTeal: '#0ea5e9',
  professionalGray: '#64748b',
  glassMorphBg: 'rgba(255, 255, 255, 0.1)',
  glassMorphBorder: 'rgba(255, 255, 255, 0.2)'
};

const GlassCard = ({ children, className = '' }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const MeshGradientBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-600" />
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-cyan-400/20" />
  </div>
);

export default function NPHIESDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    activeSessions: 0,
    processedImages: 0,
    complianceScore: 0,
    todayClaims: 0,
    avgProcessingTime: 0
  });
  const [claims, setClaims] = useState<NPHIESClaim[]>([]);
  const [agents, setAgents] = useState<AgentMetrics[]>([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls with mock data
      setStats({
        totalClaims: 1247,
        activeSessions: 23,
        processedImages: 89,
        complianceScore: 98.5,
        todayClaims: 156,
        avgProcessingTime: 2.3
      });

      setClaims([
        {
          id: 'CLM-001',
          patientId: 'PAT-12345',
          providerId: 'PROV-001',
          status: 'approved',
          amount: 2500,
          createdAt: '2025-09-19T20:30:00Z',
          aiAnalysis: { confidence: 0.95, recommendations: ['Claim validated', 'No issues found'] }
        },
        {
          id: 'CLM-002',
          patientId: 'PAT-67890',
          providerId: 'PROV-002',
          status: 'processing',
          amount: 1800,
          createdAt: '2025-09-19T21:15:00Z',
          aiAnalysis: { confidence: 0.87, recommendations: ['Additional documentation needed'] }
        }
      ]);

      setAgents([
        { agentName: 'MASTERLINC', totalRequests: 1247, avgResponseTime: 1.2, successRate: 98.5, status: 'active' },
        { agentName: 'HEALTHCARELINC', totalRequests: 892, avgResponseTime: 2.1, successRate: 97.8, status: 'active' },
        { agentName: 'CLINICALLINC', totalRequests: 634, avgResponseTime: 1.8, successRate: 99.1, status: 'active' },
        { agentName: 'COMPLIANCELINC', totalRequests: 445, avgResponseTime: 0.9, successRate: 100, status: 'active' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    setIsRTL(prev => !prev);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'active': return 'text-green-400';
      case 'rejected': case 'inactive': return 'text-red-400';
      case 'processing': case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', label: { ar: 'نظرة عامة', en: 'Overview' }, icon: ChartBarIcon },
    { id: 'claims', label: { ar: 'المطالبات', en: 'Claims' }, icon: DocumentTextIcon },
    { id: 'agents', label: { ar: 'الوكلاء الذكيون', en: 'AI Agents' }, icon: UserGroupIcon },
    { id: 'compliance', label: { ar: 'الامتثال', en: 'Compliance' }, icon: ShieldCheckIcon }
  ];

  return (
    <div className={`min-h-screen text-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <MeshGradientBackground />
      
      {/* Header */}
      <GlassCard className="m-6 mb-4">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center`}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            {language === 'ar' ? 'لوحة تحكم برين سايت - نفيس' : 'BrainSAIT NPHIES Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {language.toUpperCase()}
            </button>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">
              {language === 'ar' ? 'متصل' : 'Connected'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Navigation */}
      <div className="mx-6 mb-6">
        <div className="flex gap-2 bg-white/5 p-2 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label[language]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <GlassCard>
                <div className="text-center">
                  <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <div className="text-2xl font-bold">{stats.totalClaims.toLocaleString()}</div>
                  <div className="text-sm text-white/70">
                    {language === 'ar' ? 'إجمالي المطالبات' : 'Total Claims'}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-center">
                  <UserGroupIcon className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold">{stats.activeSessions}</div>
                  <div className="text-sm text-white/70">
                    {language === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-center">
                  <ChartBarIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold">{stats.complianceScore}%</div>
                  <div className="text-sm text-white/70">
                    {language === 'ar' ? 'نقاط الامتثال' : 'Compliance Score'}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="text-center">
                  <CogIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold">{stats.avgProcessingTime}s</div>
                  <div className="text-sm text-white/70">
                    {language === 'ar' ? 'متوسط وقت المعالجة' : 'Avg Processing Time'}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'claims' && (
            <motion.div
              key="claims"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'المطالبات الحديثة' : 'Recent Claims'}
                </h2>
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div key={claim.id} className="bg-white/5 rounded-lg p-4">
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-start`}>
                        <div>
                          <div className="font-semibold">{claim.id}</div>
                          <div className="text-sm text-white/70">
                            {language === 'ar' ? 'المريض:' : 'Patient:'} {claim.patientId}
                          </div>
                          <div className="text-sm text-white/70">
                            {language === 'ar' ? 'المبلغ:' : 'Amount:'} {claim.amount.toLocaleString()} SAR
                          </div>
                        </div>
                        <div className={`text-right ${isRTL ? 'text-left' : 'text-right'}`}>
                          <div className={`font-semibold ${getStatusColor(claim.status)}`}>
                            {claim.status.toUpperCase()}
                          </div>
                          <div className="text-sm text-white/70">
                            {language === 'ar' ? 'الثقة:' : 'Confidence:'} {(claim.aiAnalysis.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {agents.map((agent) => (
                <GlassCard key={agent.agentName}>
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-start mb-4`}>
                    <h3 className="text-lg font-bold">{agent.agentName}</h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status).replace('text-', 'bg-')}`} />
                  </div>
                  <div className="space-y-2">
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
                      <span className="text-white/70">
                        {language === 'ar' ? 'إجمالي الطلبات:' : 'Total Requests:'}
                      </span>
                      <span>{agent.totalRequests.toLocaleString()}</span>
                    </div>
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
                      <span className="text-white/70">
                        {language === 'ar' ? 'متوسط الاستجابة:' : 'Avg Response:'}
                      </span>
                      <span>{agent.avgResponseTime}s</span>
                    </div>
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
                      <span className="text-white/70">
                        {language === 'ar' ? 'معدل النجاح:' : 'Success Rate:'}
                      </span>
                      <span className="text-green-400">{agent.successRate}%</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
            >
              <GlassCard>
                <h2 className="text-xl font-bold mb-4">
                  {language === 'ar' ? 'حالة الامتثال' : 'Compliance Status'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">98.5%</div>
                    <div className="text-sm text-white/70">
                      {language === 'ar' ? 'امتثال HIPAA' : 'HIPAA Compliance'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">100%</div>
                    <div className="text-sm text-white/70">
                      {language === 'ar' ? 'امتثال NPHIES' : 'NPHIES Compliance'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-white/70">
                      {language === 'ar' ? 'مراقبة الأمان' : 'Security Monitoring'}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
