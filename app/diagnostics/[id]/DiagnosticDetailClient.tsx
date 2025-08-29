'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_PDF_BASE = `${supabaseUrl}/storage/v1/object/public/reports`;

// --- Supabase (client-only, lazy init) ---
function getSupabaseBrowser() {
  const url = supabaseUrl;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// --- Types ---
type PowerState = {
  batteryLevel?: number;
  batteryState?: 'unknown' | 'unplugged' | 'charging' | 'full';
  lowPowerMode?: boolean;
  [k: string]: any;
};

interface BatteryInfo {
  health?: 'good' | 'overheat' | 'dead' | 'overvoltage' | 'unspecified' | 'cold' | 'unknown';
  capacityPercent?: number | null;
  status?: 'charging' | 'discharging' | 'not_charging' | 'full' | 'unknown';
  state?: 'unknown' | 'unplugged' | 'charging' | 'full';
  level?: number | null;
  lowPowerMode?: boolean;
  [k: string]: any;
}

interface DeviceReport {
  id: number;
  unique_id?: string | null;
  created_at: string;
  user_email?: string | null;
  device_name?: string | null;
  manufacturer?: string | null;
  brand?: string | null;
  model?: string | null;
  os_name?: string | null;
  os_version?: string | null;
  system_name?: string | null;
  api_level?: number | null;
  total_memory?: number | null;
  used_memory?: number | null;
  total_disk_capacity?: number | null;
  free_disk_storage?: number | null;
  battery_level?: number | null;
  is_battery_charging?: boolean | null;
  power_state?: PowerState | null;
  battery_info?: BatteryInfo | null;
  device_secure?: boolean | null;
  is_device_rooted?: boolean | null;
  has_gms?: boolean | null;
  has_hms?: boolean | null;
  oem_unlock_supported?: boolean | null;
  oem_unlock_allowed?: boolean | null;
  bootloader_locked?: boolean | null;
  verified_boot_state?: 'green' | 'yellow' | 'orange' | 'red' | string | null;
  nfc_available?: boolean | null;
  telephony_available?: boolean | null;
  camera_present?: boolean | null;
  touch_test?: boolean | null;
  display_color_test?: boolean | null;
  button_test?: boolean | null;
  microphone_test?: boolean | null;
  sensor_test?: boolean | null;
  camera_test?: boolean | null;
  camera_front_face_detected?: boolean | null;
  camera_back_face_detected?: boolean | null;
  pdf_sent?: boolean | null;
  battery_temperature_c?: number | null;
  battery_voltage_mv?: number | null;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DiagnosticDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [report, setReport] = useState<DeviceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError('Configuration system unavailable. Please try again later.');
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const slug = id;
        const maybeNumeric = Number.isFinite(Number(slug)) && String(Number(slug)) === slug;
        let query = supabase.from('device_reports').select('*').eq('id', id);
        // query = maybeNumeric ? query.eq('id', Number(slug)) : query.eq('unique_id', slug);

        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) {
          setNotFound(true);
          setReport(null);
        } else {
          console.log(data[0]);
          setReport(data[0] as DeviceReport);
        }
      } catch (e: any) {
        setError(e?.message || 'Unable to load device report. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // --- Helper functions ---
  const formatBytes = (bytes?: number | null) => {
    if (bytes == null) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(k)), sizes.length - 1);
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const calculatePercentage = (used?: number | null, total?: number | null) => {
    if (!used || !total || total <= 0) return null;
    return Math.round((used / total) * 100);
  };

  const formatDateTime = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '—';

  // Calculate overall device health score
  const deviceHealthScore = useMemo(() => {
    if (!report) return 0;

    let score = 0;
    let maxScore = 0;

    // Battery health (25%)
    const batteryPercent =
      report.battery_info?.capacityPercent ??
      (report.battery_level != null ? Math.round((report.battery_level || 0) * 100) : null);

    if (batteryPercent !== null) {
      maxScore += 25;
      if (batteryPercent >= 80) score += 25;
      else if (batteryPercent >= 60) score += 18;
      else if (batteryPercent >= 40) score += 12;
      else score += 5;
    }

    // Security (30%)
    maxScore += 30;
    if (report.bootloader_locked) score += 10;
    if (!report.is_device_rooted) score += 10;
    if (report.device_secure) score += 5;
    if (report.verified_boot_state === 'green') score += 5;

    // Functionality tests (25%)
    const tests = [
      report.touch_test,
      report.display_color_test,
      report.button_test,
      report.microphone_test,
      report.sensor_test,
      report.camera_test,
      report.camera_front_face_detected,
      report.camera_back_face_detected,
    ];
    const passedTests = tests.filter(Boolean).length;
    maxScore += 25;
    score += Math.round((passedTests / tests.length) * 25);

    // Storage health (20%)
    if (report.total_disk_capacity && report.free_disk_storage) {
      const usedPercentage =
        ((report.total_disk_capacity - report.free_disk_storage) / report.total_disk_capacity) * 100;
      maxScore += 20;
      if (usedPercentage < 70) score += 20;
      else if (usedPercentage < 85) score += 15;
      else if (usedPercentage < 95) score += 10;
      else score += 5;
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }, [report]);

  const tests = useMemo(() => {
    if (!report) return { passed: 0, total: 0, percentage: 0 };
    const testResults = [
      report.touch_test,
      report.display_color_test,
      report.button_test,
      report.microphone_test,
      report.sensor_test,
      report.camera_test,
      report.camera_front_face_detected,
      report.camera_back_face_detected,
    ];
    const total = testResults.length;
    const passed = testResults.filter(Boolean).length;
    return { passed, total, percentage: Math.round((passed / total) * 100) };
  }, [report]);

  const batteryPercent =
    report?.battery_info?.capacityPercent ??
    (report?.battery_level != null ? Math.round((report.battery_level || 0) * 100) : null);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log('Copy failed');
    }
  };

  const pdfUrl = report?.id ? `${PUBLIC_PDF_BASE}/report-${report.id}.pdf` : undefined;

  // Get health status color and text
  const getHealthStatus = (score: number) => {
    if (score >= 85)
      return {
        text: 'Excellent',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      };
    if (score >= 70)
      return { text: 'Good', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
    if (score >= 50)
      return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { text: 'Poor', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
  };

  const healthStatus = getHealthStatus(deviceHealthScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div initial={fadeInUp.initial} animate={fadeInUp.animate} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    Device Trust Certificate
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">Professional device assessment report</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copied ? 'Copied!' : 'Share'}
              </button>

              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-48"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-32"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800 p-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Error Loading Report</h3>
                <p className="text-slate-600 dark:text-slate-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Not Found State */}
        {notFound && !loading && (
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Report Not Found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              No device report found for ID:{' '}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-sm">{id}</code>
            </p>
          </motion.div>
        )}

        {/* Main Report Content */}
        {!loading && !error && report && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
            {/* Hero Section with Certificate Badge */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 lg:p-12 relative overflow-hidden">
                {/* Certification Badge */}
                {/* <div className="absolute -top-4 -right-4 rotate-12 opacity-90">
                  <Image
                    src="/askpiko_verified.png"
                    alt="Piko Certified"
                    width={120}
                    height={120}
                    className="drop-shadow-lg"
                  />
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Report #{report.unique_id || report.id}
                        </span>
                        <span>{formatDateTime(report.created_at)}</span>
                      </div>

                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                        {report.device_name ||
                          `${report.manufacturer ?? ''} ${report.model ?? ''}`.trim() ||
                          'Unknown Device'}
                      </h2>

                      <div className="text-lg text-slate-600 dark:text-slate-400">
                        {[report.manufacturer, report.model].filter(Boolean).join(' ') || '—'}
                        {` • `}
                        {`${report.system_name ?? ''} ${report.os_version ?? ''}`.trim() || 'OS —'}
                        {report.api_level ? ` (API ${report.api_level})` : ''}
                      </div>
                    </div>

                    {/* Health Score Circle */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${deviceHealthScore * 2.51} 251`}
                            className={healthStatus.color}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">{deviceHealthScore}</span>
                        </div>
                      </div>
                      <div>
                        <div className={`text-2xl font-semibold ${healthStatus.color}`}>{healthStatus.text}</div>
                        <div className="text-slate-600 dark:text-slate-400">Overall Health Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      title="Battery Health"
                      value={batteryPercent !== null ? `${batteryPercent}%` : '—'}
                      subtitle={report.is_battery_charging ? 'Charging' : 'Not charging'}
                      icon="🔋"
                    />
                    <StatCard
                      title="Functional Tests"
                      value={`${tests.passed}/${tests.total}`}
                      subtitle={`${tests.percentage}% passed`}
                      icon="✓"
                    />
                    <StatCard
                      title="Storage"
                      value={formatBytes(report.total_disk_capacity)}
                      subtitle={formatBytes(report.free_disk_storage) + ' free'}
                      icon="💾"
                    />
                    <StatCard
                      title="Memory"
                      value={formatBytes(report.total_memory)}
                      subtitle={
                        report.used_memory && report.total_memory
                          ? `${calculatePercentage(report.used_memory, report.total_memory)}% used`
                          : undefined
                      }
                      icon="⚡"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detailed Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Security & Trust */}
              <motion.div variants={fadeInUp}>
                <SectionCard title="Security & Trust" icon="🛡️" className="h-full">
                  <SecurityGrid report={report} />
                </SectionCard>
              </motion.div>

              {/* Functional Tests */}
              <motion.div variants={fadeInUp}>
                <SectionCard title="Functional Tests" icon="🧪" className="h-full">
                  <TestsGrid report={report} />
                </SectionCard>
              </motion.div>

              {/* Battery & Power */}
              <motion.div variants={fadeInUp}>
                <SectionCard title="Battery & Power" icon="⚡" className="h-full">
                  <BatteryDetails report={report} />
                </SectionCard>
              </motion.div>

              {/* Hardware & Features */}
              <motion.div variants={fadeInUp}>
                <SectionCard title="Hardware & Features" icon="🔧" className="lg:col-span-2 h-full">
                  <HardwareDetails report={report} />
                </SectionCard>
              </motion.div>

              {/* Device Information */}
              <motion.div variants={fadeInUp}>
                <SectionCard title="Device Information" icon="📱" className="h-full">
                  <DeviceInfo report={report} />
                </SectionCard>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Enhanced UI Components ---

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
  className = '',
}: React.PropsWithChildren<{
  title: string;
  icon?: string;
  className?: string;
}>) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SecurityGrid({ report }: { report: DeviceReport }) {
  const securityItems = [
    {
      label: 'Screen Lock',
      value: report.device_secure,
      icon: '🔒',
    },
    {
      label: 'Root/Jailbreak',
      value: !report.is_device_rooted,
      icon: '🚫',
    },
    {
      label: 'Bootloader',
      value: report.bootloader_locked,
      icon: '🔐',
    },
    {
      label: 'Verified Boot',
      value: report.verified_boot_state === 'green',
      icon: '✅',
      detail: report.verified_boot_state || '—',
    },
  ];

  return (
    <div className="space-y-3">
      {securityItems.map((item, index) => (
        <SecurityItem key={index} {...item} />
      ))}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">OEM Unlock</span>
          <div className="text-right">
            <div
              className={`font-medium ${
                report.oem_unlock_allowed
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {report.oem_unlock_allowed ? 'Allowed' : 'Restricted'}
            </div>
            <div className="text-xs text-slate-500">{report.oem_unlock_supported ? 'Supported' : 'Not supported'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityItem({
  label,
  value,
  icon,
  detail,
}: {
  label: string;
  value?: boolean | null;
  icon: string;
  detail?: string;
}) {
  const getStatusColor = (val?: boolean | null) => {
    if (val === null || val === undefined) return 'text-slate-400';
    return val ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getStatusText = (val?: boolean | null) => {
    if (val === null || val === undefined) return 'Unknown';
    return val ? 'Secure' : 'At Risk';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-slate-900 dark:text-white">{label}</span>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold ${getStatusColor(value)}`}>{detail || getStatusText(value)}</div>
      </div>
    </div>
  );
}

function TestsGrid({ report }: { report: DeviceReport }) {
  const tests = [
    { label: 'Touchscreen', result: report.touch_test, icon: '👆' },
    { label: 'Display Colors', result: report.display_color_test, icon: '🎨' },
    { label: 'Physical Buttons', result: report.button_test, icon: '🔘' },
    { label: 'Microphone', result: report.microphone_test, icon: '🎤' },
    { label: 'Sensors', result: report.sensor_test, icon: '📐' },
    { label: 'Camera Core', result: report.camera_test, icon: '📷' },
    { label: 'Front Camera', result: report.camera_front_face_detected, icon: '🤳' },
    { label: 'Rear Camera', result: report.camera_back_face_detected, icon: '📸' },
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {tests.map((test, index) => (
        <TestItem key={index} {...test} />
      ))}
    </div>
  );
}

function TestItem({ label, result, icon }: { label: string; result?: boolean | null; icon: string }) {
  const getResultColor = (res?: boolean | null) => {
    if (res === null || res === undefined) return 'text-slate-400 bg-slate-100 dark:bg-slate-600';
    return res
      ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
      : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
  };

  const getResultIcon = (res?: boolean | null) => {
    if (res === null || res === undefined) return '❓';
    return res ? '✅' : '❌';
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${getResultColor(result)} border-current/20`}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg">{getResultIcon(result)}</span>
    </div>
  );
}

function BatteryDetails({ report }: { report: DeviceReport }) {
  const batteryPercent =
    report.battery_info?.capacityPercent ??
    (report.battery_level != null ? Math.round((report.battery_level || 0) * 100) : null);

  const batteryHealth = report.battery_info?.health;

  const getBatteryHealthColor = (health?: string) => {
    if (!health || health === 'unknown') return 'text-slate-500';
    if (health === 'good') return 'text-green-600 dark:text-green-400';
    if (health === 'cold') return 'text-blue-600 dark:text-blue-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatTemperature = (temp?: number | null) => {
    if (temp === null || temp === undefined) return '—';
    return `${temp}°C`;
  };

  const formatVoltage = (voltage?: number | null) => {
    if (voltage === null || voltage === undefined) return '—';
    return `${(voltage / 1000).toFixed(2)}V`;
  };

  return (
    <div className="space-y-4">
      {/* Battery Level Circle */}
      {batteryPercent !== null && (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-200 dark:text-slate-600"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${batteryPercent * 2.2} 220`}
                className={
                  batteryPercent >= 80 ? 'text-green-500' : batteryPercent >= 60 ? 'text-yellow-500' : 'text-red-500'
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{batteryPercent}%</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{batteryPercent}% Capacity</div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${getBatteryHealthColor(batteryHealth)}`}>
                {batteryHealth ? batteryHealth.charAt(0).toUpperCase() + batteryHealth.slice(1) : 'Unknown'}
              </span>
              {report.is_battery_charging && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                  ⚡ Charging
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Battery Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-600 dark:text-slate-400">Temperature</div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {formatTemperature(report.battery_temperature_c)}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-600 dark:text-slate-400">Voltage</div>
          <div className="font-semibold text-slate-900 dark:text-white">{formatVoltage(report.battery_voltage_mv)}</div>
        </div>
      </div>

      {/* Additional Battery Info */}
      {report.power_state?.lowPowerMode !== undefined && (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <span className="text-sm text-slate-600 dark:text-slate-400">Low Power Mode</span>
          <span
            className={`text-sm font-medium ${
              report.power_state.lowPowerMode
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {report.power_state.lowPowerMode ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      )}
    </div>
  );
}

function HardwareDetails({ report }: { report: DeviceReport }) {
  const formatBytes = (bytes?: number | null) => {
    if (bytes == null) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(k)), sizes.length - 1);
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const calculatePercentage = (used?: number | null, total?: number | null) => {
    if (!used || !total || total <= 0) return null;
    return Math.round((used / total) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Storage */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">💾 Storage</h4>
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-700/50 py-3 px-1 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Total Capacity</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {formatBytes(report.total_disk_capacity)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600 dark:text-slate-400">Available</span>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                {formatBytes(report.free_disk_storage)}
              </span>
            </div>
            {report.total_disk_capacity && report.free_disk_storage && (
              <div className="mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((report.total_disk_capacity - report.free_disk_storage) / report.total_disk_capacity) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {Math.round(
                    ((report.total_disk_capacity - report.free_disk_storage) / report.total_disk_capacity) * 100
                  )}
                  % used
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memory */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">⚡ RAM</h4>
        <div className="bg-slate-50 dark:bg-slate-700/50 py-3 px-1  rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Total
              <br /> RAM
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {formatBytes(report.total_memory)}
            </span>
          </div>
          {report.used_memory && report.total_memory && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Used</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {formatBytes(report.used_memory)}
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculatePercentage(report.used_memory, report.total_memory)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {calculatePercentage(report.used_memory, report.total_memory)}% used
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="md:col-span-2">
        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          🔧 Hardware Features
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FeatureItem icon="📷" label="Camera" available={report.camera_present} />
          <FeatureItem icon="📞" label="Telephony" available={report.telephony_available} />
          <FeatureItem icon="📡" label="NFC" available={report.nfc_available} />
          <FeatureItem icon="🎮" label="Google Services" available={report.has_gms} />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, label, available }: { icon: string; label: string; available?: boolean | null }) {
  const getStatusColor = () => {
    if (available === null || available === undefined) return 'border-slate-300 dark:border-slate-600 text-slate-500';
    return available
      ? 'border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
      : 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${getStatusColor()}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium text-center">{label}</span>
      <span className="text-xs">{available === null || available === undefined ? '—' : available ? '✓' : '✗'}</span>
    </div>
  );
}

function DeviceInfo({ report }: { report: DeviceReport }) {
  const formatDateTime = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '—';

  const deviceInfo = [
    { label: 'Device Name', value: report.device_name },
    { label: 'Manufacturer', value: report.manufacturer },
    { label: 'Model', value: report.model },
    { label: 'Brand', value: report.brand },
    { label: 'OS', value: `${report.system_name ?? ''} ${report.os_version ?? ''}`.trim() },
    { label: 'API Level', value: report.api_level },
    { label: 'Unique ID', value: report.unique_id, mono: true },
    { label: 'Report Date', value: formatDateTime(report.created_at) },
  ];

  return (
    <div className="space-y-3">
      {deviceInfo.map((info, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
        >
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{info.label}</span>
          <span className={`text-sm text-slate-900 dark:text-white text-right ${info.mono ? 'font-mono text-xs' : ''}`}>
            {info.value || '—'}
          </span>
        </div>
      ))}
    </div>
  );
}
