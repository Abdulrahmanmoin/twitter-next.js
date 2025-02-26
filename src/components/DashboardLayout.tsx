import type React from "react"
import DesktopSidebar from "@/components/DesktopSidebar"
import MobileNavigation from "@/components/MobileNavigation"
import SearchAndTrends from "@/components/SearchAndTrends"

export function DashboardLayout({ children }: { children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen md:justify-between lg:justify-evenly xl:justify-between">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Main Content Desktop*/}
      <main className="flex-1 border-l border-r md:mr-28 lg:ml-16 xl:ml-52 border-gray-800 md:max-w-[600px] min-h-screen">{children}</main>

      {/* Right Sidebar - Hidden on mobile */}
      <div
       className={`hidden lg:block w-[350px] pl-8 pr-4`}>
        <SearchAndTrends />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  )
}