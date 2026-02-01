import { Link2, Cpu, Send, Check } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Link2,
    title: 'Add Your Sources',
    description: 'Paste URLs of your favorite websites, blogs, or RSS feeds. Add as many as you want.',
    features: [
      'Support for any website or RSS feed',
      'Organize sources by topic or category',
      'Automatic duplicate detection',
    ],
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Processes Content',
    description: 'Our AI scrapes articles, extracts key information, and generates intelligent summaries.',
    features: [
      'Advanced natural language processing',
      'Context-aware summarization',
      'Automatic topic extraction',
    ],
  },
  {
    step: '03',
    icon: Send,
    title: 'Receive Your Digest',
    description: 'Get a beautifully formatted digest delivered to your email or Notion on your schedule.',
    features: [
      'Choose email or Notion delivery',
      'Customizable delivery schedule',
      'Clean, readable format',
    ],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24 dark:bg-slate-900/50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
            Simple Process
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            How DataScrap Works
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            From source to inbox in three simple steps. No configuration required.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1

              return (
                <div key={step.step} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute left-8 top-20 -bottom-16 w-0.5 bg-slate-200 dark:bg-slate-800 lg:left-12" />
                  )}

                  <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
                    {/* Icon & Step Number */}
                    <div className="flex items-start gap-4 lg:w-64 lg:flex-shrink-0">
                      <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-500 lg:h-24 lg:w-24">
                        <Icon className="h-8 w-8 text-white lg:h-12 lg:w-12" />
                        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-50 dark:text-slate-900">
                          {step.step}
                        </div>
                      </div>

                      <div className="lg:hidden">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="hidden text-2xl font-bold text-slate-900 dark:text-slate-50 lg:block">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 lg:mt-4">
                        {step.description}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {step.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
