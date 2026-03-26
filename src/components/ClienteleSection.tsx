import Image from 'next/image'

const artists = [
  {
    name: 'Adamn Killa',
    src: '/images/artist-adamn-killa.jpg',
    genre: 'Hip-Hop / Experimental',
  },
  {
    name: 'Yourstepdad',
    src: '/images/artist-yourstepdad.jpg',
    genre: 'Rap / Alternative',
  },
  {
    name: 'Khalil The Bible',
    src: '/images/artist-khalil.jpg',
    genre: 'R&B / Hip-Hop',
  },
]

export default function ClienteleSection() {
  return (
    <section
      id="artists"
      className="relative bg-forest/25 py-24 px-4 sm:px-8"
      aria-label="Featured artists"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            Who Records Here
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold">
            Featured Artists
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.name} className="group text-center">
              <div className="relative aspect-square overflow-hidden border border-amber/15 group-hover:border-amber/40 transition-colors duration-300 mb-4">
                <Image
                  src={artist.src}
                  alt={artist.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-black/70 via-transparent to-transparent" />
              </div>
              <h3 className="font-cinzel text-lg text-cream mb-1">{artist.name}</h3>
              <p className="font-cormorant text-sm text-amber/70 italic">{artist.genre}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
    </section>
  )
}
