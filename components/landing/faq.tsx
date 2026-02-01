'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How does DataScrap scrape content?',
    answer:
      'DataScrap uses advanced web scraping technology to extract article content from your specified sources. We support both direct website scraping and RSS feeds. Our system respects robots.txt and rate limits to ensure ethical scraping practices.',
  },
  {
    question: 'What AI model do you use for summarization?',
    answer:
      'We use state-of-the-art large language models (LLMs) to generate intelligent summaries. The AI analyzes article content, extracts key points, and creates concise summaries while preserving the most important information and context.',
  },
  {
    question: 'Can I customize my digest format?',
    answer:
      'Yes! Pro users can customize digest templates, including the layout, summary length, number of articles, and specific topics to focus on. You can also choose between different delivery formats for email and Notion.',
  },
  {
    question: 'How does Notion integration work?',
    answer:
      'Connect your Notion workspace through our secure OAuth integration. DataScrap will create a database in your workspace and automatically populate it with digest entries. You can customize the database properties and views to match your workflow.',
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Absolutely. We take privacy seriously. All data is encrypted in transit and at rest. We never share your sources, articles, or digests with third parties. You can delete your data at any time, and it will be permanently removed from our systems.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your Pro subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you can always downgrade to the free plan.',
  },
  {
    question: 'What happens if a source stops working?',
    answer:
      'Our system monitors all sources for availability and content changes. If a source becomes unavailable or changes structure, we\'ll notify you and attempt to adapt our scraping strategy. You can also report issues directly from your dashboard.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee for Pro subscriptions. If you\'re not satisfied within the first month, contact our support team for a full refund. We also offer a free trial to test all features before committing.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-slate-50 py-24 dark:bg-slate-900/50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Have questions? We have answers. Can't find what you're looking for?{' '}
            <a href="/contact" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Contact us
            </a>
            .
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <dl className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <dt>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between px-6 py-4 text-left"
                    >
                      <span className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-50">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 text-slate-600 transition-transform dark:text-slate-400',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </span>
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="px-6 pb-4">
                      <p className="text-base leading-7 text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </dd>
                  )}
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
