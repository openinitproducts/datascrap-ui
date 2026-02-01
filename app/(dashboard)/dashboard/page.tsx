import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Rss, FileText, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Stats card component
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  trend?: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {value}
            </p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

// Recent activity component
function RecentActivity() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Recent Activity
      </h3>
      <div className="mt-4">
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="Your recent digests and source updates will appear here."
          className="py-8"
        />
      </div>
    </div>
  )
}

// Quick actions component
function QuickActions() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Quick Actions
      </h3>
      <div className="mt-4 space-y-3">
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/dashboard/sources/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Source
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/dashboard/digests">
            <FileText className="mr-2 h-4 w-4" />
            View All Digests
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/dashboard/settings">
            <Rss className="mr-2 h-4 w-4" />
            Configure Delivery
          </Link>
        </Button>
      </div>
    </div>
  )
}

async function DashboardContent() {
  // TODO: Fetch actual data from Supabase
  const stats = {
    sources: 0,
    digests: 0,
    articles: 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back! Here's an overview of your content digests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard icon={Rss} label="Active Sources" value={stats.sources} />
        <StatCard
          icon={FileText}
          label="Digests Generated"
          value={stats.digests}
        />
        <StatCard
          icon={FileText}
          label="Articles Processed"
          value={stats.articles}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Getting Started */}
      {stats.sources === 0 && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-6 dark:border-primary-900 dark:bg-primary-950/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Get Started with DataScrap
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Add your first source to start generating AI-powered content digests.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/sources/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Source
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading dashboard..." />}>
      <DashboardContent />
    </Suspense>
  )
}
