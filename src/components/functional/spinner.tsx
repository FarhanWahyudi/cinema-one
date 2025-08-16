import React from 'react'

export default function Spinner() {
  return (
    <div className='mt-20 flex items-center justify-center'>
        <div className='h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin'>
        </div>
    </div>
  )
}
