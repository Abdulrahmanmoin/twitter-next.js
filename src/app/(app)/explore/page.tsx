import DesktopSidebar from '@/components/DesktopSidebar'
import Explore from '@/components/Explore'
import MobileNavigation from '@/components/MobileNavigation'
import React from 'react'

export default function ExplorePage() {
    return (
        <div className='flex flex-col'>
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>
            <div className='lg:ml-10 mb-16 md:mb-0'>
                <Explore />
            </div>
            <div>
                <MobileNavigation />
            </div>
        </div>
    )
}
