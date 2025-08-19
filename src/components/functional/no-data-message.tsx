import { CircleX } from 'lucide-react'
import React from 'react'

export default function NoDataMessage() {
  return (
    <div className='flex flex-col items-center mt-40'>
        <CircleX size={60}/>
        <h1 className='text-2xl mt-2 font-bold'>Tidak ada data</h1>
    </div>
  )
}
