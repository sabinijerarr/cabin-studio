'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/lib/supabase/types'

interface NavItem {
  label: string
  href: string
  roles: Role[]
}

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/portal',               roles: ['owner', 'employee', 'renter'] },
  { label: 'Schedule',     href: '/portal/schedule',      roles: ['owner', 'employee', 'renter'] },
  { label: 'Book Studio',  href: '/portal/book',          roles: ['renter'] },
  { label: 'My Hours',     href: '/portal/my-hours',      roles: ['renter'] },
  { label: 'Members',      href: '/portal/admin/renters', roles: ['owner'] },
  { label: 'Payments',     href: '/portal/admin/payments',roles: ['owner', 'employee'] },
]

interface Props {
  role: Role
  name: string | null
}

export default function PortalNav({ role, name }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  const items = NAV.filter(n => n.roles.includes(role))

  return (
    <aside className="w-56 shrink-0 bg-[#1E1A12] border-r border-[#3A3020] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#3A3020]">
        <a href="/" className="block">
          <p className="font-cinzel text-[#D4A853] text-sm tracking-[0.2em] font-semibold">CABIN STUDIO</p>
          <p className="font-cormorant text-[#C4B99A]/50 text-xs mt-0.5 italic">
            {role === 'owner' ? 'Owner Portal' : role === 'employee' ? 'Staff Portal' : 'Member Portal'}
          </p>
        </a>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(item => {
          const active = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href))
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 font-cinzel text-[11px] tracking-[0.15em] uppercase transition-colors ${
                active
                  ? 'bg-[#D4A853]/15 text-[#D4A853] border-l-2 border-[#D4A853]'
                  : 'text-[#C4B99A]/60 hover:text-[#C4B99A] hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-[#3A3020]">
        <p className="font-cormorant text-[#C4B99A]/60 text-sm truncate mb-2">{name ?? 'Member'}</p>
        <button
          onClick={handleSignOut}
          className="w-full text-left font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#C4B99A]/40 hover:text-[#C4B99A] transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
