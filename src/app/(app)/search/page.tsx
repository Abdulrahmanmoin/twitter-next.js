import DesktopSidebar from '@/components/DesktopSidebar'
import MobileNavigation from '@/components/MobileNavigation'
import Search from '@/components/Search'
import React from 'react'

export default function SearchPage() {
    return (
        <div className='flex flex-col'>
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>
            <div className='lg:ml-10 mb-16 md:mb-0'>
                <Search />
            </div>
            <div>
                <MobileNavigation />
            </div>
        </div>
    )
}
