"use client"

import { IUserStore, useUsersStore } from '@/store/users-store'
import React from 'react'
import ProfileLayout from '@/layout-provider/profile-layout'

export default function UserProfilePage() {
    const { user } = useUsersStore() as IUserStore

    return (
        <ProfileLayout>
            <div className='shadow border border-gray-100 bg-white rounded-xl p-5'>
                <h1 className='text-gray-600 font-bold text-2xl'>My Profile</h1>
                <hr className='border-gray-300 my-5' />
                <div className='flex gap-10'>
                    <img src="https://cinepolis.co.id/images/temp/pro_im.jpg" alt="user-avatar" className='rounded-lg' />
                    <div className='flex gap-20'>
                        <div className='flex flex-col gap-10 text-gray-500'>
                            <span>Name</span>
                            <span>Gender</span>
                            <span>City</span>
                            <span>Date of Birth</span>
                        </div>
                        <div className='flex flex-col gap-10 text-gray-500 capitalize'>
                            <span>{user?.name}</span>
                            <span>{user?.gender || '-'}</span>
                            <span>{user?.city || '-'}</span>
                            <span>{user?.date_of_birth || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='shadow border border-gray-100 bg-white rounded-xl p-5'>
                <h1 className='text-gray-600 font-bold text-2xl'>Account</h1>
                <hr className='border-gray-300 my-5' />
                <div className='flex items-center gap-8 py-5 px-32'>
                    <label className='text-gray-500 text-lg'>Email</label>
                    <input type='email' disabled className='w-full border border-gray-400 rounded-lg p-3 text-gray-700' defaultValue={user?.email}/>
                </div>
            </div>
        </ProfileLayout>
    )
}
