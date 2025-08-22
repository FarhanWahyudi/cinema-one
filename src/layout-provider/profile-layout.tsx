"use client"

import { IUserStore, useUsersStore } from '@/store/users-store'
import { CalendarCheck, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import Cookies from "js-cookie";
import toast from 'react-hot-toast'

export default function ProfileLayout({children}: { children: React.ReactNode }) {
    const { user } = useUsersStore() as IUserStore
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('user_role')
        toast.success('Logged out successfully')
        router.push('/?form=login')
    }

    return (
        <div className='grid grid-cols-6 items-start gap-10'>
            <div className='col-span-2 shadow border border-gray-100 bg-white rounded-xl p-5 space-y-10'>
                <Link href={'/user/profile'} className='rounded-lg shadow border border-gray-100 flex items-center gap-2 p-3'>
                    <div className="w-12 h-12 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center uppercase font-bold
                    ">{user?.name[0]}</div>
                    <h1 className="text-xl mb-1 text-gray-600 capitalize font-semibold">
                        {user?.name}
                    </h1>
                </Link>
                <div className='space-y-5 px-4 pb-5'>
                    <Link href={'/user/booking'} className='flex gap-5 items-center'>
                        <CalendarCheck className='w-7 h-7' strokeWidth={1}/>
                        <h2 className='text-lg font-semibold'>Pesanan Saya</h2>
                    </Link>
                    <button onClick={handleLogout} className='flex gap-5 items-center cursor-pointer'>
                        <LogOut className='w-7 h-7' strokeWidth={1}/>
                        <h2 className='text-lg font-semibold text-red-500'>Logout</h2>
                    </button>
                </div>
            </div>
            <div className='col-span-4 space-y-5'>
                {children}
            </div>
        </div>
    )
}
