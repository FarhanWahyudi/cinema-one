"use client"

import { getAllUsers } from '@/actions/users'
import Spinner from '@/components/functional/spinner'
import PageTitle from '@/components/ui/page-title'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IUser } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(false)

    const fetchUsers = async () =>{
        try {
            setLoading(true)
            const response: any = await getAllUsers()
            if (!response.success) {
                throw new Error(response.message)
            }
            setUsers(response.data)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const columns = [
        'User ID',
        'Name',
        'Email',
        'Role',
        'Created At'
    ]
    
    return (
        <div>
            <PageTitle title='All Users' />

            {loading && <Spinner />}

            {!loading && users.length > 0 && (
                <Table className='mt-5'>
                    <TableHeader className='bg-gray-200 text-primary font-bold'>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column}
                                    className='text-left font-bold text-primary'
                                >
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: IUser) => (
                            <TableRow key={user.id}>
                                <TableCell className='py-5'>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <select defaultValue={user.role} className='p-3 border border-gray-400 rounded-lg'>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </TableCell>
                                <TableCell>{user.created_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
