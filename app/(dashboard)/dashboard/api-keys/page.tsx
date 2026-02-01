'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'

// API Key card component
function ApiKeyCard({
  apiKey,
  onDelete,
  onCopy,
}: {
  apiKey: {
    id: string
    name: string
    key: string
    createdAt: string
    lastUsed: string | null
    permissions: string[]
  }
  onDelete: () => void
  onCopy: () => void
}) {
  const [showKey, setShowKey] = useState(false)

  const maskedKey = apiKey.key.slice(0, 8) + '•••••••••••••••••' + apiKey.key.slice(-4)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              {apiKey.name}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span>Created {apiKey.createdAt}</span>
              {apiKey.lastUsed && <span>Last used {apiKey.lastUsed}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button size="icon" variant="ghost" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>

        {/* API Key */}
        <div className="rounded-lg bg-slate-100 p-3 font-mono text-sm dark:bg-slate-800">
          <code className="text-slate-900 dark:text-slate-50">
            {showKey ? apiKey.key : maskedKey}
          </code>
        </div>

        {/* Permissions */}
        <div className="flex flex-wrap gap-2">
          {apiKey.permissions.map((permission) => (
            <span
              key={permission}
              className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
            >
              {permission}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Create API key modal/form
function CreateApiKeyForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Implement API key creation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onClose()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Create New API Key
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Generate a new API key to access the DataScrap API
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="keyName">Key Name</Label>
          <Input
            id="keyName"
            name="keyName"
            placeholder="e.g., Production API Key"
            required
          />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A friendly name to identify this key
          </p>
        </div>

        <div className="space-y-2">
          <Label>Permissions</Label>
          <div className="space-y-2">
            {['Read Sources', 'Write Sources', 'Read Digests', 'Generate Digests'].map(
              (permission) => (
                <label
                  key={permission}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    {permission}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create API Key'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function ApiKeysPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [apiKeys, setApiKeys] = useState<any[]>([])

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    // TODO: Show toast notification
  }

  const handleDeleteKey = (id: string) => {
    // TODO: Show confirmation dialog and delete key
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            API Keys
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage API keys for programmatic access to DataScrap
          </p>
        </div>
        {!showCreateForm && apiKeys.length > 0 && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        )}
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-yellow-900 dark:text-yellow-300">
            Keep your API keys secure
          </p>
          <p className="mt-1 text-yellow-700 dark:text-yellow-400">
            Treat API keys like passwords. Never share them publicly or commit them
            to version control. If a key is compromised, delete it immediately.
          </p>
        </div>
      </div>

      {/* Create Form or API Keys List */}
      {showCreateForm ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <CreateApiKeyForm onClose={() => setShowCreateForm(false)} />
        </div>
      ) : apiKeys.length > 0 ? (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onDelete={() => handleDeleteKey(apiKey.id)}
              onCopy={() => handleCopyKey(apiKey.key)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No API keys yet"
          description="Create an API key to access DataScrap programmatically. Use API keys to integrate with your applications and workflows."
          action={{
            label: 'Create API Key',
            onClick: () => setShowCreateForm(true),
          }}
        />
      )}

      {/* API Documentation Link */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
          API Documentation
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Learn how to use the DataScrap API in your applications
        </p>
        <Button variant="outline" className="mt-4">
          View Documentation
        </Button>
      </div>
    </div>
  )
}
