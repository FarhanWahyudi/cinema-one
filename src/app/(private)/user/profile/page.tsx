"use client"

import { IUserStore, useUsersStore } from '@/store/users-store'
import React, { useState } from 'react'
import ProfileLayout from '@/layout-provider/profile-layout'
import ProfileForm from './_components/profile-form'
import { ArrowLeft, SquarePen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/helpers/date-time-formats'

export default function UserProfilePage() {
    const { user, setUser } = useUsersStore() as IUserStore
    const [openEdit, setOpenEdit] = useState(false)

    return (
        <ProfileLayout>
            <div className='shadow border border-gray-100 bg-white rounded-xl p-5'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-gray-600 font-bold text-2xl'>My Profile</h1>
                    <span onClick={() => setOpenEdit(!openEdit)} className='cursor-pointer'>
                        {openEdit && <span className='flex items-center gap-1'>
                            <ArrowLeft size={19}/>
                            <h2 className='font-semibold'>Back</h2>
                            </span>}
                        {!openEdit && <SquarePen />}
                    </span>
                </div>
                <hr className='border-gray-300 my-5' />
                <div className='flex gap-10'>
                    {openEdit && (
                        <>
                            <img src="https://cinepolis.co.id/images/temp/pro_im.jpg" alt="user-avatar" className='rounded-lg' />
                            <div className='flex gap-20 w-full'>
                                <div className='flex flex-col gap-10 text-gray-500'>
                                    <span className='whitespace-nowrap'>Name*</span>
                                    <span className='whitespace-nowrap'>Gender</span>
                                    <span className='whitespace-nowrap'>City</span>
                                    <span className='whitespace-nowrap'>Date of Birth</span>
                                </div>
                                <div className='w-full'>
                                    <ProfileForm initialValues={user} setOpenEdit={setOpenEdit} setUser={setUser}/>
                                </div>
                            </div>
                        </>
                    )}
                    {!openEdit && (
                        <>
                            <img src="https://cinepolis.co.id/images/temp/pro_im.jpg" alt="user-avatar" className='rounded-lg' />
                            <div className='flex gap-20'>
                                <div className='flex flex-col gap-10 text-gray-500'>
                                    <span>Name</span>
                                    <span>Gender</span>
                                    <span>City</span>
                                    <span>Date of Birth</span>
                                </div>
                                <div className='flex flex-col gap-10 text-gray-500 capitalize'>
                                    <span>{user?.name || '-'}</span>
                                    <span>{user?.gender || '-'}</span>
                                    <span>{user?.city || '-'}</span>
                                    <span>{formatDate(user?.date_of_birth!) || '-'}</span>
                                </div>
                            </div>
                        </>
                    )}
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
