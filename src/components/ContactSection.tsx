const contactItems = [
  {
    label: 'Location',
    value: '345 N Loomis St, Unit #501',
    sub: 'Chicago, IL 60607',
    href: 'https://maps.google.com/?q=345+N+Loomis+St+Chicago+IL+60607',
  },
  {
    label: 'Email',
    value: 'sabinistudio@gmail.com',
    sub: 'Replies within 24 hours',
    href: 'mailto:sabinistudio@gmail.com',
  },
  {
    label: 'Instagram',
    value: '@sabinistudio',
    sub: 'Behind-the-scenes & session clips',
    href: 'https://instagram.com/sabinistudio',
  },
  {
    label: 'Hours',
    value: '24/7 Availability',
    sub: 'By appointment — book online to reserve',
    href: undefined,
  },
]

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-warm-black py-24 px-4 sm:px-8"
      aria-label="Contact Cabin Studio"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-jetbrains text-[11px] tracking-[0.4em] text-amber uppercase mb-4">
            Get in Touch
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl text-cream font-semibold mb-4">
            Contact
          </h2>
          <p className="font-cormorant text-xl text-cream/50 italic">
            Questions before booking? We&apos;re happy to talk through your project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-cream/10 mb-12">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="bg-warm-black p-8 hover:bg-warm-black-light transition-colors duration-300"
            >
              <p className="font-jetbrains text-[10px] tracking-[0.35em] text-amber uppercase mb-3">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-cormorant text-2xl text-cream hover:text-amber transition-colors duration-200 block mb-1"
                  {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-cormorant text-2xl text-cream mb-1">{item.value}</p>
              )}
              <p className="font-cormorant text-sm text-cream/35 italic">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Google Maps embed */}
        <div className="w-full h-56 border border-amber/15 overflow-hidden mb-12">
          <iframe
            title="Cabin Studio location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.9!2d-87.6566!3d41.8859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2cb08c8a02c9%3A0x1!2s345+N+Loomis+St%2C+Chicago%2C+IL+60607!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) saturate(0.5)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer bar */}
        <div className="pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="font-cinzel text-sm text-cream/40 tracking-widest">CABIN STUDIO</p>
          <p className="font-cormorant text-sm text-cream/25 italic">
            345 N Loomis St, Unit #501, Chicago, IL 60607 · All rights reserved {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  )
}
