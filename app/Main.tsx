import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Hero from '@/components/Hero'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <Hero />
      <div className="divide-y divide-stone-200 dark:divide-stone-700">
        <ul className="divide-y divide-stone-200 dark:divide-stone-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12 pr-3">
                <article>
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-stone-500 dark:text-stone-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`/blog/${slug}`} className="text-stone-900 dark:text-stone-100">
                          {title}
                        </Link>
                      </h2>
                      <h3 className="prose max-w-none text-stone-500 dark:text-stone-400">
                        {summary}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-base font-medium leading-6">
                      <div className="flex flex-wrap">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/blog/${slug}`}
                      className=" inline-block w-full text-right text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Read more: "${title}"`}
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-center text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
