import React from 'react'

export default function PageTitle({ title }: { title: string }) {
  return (
    <h1 className='text-3xl font-bold text-cyan-700'>
        {title}
    </h1>
  )
}
