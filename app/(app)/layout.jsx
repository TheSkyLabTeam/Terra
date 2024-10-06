import LocationLabel from '@/app/(app)/components/locationLabel'
import React from 'react'

const layout = ({
    children,
}) => {
  return (
    <div className='relative w-screen h-screen p-2 bg-woodsmoke-950'>
        <div className='absolute z-10'>
            <LocationLabel />
        </div>
        {children}
    </div>
  )
}

export default layout