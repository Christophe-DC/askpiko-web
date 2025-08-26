'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/hooks/useRequireAuth';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

function ProfileContent() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Password reset email sent!');
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
    }
  };

  return (
    <section className="container mx-auto py-12 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.startsWith('Error')
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300'
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-2xl border border-light-border dark:border-dark-border p-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-2xl font-bold">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.user_metadata?.full_name || 'User'}</h2>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">{user?.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-surface/50 dark:bg-dark-surface/50 text-light-textSecondary dark:text-dark-textSecondary cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-lg bg-light-surface/50 dark:bg-dark-surface/50 text-light-textSecondary dark:text-dark-textSecondary">
                  {user?.user_metadata?.full_name || 'Not set'}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {editing ? (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFullName(user?.user_metadata?.full_name || '');
                    }}
                    className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-surfaceSecondary dark:hover:bg-dark-surfaceSecondary transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>

          {/* Security Section */}
          <div className="border-t border-light-border dark:border-dark-border mt-8 pt-8">
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <button
              onClick={handleChangePassword}
              className="px-6 py-2 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-surfaceSecondary dark:hover:bg-dark-surfaceSecondary transition-colors"
            >
              Change Password
            </button>
            <p className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
              We&apos;ll send you a password reset email
            </p>
          </div>

          {/* Account Info */}
          <div className="border-t border-light-border dark:border-dark-border mt-8 pt-8">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-light-textSecondary dark:text-dark-textSecondary">Account created:</span>
                <span>{new Date(user?.created_at || '').toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-textSecondary dark:text-dark-textSecondary">Last sign in:</span>
                <span>{new Date(user?.last_sign_in_at || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
