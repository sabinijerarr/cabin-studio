import Image from 'next/image'

const gear = [
  {
    name: 'Neumann U87',
    role: 'Microphone',
    description: 'The industry standard for pristine vocal capture. Warm, detailed, and present on everything from whispers to full-power delivery.',
  },
  {
    name: 'Neve 1073',
    role: 'Preamp / EQ',
    description: 'Classic British warmth and character. The preamp chain that makes vocals cut through any mix without effort.',
  },
  {
    name: 'Universal Audio Apollo x4',
    role: 'Interface / DSP',
    description: 'Premium AD/DA conversion with real-time UAD processing. What you hear in the headphones is what you get in the mix.',
  },
  {
    name: 'Yamaha HS8 + Subwoofer',
    role: 'Studio Monitors',
    description: 'Accurate, honest reference monitors. If it sounds good here, it sounds good everywhere.',
  },
  {
    name: 'DAWs',
    role: 'Ableton · FL Studio · Pro Tools',
    description: 'Work in whichever environment fits your workflow. We run all three and can match whatever you\'re comfortable with.',
  },
]

export default function GearSection() {
  return (
    <section
      id="gear"
      className="relative bg-forest/20 py-24 px-4 sm:px-8"
      aria-label="Studio equipment"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Studio image */}
          <div className="relative aspect-square overflow-hidden border border-amber/20">
            <Image
              src="/images/studio-2.jpg"
              alt="Cabin Studio control room and gear"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-warm-black/30 to-transparent" />
          </div>

          {/* Gear list */}
          <div>
            <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
              The Setup
            </p>
            <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-10 leading-tight">
              Industry-Standard Gear
            </h2>

            <div className="space-y-7">
              {gear.map((item) => (
                <div key={item.name} className="border-l border-amber/25 pl-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="font-cinzel text-lg text-cream">{item.name}</h3>
                    <span className="font-jetbrains text-[9px] tracking-[0.3em] text-amber/60 uppercase">
                      {item.role}
                    </span>
                  </div>
                  <p className="font-cormorant text-base text-cream/55 leading-relaxed">
                    {item.description}
                  </p>
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
