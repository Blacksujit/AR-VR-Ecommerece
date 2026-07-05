import type { ReactNode } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
