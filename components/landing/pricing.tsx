import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Free',
    id: 'free',
    price: '$0',
    description: 'Perfect for trying out DataScrap',
    features: [
      'Up to 5 sources',
      '1 digest per week',
      'Email delivery',
      'Basic AI summaries',
      '30-day article archive',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '$12',
    period: '/month',
    description: 'For power users and content enthusiasts',
    features: [
      'Unlimited sources',
      'Daily or weekly digests',
      'Email + Notion delivery',
      'Advanced AI summaries',
      'Unlimited article archive',
      'Custom digest templates',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    price: 'Custom',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom integrations',
      'API access',
      'SLA guarantee',
      'Dedicated support',
      'Custom AI models',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 dark:bg-slate-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Choose the right plan for you
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Start free, upgrade when you need more. No credit card required.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col justify-between rounded-2xl border p-8',
                tier.highlighted
                  ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600 dark:border-primary-500 dark:bg-primary-950/30 dark:ring-primary-500'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-primary-600 px-4 py-1 text-sm font-semibold text-white dark:bg-primary-500">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold leading-8 text-slate-900 dark:text-slate-50">
                  {tier.name}
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400">
                      {tier.period}
                    </span>
                  )}
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={cn(
                          'h-5 w-5 flex-shrink-0',
                          tier.highlighted
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-slate-600 dark:text-slate-400'
                        )}
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                variant={tier.highlighted ? 'default' : 'outline'}
                className="mt-8 w-full"
              >
                <Link href={tier.id === 'enterprise' ? '/contact' : '/signup'}>
                  {tier.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
