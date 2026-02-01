import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Article card component
function ArticleCard({
  article,
}: {
  article: {
    id: string
    title: string
    url: string
    excerpt: string
    summary: string
    source: string
  }
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {article.title}
          </h3>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Source: {article.source}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            AI Summary
          </h4>
          <p className="text-slate-700 dark:text-slate-300">{article.summary}</p>
        </div>

        {article.excerpt && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-50">
              Original Excerpt
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {article.excerpt}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

async function DigestContent({ id }: { id: string }) {
  // TODO: Fetch actual digest from Supabase
  // For now, returning mock data
  const digest = null

  if (!digest) {
    notFound()
  }

  return (
    <>
      {/* Digest Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {(digest as any).title}
            </h2>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {(digest as any).createdAt}
              </span>
              <span className="flex items-center gap-1">
                {(digest as any).deliveryMethod === 'email' ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {(digest as any).deliveryMethod}
              </span>
              <span>{(digest as any).articleCount} articles</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Resend</Button>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Articles in this digest
        </h3>
        {(digest as any).articles.map((article: any) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  )
}

export default async function DigestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/digests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Digests
        </Link>
      </Button>

      {/* Content */}
      <Suspense fallback={<LoadingSpinner size="lg" text="Loading digest..." />}>
        <DigestContent id={params.id} />
      </Suspense>
    </div>
  )
}
