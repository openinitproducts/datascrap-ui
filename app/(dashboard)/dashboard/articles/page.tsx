import { Suspense } from 'react'
import { FileText, ExternalLink, Calendar, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Article list item component
function ArticleListItem({
  article,
}: {
  article: {
    id: string
    title: string
    url: string
    source: string
    excerpt: string
    summary: string
    scrapedAt: string
    readTime: number
  }
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {article.title}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {article.source}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {article.scrapedAt}
              </span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        {/* AI Summary */}
        {article.summary && (
          <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-950/30">
            <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
              AI Summary
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {article.summary}
            </p>
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  )
}

async function ArticlesContent() {
  // TODO: Fetch actual articles from Supabase
  const articles: any[] = []

  if (articles.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No articles yet"
        description="Articles scraped from your sources will appear here. Add sources to start collecting content."
      />
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </div>
  )
}

export default async function ArticlesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Articles
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Browse all articles scraped from your sources
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
            <option value="all">All Sources</option>
            <option value="source1">TechCrunch</option>
            <option value="source2">Hacker News</option>
          </select>

          <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
          </select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Articles
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This Week
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This Month
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            0
          </p>
        </div>
      </div>

      {/* Articles List */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading articles..." />}>
        <ArticlesContent />
      </Suspense>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing 0 of 0 articles
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
