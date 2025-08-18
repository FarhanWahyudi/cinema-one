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

    const renderUserProperty = (label: string, value: string | number) => (
        <div>
            <h2 className='text-sm text-gray-500'>{label}</h2>
            <p className='font-bold text-sm'>{value}</p>
        </div>
    )

    return (
        <div>
            <PageTitle title='User Profile' />
            <div className='grid grid-cols-3 mt-5 gap-7 border border-gray-300 p-5 rounded shadow-sm'>
                {renderUserProperty("User ID", user.id)}
                {renderUserProperty("Name", user.name)}
                {renderUserProperty("Email", user.email)}
                {renderUserProperty("Role", user.role)}
                {renderUserProperty("Joined At", formatDate(user.created_at))}
            </div>
        </div>
    )
}
