import { Suspense } from 'react'
import { TrendingUp, FileText, Rss, Calendar, BarChart3, PieChart } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Stat card with trend
function StatCardWithTrend({
  icon: Icon,
  label,
  value,
  change,
  changeType,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
}) {
  const changeColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {value}
            </p>
            <span className={`text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chart placeholder component
function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

// Simple bar chart placeholder
function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
            <span className="font-medium text-slate-900 dark:text-slate-50">
              {item.value}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-primary-600 dark:bg-primary-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Top sources table
function TopSourcesTable({
  sources,
}: {
  sources: { name: string; articles: number; engagement: number }[]
}) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="pb-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
              Source
            </th>
            <th className="pb-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">
              Articles
            </th>
            <th className="pb-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">
              Engagement
            </th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source, index) => (
            <tr
              key={index}
              className="border-b border-slate-100 last:border-0 dark:border-slate-800"
            >
              <td className="py-3 text-sm text-slate-900 dark:text-slate-50">
                {source.name}
              </td>
              <td className="py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                {source.articles}
              </td>
              <td className="py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                {source.engagement}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function AnalyticsContent() {
  // TODO: Fetch actual analytics data from Supabase
  const stats = {
    totalArticles: 0,
    totalDigests: 0,
    activeSources: 0,
    avgReadTime: 0,
  }

  const articlesByWeek = [
    { label: 'Week 1', value: 12 },
    { label: 'Week 2', value: 18 },
    { label: 'Week 3', value: 24 },
    { label: 'Week 4', value: 30 },
  ]

  const topSources = [
    { name: 'TechCrunch', articles: 45, engagement: 87 },
    { name: 'Hacker News', articles: 38, engagement: 92 },
    { name: 'The Verge', articles: 32, engagement: 78 },
    { name: 'Ars Technica', articles: 28, engagement: 81 },
  ]

  const digestsByType = [
    { label: 'Email', value: 15 },
    { label: 'Notion', value: 8 },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCardWithTrend
          icon={FileText}
          label="Total Articles"
          value={stats.totalArticles}
          change="+12%"
          changeType="increase"
        />
        <StatCardWithTrend
          icon={Calendar}
          label="Digests Sent"
          value={stats.totalDigests}
          change="+8%"
          changeType="increase"
        />
        <StatCardWithTrend
          icon={Rss}
          label="Active Sources"
          value={stats.activeSources}
          change="+2"
          changeType="increase"
        />
        <StatCardWithTrend
          icon={TrendingUp}
          label="Avg Read Time"
          value={`${stats.avgReadTime}m`}
          change="-5%"
          changeType="decrease"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Articles Over Time" icon={BarChart3}>
          {stats.totalArticles === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No data available yet
            </div>
          ) : (
            <SimpleBarChart data={articlesByWeek} />
          )}
        </ChartCard>

        <ChartCard title="Digests by Delivery Method" icon={PieChart}>
          {stats.totalDigests === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No data available yet
            </div>
          ) : (
            <SimpleBarChart data={digestsByType} />
          )}
        </ChartCard>
      </div>

      {/* Top Sources */}
      <ChartCard title="Top Sources" icon={TrendingUp}>
        {stats.activeSources === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Add sources to see analytics
          </div>
        ) : (
          <TopSourcesTable sources={topSources} />
        )}
      </ChartCard>
    </div>
  )
}

export default async function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Analytics
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track your content consumption and digest performance
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-4">
        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Analytics Content */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading analytics..." />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
