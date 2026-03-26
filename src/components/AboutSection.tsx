import Image from 'next/image'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative bg-forest/20 py-24 px-4 sm:px-8"
      aria-label="About Cabin Studio"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Studio photo */}
          <div className="relative aspect-[4/5] overflow-hidden border border-amber/20">
            <Image
              src="/images/studio-about.png"
              alt="Inside Cabin Studio — recording studio Chicago"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-black/40 via-transparent to-transparent" />
          </div>

          {/* Text */}
          <div>
            <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
              The Story
            </p>
            <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-8 leading-tight">
              Built for the music, not the machine
            </h2>
            <div className="space-y-5 font-cormorant text-lg text-cream/75 leading-relaxed">
              <p>
                Cabin Studio is a warm, intimate recording space in Chicago designed for solo artists,
                rappers, R&amp;B singers, and indie musicians who are serious about their craft.
              </p>
              <p>
                With warm wood textures, ambient lighting, and industry-standard equipment, it&apos;s
                an environment that disappears — so the only thing you&apos;re thinking about is the sound.
              </p>
              <p>
                Not a corporate facility. Not a revolving door. A place where you can take your time,
                feel comfortable, and make something real.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-cream/10">
              {[
                { value: '500+', label: 'Sessions' },
                { value: '100%', label: 'Satisfaction' },
                { value: '24/7', label: 'Availability' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel text-2xl text-amber font-semibold">{stat.value}</p>
                  <p className="font-cormorant text-sm text-cream/45 mt-1 italic">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
    </section>
  )
}
