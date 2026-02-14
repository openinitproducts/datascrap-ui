import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Rss, ExternalLink, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Source card component
function SourceCard({
  source,
}: {
  source: {
    id: string
    name: string
    url: string
    type: 'website' | 'rss'
    status: 'active' | 'inactive' | 'error'
    articlesCount: number
    lastScraped: string
  }
}) {
  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Rss className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                {source.name}
              </h3>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                {source.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[source.status]}`}
            >
              {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              {source.articlesCount} articles
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Last scraped: {source.lastScraped}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

async function SourcesContent() {
  // Fetch actual sources from backend API
  try {
    const { sourcesService } = await import('@/lib/api/services')
    const { sources, total } = await sourcesService.list({
      page: 1,
      page_size: 50,
    })

    if (sources.length === 0) {
      return (
        <EmptyState
          icon={Rss}
          title="No sources yet"
          description="Add your first source to start generating content digests. You can add websites, blogs, or RSS feeds."
          action={{
            label: 'Add Source',
            onClick: () => {
              // This will be handled by the Link component instead
            },
          }}
        />
      )
    }

    return (
      <div className="space-y-4">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            source={{
              id: source.id,
              name: source.name,
              url: source.url,
              type: source.type,
              status: source.status,
              articlesCount: source.articles_count,
              lastScraped: source.last_scraped_at
                ? new Date(source.last_scraped_at).toLocaleDateString()
                : 'Never',
            }}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error fetching sources:', error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-50">
          Error Loading Sources
        </h3>
        <p className="mt-2 text-red-700 dark:text-red-300">
          Failed to load your sources. Please try refreshing the page.
        </p>
      </div>
    )
  }
}

export default async function SourcesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Sources
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your content sources and RSS feeds
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sources/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Link>
        </Button>
      </div>

      {/* Sources List */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading sources..." />}>
        <SourcesContent />
      </Suspense>
    </div>
  )
}
