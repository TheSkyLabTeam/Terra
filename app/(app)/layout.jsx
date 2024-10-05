import React from 'react'

const layout = ({
    children,
}) => {
  return (
    <div className='relative w-screen h-screen'>
        <div className='absolute'>
            
        </div>
        {children}
    </div>
  )
}

export default layout