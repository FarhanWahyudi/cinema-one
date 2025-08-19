"use client"

import PageTitle from '@/components/ui/page-title'
import { formatDate } from '@/helpers/date-time-formats'
import { IUserStore, useUsersStore } from '@/store/users-store'
import React from 'react'

export default function UserProfilePage() {
    const { user } = useUsersStore() as IUserStore
    if (!user) {
        return <h1>User not found</h1>
    }

    return (
        <div>
            <PageTitle title='User Profile' />
            <div className='border border-gray-500 p-10 rounded-xl mt-10 flex justify-center'>
                <div className='flex flex-col items-center w-max gap-10 '>
                    <img src="https://t3.ftcdn.net/jpg/08/05/28/22/360_F_805282248_LHUxw7t2pnQ7x8lFEsS2IZgK8IGFXePS.jpg" alt="user" className='w-36 h-36 rounded-full' />
                    <div className='flex gap-20'>
                        <div className='font-semibold flex flex-col gap-2'>
                            <span>User ID</span>
                            <span>Name</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Joined At</span>
                        </div>
                        <div className='text-gray-600 font-semibold flex flex-col gap-2'>
                            <span>{user.id}</span>
                            <span>{user.name}</span>
                            <span>{user.email}</span>
                            <span>{user.role}</span>
                            <span>{formatDate(user.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
