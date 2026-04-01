export default function MembershipSection() {
  return (
    <section id="membership" className="py-24 px-4 bg-[#1A1610]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-cinzel text-xs tracking-[0.4em] text-[#D4A853]/60 uppercase mb-3">Monthly Access</p>
          <h2 className="font-cinzel text-4xl md:text-5xl font-semibold text-cream tracking-wide mb-4">
            Studio Membership
          </h2>
          <p className="font-cormorant text-xl text-cream/60 italic max-w-xl mx-auto">
            Self-recording access for serious artists who need consistent studio time without booking session by session.
          </p>
        </div>

        {/* Main plan card */}
        <div className="relative border border-[#D4A853]/40 bg-[#2C2518] p-8 md:p-12 mb-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/60 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Left: price + details */}
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-cinzel text-5xl text-[#D4A853]">$500</span>
                <span className="font-cormorant text-cream/40 text-lg">/month</span>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  ['25 hours / month', '$20/hr effective rate'],
                  ['Self-recording only', 'No engineer included'],
                  ['Access hours', '12:00 AM – 12:00 PM'],
                  ['Overage', '$20/hr beyond 25 hours'],
                  ['Auto-billing', 'Monthly via Stripe'],
                ].map(([label, detail]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-4 h-px bg-[#D4A853]" />
                    <span className="font-cinzel text-[11px] tracking-[0.15em] text-cream uppercase">{label}</span>
                    <span className="font-cormorant text-cream/40 text-sm italic">{detail}</span>
                  </div>
                ))}
              </div>

              <a
                href="/apply"
                className="inline-block bg-[#D4A853] text-[#1A1610] font-cinzel text-sm tracking-[0.25em] uppercase px-10 py-4 hover:bg-[#E8C070] transition-all duration-300"
              >
                Apply for Membership
              </a>
            </div>

            {/* Right: requirements */}
            <div className="md:w-72 space-y-4">
              <p className="font-cinzel text-[10px] tracking-[0.3em] text-cream/40 uppercase mb-4">What's Required</p>

              {[
                {
                  step: '01',
                  title: 'Application',
                  desc: 'Fill out a short form with your info and how you plan to use the studio.',
                },
                {
                  step: '02',
                  title: 'Identity Verification',
                  desc: 'Submit a photo ID. We review all applicants personally.',
                },
                {
                  step: '03',
                  title: 'Rental Agreement',
                  desc: 'Sign the studio rental agreement outlining access rules and responsibilities.',
                },
                {
                  step: '04',
                  title: 'Security Deposit',
                  desc: 'A deposit (set per applicant) is held while you\'re a member, returned on cancellation.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <span className="font-jetbrains text-[10px] text-[#D4A853]/50 mt-0.5 shrink-0">{item.step}</span>
                  <div>
                    <p className="font-cinzel text-[11px] tracking-[0.1em] text-cream/80 uppercase mb-0.5">{item.title}</p>
                    <p className="font-cormorant text-cream/40 text-sm leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fine print */}
        <p className="font-cormorant text-center text-cream/30 text-sm italic">
          Already a member?{' '}
          <a href="/portal" className="text-[#D4A853]/60 hover:text-[#D4A853] underline">Sign in to your portal</a>
        </p>
      </div>
    </section>
  )
}
