import { Suspense } from 'react'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Rss,
  FileText,
  Mail,
  Settings,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Activity item component
function ActivityItem({
  activity,
}: {
  activity: {
    id: string
    type: 'success' | 'error' | 'info' | 'warning'
    category: 'source' | 'digest' | 'delivery' | 'system'
    title: string
    description: string
    timestamp: string
    read: boolean
  }
}) {
  const iconMap = {
    source: Rss,
    digest: FileText,
    delivery: Mail,
    system: Settings,
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-900',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-900',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-900',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900',
    },
  }

  const TypeIcon = typeConfig[activity.type].icon
  const CategoryIcon = iconMap[activity.category]
  const config = typeConfig[activity.type]

  return (
    <div
      className={`rounded-lg border ${config.borderColor} bg-white p-4 dark:bg-slate-900 ${
        !activity.read ? 'border-l-4' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
          <TypeIcon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {activity.title}
                </h3>
                <CategoryIcon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {activity.description}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                {activity.timestamp}
              </p>
            </div>
            {!activity.read && (
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary-600 dark:bg-primary-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

async function ActivityContent() {
  // TODO: Fetch actual activity from Supabase
  const activities: any[] = []

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No activity yet"
        description="Your recent activity and notifications will appear here. Add sources and generate digests to see updates."
      />
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

export default async function ActivityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Activity
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track notifications and recent activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark All Read</Button>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="all">All Activity</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>

        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="all">All Categories</option>
          <option value="source">Sources</option>
          <option value="digest">Digests</option>
          <option value="delivery">Delivery</option>
          <option value="system">System</option>
        </select>

        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="all">All Types</option>
          <option value="success">Success</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">Unread</p>
          <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-500">
            0
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">Today</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
      </div>

      {/* Activity List */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading activity..." />}>
        <ActivityContent />
      </Suspense>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing 0 of 0 items
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
