'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const CAL_LINKS: Record<string, string> = {
  session_2hr: 'sabini-jr-xbptyp/2-hour-session',
  session_3hr: 'sabini-jr-xbptyp/3-hour-session',
  session_4hr: 'sabini-jr-xbptyp/4-hour-session',
}

const SESSIONS = [
  { value: 'session_2hr', label: '2 Hour Session', price: '$120', deposit: 60 },
  { value: 'session_3hr', label: '3 Hour Session', price: '$180', deposit: 90, popular: true },
  { value: 'session_4hr', label: '4 Hour Session', price: '$240', deposit: 120 },
]

const ADDITIONAL = [
  { label: 'Essential Mix & Master', price: '$89',  note: 'Streaming-ready, 2 revisions',  cal: 'sabini-jr-xbptyp/essential-mix' },
  { label: 'Premium Mix & Master',   price: '$149', note: 'Full stem mix, 2 revisions',    cal: 'sabini-jr-xbptyp/premium-mix' },
  { label: 'Custom Beat',            price: '$99',  note: 'Original production, stems incl', cal: 'sabini-jr-xbptyp/custom-beat' },
]

export default function BookingPage() {
  const [sessionType, setSessionType] = useState('session_3hr')
  const [addlOpen, setAddlOpen] = useState(false)
  const selected = SESSIONS.find((s) => s.value === sessionType)!

  useEffect(() => {
    if (window.location.search.includes('expand=addl')) {
      setAddlOpen(true)
      // Scroll down a bit so the expanded section is visible
      setTimeout(() => {
        document.getElementById('additional-services')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [])

  return (
    <>
      <Script
        id="cal-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["-",namespace,api])}else{p(cal,ar)}return}p(cal,ar)};})(window,"https://app.cal.com/embed/embed.js","init");
            Cal("init",{origin:"https://app.cal.com"});
            Cal("ui",{"styles":{"branding":{"brandColor":"#D4A853"}},"hideEventTypeDetails":false,"layout":"month_view"});
          `,
        }}
      />

      <main className="page-fade-in min-h-screen wood-bg flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,5,2,0.7)_100%)]" />

        <Link
          href="/"
          className="absolute top-6 left-6 font-jetbrains text-xs tracking-[0.35em] text-amber/50 hover:text-amber uppercase transition-colors duration-200 flex items-center gap-2"
        >
          <span>←</span> Back
        </Link>

        <div className="relative z-10 w-full max-w-xl">
          <NailCorners />

          <div className="wood-panel border-2 border-amber/15 shadow-[0_20px_80px_rgba(0,0,0,0.95),0_4px_12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(212,168,83,0.12),inset_0_-2px_0_rgba(0,0,0,0.6)] p-8 sm:p-12 relative">
            <div className="absolute left-0 right-0 top-[48%] h-px bg-black/40 shadow-[0_1px_0_rgba(255,255,255,0.03)]" />

            {/* Header */}
            <div className="text-center mb-10">
              <p className="font-jetbrains text-xs tracking-[0.5em] text-amber/60 uppercase mb-3">
                Cabin Studio · Chicago
              </p>
              <h1 className="font-cinzel text-3xl sm:text-4xl text-cream font-semibold leading-tight mb-2">
                Book Your Session
              </h1>
              <p className="font-cormorant text-lg text-cream/40 italic">
                345 N Loomis St, Unit #501
              </p>
              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-cream/10" />
                <span className="text-amber/30 text-sm">✦</span>
                <div className="flex-1 h-px bg-cream/10" />
              </div>
            </div>

            {/* Session hours — 3 cards */}
            <div className="mb-8">
              <p className="font-jetbrains text-xs tracking-[0.35em] text-amber/70 uppercase mb-4">
                Studio Session Hours
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SESSIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSessionType(s.value)}
                    className={`p-4 text-left border transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${
                      sessionType === s.value
                        ? 'border-amber/60 bg-black/30 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7),0_0_10px_rgba(212,168,83,0.1)]'
                        : 'border-black/40 bg-black/20 hover:border-amber/30'
                    }`}
                  >
                    {'popular' in s && s.popular && (
                      <p className="font-jetbrains text-[9px] tracking-[0.3em] text-amber uppercase mb-1">
                        Popular ★
                      </p>
                    )}
                    <p className="font-cormorant text-base text-cream/80 leading-tight">{s.label}</p>
                    <p className="font-cinzel text-xl text-amber mt-1">{s.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit summary */}
            <div className="border border-black/60 bg-black/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] px-5 py-4 flex items-center justify-between mb-6">
              <div>
                <p className="font-cormorant text-base text-cream/50 italic">{selected.label}</p>
                <p className="font-jetbrains text-xs tracking-widest text-cream/30 uppercase mt-0.5">
                  50% deposit today
                </p>
              </div>
              <p className="font-cinzel text-3xl text-amber">${selected.deposit}</p>
            </div>

            {/* Cal.com button */}
            <button
              data-cal-link={CAL_LINKS[sessionType]}
              data-cal-config='{"layout":"month_view"}'
              className="w-full py-4 font-cinzel text-base tracking-[0.3em] uppercase text-warm-black bg-amber hover:bg-amber-light transition-colors duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]"
            >
              Pick Date &amp; Time →
            </button>

            <p className="text-center font-cormorant text-sm text-cream/30 italic mt-4">
              Real-time availability · Deposit secured by Stripe · Instant confirmation
            </p>

            {/* Additional Services — collapsible */}
            <div id="additional-services" className="mt-8 border-t border-cream/10 pt-6">
              <button
                type="button"
                onClick={() => setAddlOpen((o) => !o)}
                className="w-full flex items-center justify-between group"
              >
                <span className="font-jetbrains text-xs tracking-[0.35em] text-amber/50 uppercase group-hover:text-amber/80 transition-colors duration-200">
                  Additional Services
                </span>
                <span className={`text-amber/40 group-hover:text-amber/70 transition-all duration-300 ${addlOpen ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </button>

              {addlOpen && (
                <div className="mt-4 space-y-2">
                  {ADDITIONAL.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between border border-black/40 bg-black/20 px-4 py-3 gap-4"
                    >
                      <div>
                        <p className="font-cormorant text-base text-cream/70">{s.label}</p>
                        <p className="font-jetbrains text-[10px] tracking-wide text-cream/30 mt-0.5">{s.note}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-cinzel text-lg text-amber">{s.price}</span>
                        <button
                          type="button"
                          data-cal-link={s.cal}
                          data-cal-config='{"layout":"month_view"}'
                          className="font-jetbrains text-[10px] tracking-[0.25em] uppercase border border-amber/40 hover:border-amber hover:bg-amber/10 text-amber px-3 py-1.5 transition-all duration-200"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function NailCorners() {
  const positions = [
    'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  ]
  return (
    <>
      {positions.map((pos) => (
        <div key={pos} className={`absolute ${pos} z-20`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5" fill="#2C1810" stroke="#D4A853" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="7" cy="7" r="2" fill="#D4A853" fillOpacity="0.4" />
          </svg>
        </div>
      ))}
    </>
  )
}
