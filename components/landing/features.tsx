import {
  Sparkles,
  Rss,
  Mail,
  FileText,
  Clock,
  Shield,
  Zap,
  Database
} from 'lucide-react'

const features = [
  {
    icon: Rss,
    title: 'Multi-Source Scraping',
    description: 'Add unlimited websites, blogs, and RSS feeds. We handle the scraping automatically.',
  },
  {
    icon: Sparkles,
    title: 'AI Summarization',
    description: 'Advanced AI models extract key insights and generate concise summaries from your sources.',
  },
  {
    icon: Mail,
    title: 'Email & Notion Delivery',
    description: 'Receive digests in your inbox or sync directly to Notion databases.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Choose daily or weekly delivery. Set your preferred time and day.',
  },
  {
    icon: FileText,
    title: 'Custom Digest Formats',
    description: 'Personalize your digest layout, length, and focus areas.',
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Articles are processed as they are published. Stay up to date instantly.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and never shared. Delete anytime.',
  },
  {
    icon: Database,
    title: 'Article Archive',
    description: 'Access your complete history of scraped articles and generated digests.',
  },
]

export function Features() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-slate-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Powerful features for content curation
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            DataScrap combines intelligent web scraping with AI-powered summarization
            to deliver personalized content digests tailored to your interests.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-16">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="relative">
                  <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-slate-900 dark:text-slate-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 dark:bg-primary-500">
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
