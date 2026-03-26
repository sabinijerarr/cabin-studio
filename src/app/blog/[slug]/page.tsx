import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts, getPostBySlug } from '@/content/posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const Content = post.content

  // Article schema for Google
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Cabin Studio' },
    publisher: {
      '@type': 'Organization',
      name: 'Cabin Studio',
      address: '345 N Loomis St Unit #501, Chicago IL 60607',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="min-h-screen bg-warm-black px-4 py-32 sm:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <Link
            href="/blog"
            className="font-jetbrains text-xs tracking-[0.35em] text-amber/50 hover:text-amber uppercase transition-colors duration-200 flex items-center gap-2 mb-12"
          >
            <span>←</span> All Posts
          </Link>

          {/* Post header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-jetbrains text-[10px] tracking-[0.3em] text-amber/60 uppercase">
                {formatDate(post.date)}
              </span>
              <span className="text-cream/20">·</span>
              <span className="font-jetbrains text-[10px] tracking-[0.2em] text-cream/35 uppercase">
                {post.readingTime}
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl text-cream font-semibold leading-tight mb-6">
              {post.title}
            </h1>
            <p className="font-cormorant text-xl text-cream/55 italic leading-relaxed">
              {post.description}
            </p>
            <div className="mt-8 h-px bg-gradient-to-r from-amber/30 via-amber/10 to-transparent" />
          </div>

          {/* Post body */}
          <div className="blog-content">
            <Content />
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 border border-amber/20 bg-amber/5 p-8 text-center">
            <p className="font-jetbrains text-[10px] tracking-[0.4em] text-amber/60 uppercase mb-3">
              Cabin Studio · Chicago
            </p>
            <p className="font-cinzel text-xl text-cream mb-2">Ready to record?</p>
            <p className="font-cormorant text-base text-cream/50 italic mb-6">
              Sessions from $120 · Engineer included · 345 N Loomis St
            </p>
            <Link
              href="/booking"
              className="inline-block px-8 py-3 font-cinzel text-sm tracking-[0.25em] uppercase text-warm-black bg-amber hover:bg-amber-light transition-colors duration-300"
            >
              Book a Session
            </Link>
          </div>

          {/* More posts */}
          <div className="mt-12">
            <p className="font-jetbrains text-[10px] tracking-[0.35em] text-cream/30 uppercase mb-6">
              More from the blog
            </p>
            <div className="space-y-4">
              {posts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 2)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group flex items-center justify-between py-4 border-b border-cream/8 hover:border-cream/20 transition-colors duration-200"
                  >
                    <span className="font-cormorant text-lg text-cream/60 group-hover:text-cream/90 transition-colors duration-200 leading-snug">
                      {p.title}
                    </span>
                    <span className="text-amber/40 group-hover:text-amber transition-colors duration-200 ml-4 flex-shrink-0">→</span>
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
