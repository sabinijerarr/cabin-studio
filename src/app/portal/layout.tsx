import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalNav from '@/components/portal/PortalNav'
import type { Profile } from '@/lib/supabase/types'

export const metadata = { title: 'Portal | Cabin Studio' }

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile) redirect('/portal/login')

  return (
    <div className="flex min-h-screen bg-[#1A1610] font-cormorant">
      <PortalNav role={profile.role} name={profile.full_name} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
