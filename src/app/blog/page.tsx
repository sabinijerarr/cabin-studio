import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '@/content/posts'

export const metadata: Metadata = {
  title: 'Blog — Recording Tips & Chicago Music',
  description:
    'Studio tips, Chicago music scene insights, and honest advice for independent artists — from Cabin Studio Chicago.',
  openGraph: {
    title: 'Blog — Cabin Studio Chicago',
    description: 'Studio tips and music industry insights from Cabin Studio, Chicago.',
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="min-h-screen bg-warm-black px-4 py-32 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="font-jetbrains text-xs tracking-[0.35em] text-amber/50 hover:text-amber uppercase transition-colors duration-200 flex items-center gap-2 mb-10"
          >
            <span>←</span> Back to Studio
          </Link>
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            Cabin Studio · Chicago
          </p>
          <h1 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-4">
            The Blog
          </h1>
          <p className="font-cormorant text-xl text-cream/50 italic">
            Studio tips, artist advice, and Chicago music — written for independent artists.
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-amber/30 via-amber/10 to-transparent" />
        </div>

        {/* Post list */}
        <div className="space-y-0">
          {sorted.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group block py-8 ${i !== sorted.length - 1 ? 'border-b border-cream/8' : ''}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-jetbrains text-[10px] tracking-[0.3em] text-amber/50 uppercase">
                      {formatDate(post.date)}
                    </span>
                    <span className="font-jetbrains text-[10px] text-cream/25">·</span>
                    <span className="font-jetbrains text-[10px] tracking-[0.2em] text-cream/30 uppercase">
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl text-cream group-hover:text-amber transition-colors duration-200 leading-snug mb-3">
                    {post.title}
                  </h2>
                  <p className="font-cormorant text-lg text-cream/50 leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <span className="font-cinzel text-amber/40 group-hover:text-amber transition-colors duration-200 text-xl mt-1 flex-shrink-0">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-10 border-t border-cream/8 text-center">
          <p className="font-cormorant text-xl text-cream/50 italic mb-6">
            Ready to record? Sessions start at $120.
          </p>
          <Link
            href="/booking"
            className="inline-block px-10 py-4 font-cinzel text-sm tracking-[0.25em] uppercase text-warm-black bg-amber hover:bg-amber-light transition-colors duration-300"
          >
            Book a Session
          </Link>
        </div>
      </div>
    </main>
  )
}
