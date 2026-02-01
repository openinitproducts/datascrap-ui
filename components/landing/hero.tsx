import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 dark:from-primary-950/20 dark:to-slate-950 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            AI-Powered Content Digests
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
            Drop your favorite websites.{' '}
            <span className="text-primary-600 dark:text-primary-400">
              Get AI-summarized newsletters.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Transform your daily content consumption into clean, concise digests.
            DataScrap automatically scrapes, summarizes, and delivers personalized newsletters
            to your inbox or Notion — weekly or daily.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#features">
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-primary-600 dark:border-slate-950"
                  />
                ))}
              </div>
              <span>Join 10,000+ users</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-16 sm:mt-24">
          <div className="relative rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 dark:bg-slate-50/5 dark:ring-slate-50/10 lg:rounded-2xl lg:p-4">
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              {/* Placeholder for dashboard screenshot */}
              <div className="flex h-full items-center justify-center text-slate-400">
                <span className="text-sm">Dashboard Preview Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
