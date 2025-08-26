import { Clapperboard } from 'lucide-react'
import React from 'react'

interface DashboardCardProps {
    title: string
    value: number
    description: string
    isCurrency?: boolean
}

export default function DashboardCard({ title, value, description, isCurrency }: DashboardCardProps) {
    return (
        <div className='bg-white p-5 flex flex-col gap-5 rounded-xl border shadow-lg shadow-gray-200'>
            <h1 className='font-semibold capitalize text-gray-500'>{title}</h1>
            <div className='flex flex-col gap-2'>
                <h1 className='text-3xl font-bold text-gray-700'>
                    {isCurrency && 'Rp '}
                    {value}
                    {isCurrency && '.000'}
                </h1>
                <p className='text-xs text-gray-500'>{description}</p>
            </div>
        </div>
    )
}
