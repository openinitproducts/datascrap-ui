import { Suspense } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Digest card component
function DigestCard({
  digest,
}: {
  digest: {
    id: string
    title: string
    createdAt: string
    articleCount: number
    status: 'sent' | 'pending' | 'draft'
    deliveryMethod: 'email' | 'notion'
  }
}) {
  const statusColors = {
    sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-700">
      <Link href={`/dashboard/digests/${digest.id}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {digest.title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {digest.createdAt}
                  </span>
                  <span>{digest.articleCount} articles</span>
                  <span className="flex items-center gap-1">
                    {digest.deliveryMethod === 'email' ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <ExternalLink className="h-3 w-3" />
                    )}
                    {digest.deliveryMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[digest.status]}`}
              >
                {digest.status.charAt(0).toUpperCase() + digest.status.slice(1)}
              </span>
            </div>
          </div>

          <Button size="sm" variant="ghost">
            View
          </Button>
        </div>
      </Link>
    </div>
  )
}

async function DigestsContent() {
  // Fetch actual digests from backend API
  try {
    const { digestsService } = await import('@/lib/api/services')
    const { digests, total } = await digestsService.list({
      page: 1,
      page_size: 50,
    })

    if (digests.length === 0) {
      return (
        <EmptyState
          icon={FileText}
          title="No digests yet"
          description="Your AI-generated content digests will appear here. Add some sources to get started."
        />
      )
    }

    return (
      <div className="space-y-4">
        {digests.map((digest) => (
          <DigestCard
            key={digest.id}
            digest={{
              id: digest.id,
              title: digest.title,
              createdAt: new Date(digest.created_at).toLocaleDateString(),
              articleCount: digest.article_count,
              status: digest.status as 'sent' | 'pending' | 'draft',
              deliveryMethod: digest.delivery_method === 'email' ? 'email' : 'notion',
            }}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error fetching digests:', error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-50">
          Error Loading Digests
        </h3>
        <p className="mt-2 text-red-700 dark:text-red-300">
          Failed to load your digests. Please try refreshing the page.
        </p>
      </div>
    )
  }
}

export default async function DigestsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Digests
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          View your AI-generated content digests
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="all">All Digests</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
        </select>

        <select className="flex h-10 w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950">
          <option value="all">All Delivery Methods</option>
          <option value="email">Email</option>
          <option value="notion">Notion</option>
        </select>
      </div>

      {/* Digests List */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading digests..." />}>
        <DigestsContent />
      </Suspense>
    </div>
  )
}
