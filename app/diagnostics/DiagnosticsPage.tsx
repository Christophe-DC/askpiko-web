'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Types for diagnostics
interface DeviceReport {
  id: number;
  created_at: string;
  device_name: string | null;
  manufacturer: string | null;
  model: string | null;
  system_name: string | null;
  os_version: string | null;
  total_memory: number | null;
  total_disk_capacity: number | null;
  touch_test: boolean | null;
  display_color_test: boolean | null;
  button_test: boolean | null;
  microphone_test: boolean | null;
  sensor_test: boolean | null;
  camera_test: boolean | null;
  camera_front_face_detected: boolean | null;
  camera_back_face_detected: boolean | null;
  unique_id?: string | null;
  // kept for quick stats / potential filters
  pdf_sent?: boolean | null;
  user_email?: string | null;
  battery_level?: number | null;
  is_battery_charging?: boolean | null;
  used_memory?: number | null;
  free_disk_storage?: number | null;
  is_tablet?: boolean | null;
  is_emulator?: boolean | null;
  brand?: string | null;
}

// Supabase configuration (replace with your actual values)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DeviceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DeviceReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const fetchDiagnostics = async () => {
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const userEmail = userData.user?.email;

      const { data, error } = await supabase
        .from('device_reports')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiagnostics(data || []);
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiagnostics = diagnostics.filter(
    diagnostic =>
      diagnostic.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnostic.unique_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTestStatus = (diagnostic: DeviceReport) => {
    const tests = [
      diagnostic.touch_test,
      diagnostic.display_color_test,
      diagnostic.button_test,
      diagnostic.microphone_test,
      diagnostic.sensor_test,
      diagnostic.camera_test,
      diagnostic.camera_front_face_detected,
      diagnostic.camera_back_face_detected,
    ];

    const passedTests = tests.filter(Boolean).length;
    const totalTests = tests.length;
    return { passed: passedTests, total: totalTests, percentage: (passedTests / totalTests) * 100 };
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <section className="container mx-auto py-12 px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 animated-gradient"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
        />
      </div>

      <section className="container mx-auto py-12 px-6">
        {/* Header */}
        <motion.div className="mb-8" initial={fadeUp.initial} animate={fadeUp.animate}>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            style={{
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              paddingBottom: '6px',
            }}
          >
            Device Diagnostics
          </h1>
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">
            View all diagnostic reports generated by the AskPiko application
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6 } }}
        >
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-textSecondary dark:text-dark-textSecondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by device, model, brand, email or unique ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-border dark:border-dark-border 
                       bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary
                       text-light-text dark:text-dark-text placeholder-light-textSecondary dark:placeholder-dark-textSecondary"
            />
          </div>
        </motion.div>

        {/* Quick statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }}
        >
          <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl p-4 border border-light-border dark:border-dark-border">
            <div className="text-2xl font-bold text-primary">{diagnostics.length}</div>
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Total diagnostics</div>
          </div>

          <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl p-4 border border-light-border dark:border-dark-border">
            <div className="text-2xl font-bold text-green-500">{diagnostics.filter(d => d.pdf_sent).length}</div>
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">PDFs sent</div>
          </div>

          <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl p-4 border border-light-border dark:border-dark-border">
            <div className="text-2xl font-bold text-blue-500">{new Set(diagnostics.map(d => d.user_email)).size}</div>
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Unique users</div>
          </div>

          <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl p-4 border border-light-border dark:border-dark-border">
            <div className="text-2xl font-bold text-purple-500">{new Set(diagnostics.map(d => d.brand)).size}</div>
            <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Different brands</div>
          </div>
        </motion.div>

        {/* Diagnostics list */}
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.6 } }}
        >
          {filteredDiagnostics.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-light-textSecondary dark:text-dark-textSecondary mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">No diagnostics found</p>
            </div>
          ) : (
            filteredDiagnostics.map((diagnostic, index) => {
              const testStatus = getTestStatus(diagnostic);

              return (
                <motion.div
                  key={diagnostic.id}
                  className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl border border-light-border dark:border-dark-border p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                  onClick={() => setSelectedDiagnostic(diagnostic)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, duration: 0.4 } }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Main information */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                            {diagnostic.device_name || 'Unknown Device'}
                          </h3>
                          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                            {diagnostic.brand} {diagnostic.model} • {diagnostic.user_email}
                          </p>
                          {diagnostic.unique_id && (
                            <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                              ID: {diagnostic.unique_id}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {diagnostic.pdf_sent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                              PDF sent
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {diagnostic.system_name} {diagnostic.os_version}
                          </span>
                        </div>
                      </div>

                      {/* Key metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Battery */}
                        {/* <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${
                              (diagnostic.battery_level ?? 0) > 80
                                ? 'text-green-500'
                                : (diagnostic.battery_level ?? 0) > 50
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          >
                            {diagnostic.battery_level?.toFixed(0) ?? 'N/A'}%
                          </div>
                          <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15.67 4H14V2c0-1.1-.9-2-2-2s-2 .9-2 2v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                            </svg>
                            Battery
                          </div>
                        </div>*/}

                        {/* Total Memory */}
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-500">
                            {formatBytes(diagnostic.total_memory || 0)}
                          </div>
                          <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">Total RAM</div>
                        </div>

                        {/* Total Storage */}
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-500">
                            {formatBytes(diagnostic.total_disk_capacity || 0)}
                          </div>
                          <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                            Total Storage
                          </div>
                        </div>

                        {/* Tests */}
                        <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${
                              testStatus.percentage > 80
                                ? 'text-green-500'
                                : testStatus.percentage > 60
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }`}
                          >
                            {testStatus.passed}/{testStatus.total}
                          </div>
                          <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                            Tests passed
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date and action */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        {formatDate(diagnostic.created_at)}
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:text-accent transition-colors">
                        View details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </section>

      {/* Details modal */}
      {selectedDiagnostic && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-light-surface dark:bg-dark-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {selectedDiagnostic.device_name}
                  </h2>
                  <p className="text-light-textSecondary dark:text-dark-textSecondary">
                    {selectedDiagnostic.brand} {selectedDiagnostic.model}
                  </p>
                  {selectedDiagnostic.unique_id && (
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                      Unique ID: {selectedDiagnostic.unique_id}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Lien vers la page du diagnostic */}
                  <Link
                    href={`/diagnostics/${selectedDiagnostic.id}`} // NEW
                    className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                 hover:bg-light-surfaceSecondary dark:hover:bg-dark-surfaceSecondary
                 text-sm"
                    onClick={() => setSelectedDiagnostic(null)} // ferme le modal quand on navigue
                  >
                    Open full report
                  </Link>

                  <button
                    onClick={() => setSelectedDiagnostic(null)}
                    className="p-2 hover:bg-light-surfaceSecondary dark:hover:bg-dark-surfaceSecondary rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Detailed content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-light-border dark:border-dark-border pb-2">
                    General Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Email:</span>
                      <span>{selectedDiagnostic.user_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Date:</span>
                      <span>{formatDate(selectedDiagnostic.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">System:</span>
                      <span>
                        {selectedDiagnostic.system_name} {selectedDiagnostic.os_version}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Tablet:</span>
                      <span>{selectedDiagnostic.is_tablet ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Emulator:</span>
                      <span>{selectedDiagnostic.is_emulator ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-light-border dark:border-dark-border pb-2">
                    Performance
                  </h3>
                  <div className="space-y-2 text-sm">
                    {/* <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Battery:</span>
                      <span>{selectedDiagnostic.battery_level?.toFixed(1)}%</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Charging:</span>
                      <span>{selectedDiagnostic.is_battery_charging ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Total memory:</span>
                      <span>{formatBytes(selectedDiagnostic.total_memory || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Used memory:</span>
                      <span>{formatBytes(selectedDiagnostic.used_memory || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Total storage:</span>
                      <span>{formatBytes(selectedDiagnostic.total_disk_capacity || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-textSecondary dark:text-dark-textSecondary">Free storage:</span>
                      <span>{formatBytes(selectedDiagnostic.free_disk_storage || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Functional tests */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold border-b border-light-border dark:border-dark-border pb-2">
                    Functional Tests
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Touch Screen', value: selectedDiagnostic.touch_test },
                      { name: 'Colors', value: selectedDiagnostic.display_color_test },
                      { name: 'Buttons', value: selectedDiagnostic.button_test },
                      { name: 'Microphone', value: selectedDiagnostic.microphone_test },
                      { name: 'Sensors', value: selectedDiagnostic.sensor_test },
                      { name: 'Camera', value: selectedDiagnostic.camera_test },
                      { name: 'Front Camera', value: selectedDiagnostic.camera_front_face_detected },
                      { name: 'Back Camera', value: selectedDiagnostic.camera_back_face_detected },
                    ].map((test, idx) => (
                      <div
                        key={idx}
                        className="text-center p-3 rounded-lg border border-light-border dark:border-dark-border"
                      >
                        <div className={`text-2xl mb-1 ${test.value ? 'text-green-500' : 'text-red-500'}`}>
                          {test.value ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary">{test.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
