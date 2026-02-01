'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewSourcePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const url = formData.get('url') as string
    const type = formData.get('type') as 'website' | 'rss'

    try {
      // TODO: Implement actual source creation
      console.log('Creating source:', { name, url, type })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to sources list
      router.push('/dashboard/sources')
    } catch (err) {
      setError('Failed to create source. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/sources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sources
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Add New Source
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Add a website or RSS feed to start scraping content
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-6">
            {/* Source Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Source Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., TechCrunch, Hacker News"
                required
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A friendly name to identify this source
              </p>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com or https://example.com/feed"
                required
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The website URL or RSS feed URL to scrape
              </p>
            </div>

            {/* Source Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Source Type</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:ring-offset-slate-950"
                required
              >
                <option value="website">Website</option>
                <option value="rss">RSS Feed</option>
              </select>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose "Website" for regular sites, "RSS Feed" for XML feeds
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Source'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/sources">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
