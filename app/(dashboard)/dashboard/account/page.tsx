'use client'

import { useState } from 'react'
import { AlertCircle, Download, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement password change
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  async function handleExportData() {
    // TODO: Implement data export
    alert('Data export feature coming soon')
  }

  async function handleDeleteAccount() {
    // TODO: Implement account deletion
    alert('Account deletion feature coming soon')
    setShowDeleteConfirm(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Account
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your account security and data
        </p>
      </div>

      {/* Security Section */}
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Security
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Two-Factor Authentication
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Add an extra layer of security to your account
          </p>
          <Button variant="outline" className="mt-4">
            Enable 2FA
          </Button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Data Management
        </h2>

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Export Your Data
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Download a copy of all your data including sources, articles, and
            digests
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            Active Sessions
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your active sessions across devices
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Current Session
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Last active: Just now
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            Sign Out All Other Sessions
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">
              Danger Zone
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-400">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-red-300 bg-white p-4 dark:border-red-800 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Are you absolutely sure?
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    This will permanently delete your account and all associated
                    data. This action cannot be undone.
                  </p>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="confirmDelete">
                      Type{' '}
                      <span className="font-mono font-semibold">
                        DELETE
                      </span>{' '}
                      to confirm
                    </Label>
                    <Input
                      id="confirmDelete"
                      name="confirmDelete"
                      placeholder="DELETE"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
