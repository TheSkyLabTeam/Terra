import LocationLabel from '@/app/(app)/components/locationLabel'
import React from 'react'

const layout = ({
    children,
}) => {
  return (
    <div className='relative w-screen h-screen bg-woodsmoke-950'>
        <div className='absolute z-10 p-2'>
            <LocationLabel />
        </div>
        {children}
    </div>
  )
}

export default layout