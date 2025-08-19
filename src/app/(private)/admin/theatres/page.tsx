"use client"

import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import React, { useEffect, useState } from 'react'
import TheatreForm from './_components/theatres-form'
import { useRouter } from 'next/navigation'
import { ITheatre } from '@/interfaces'
import { deleteTheatre, getAllTheatres } from '@/actions/theatres'
import toast from 'react-hot-toast'
import Spinner from '@/components/functional/spinner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit2, Trash2 } from 'lucide-react'

export default function AdminThearesPage() {
    const [ openTheatreForm, setOpenTheatreForm ] = useState(false)
    const [ theatres, settheatres ] = useState<ITheatre[]>([])
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ formType, setFormType ] = useState<'add' | 'edit'>('add')
    const [ selectedTheatre, setSelectedTheatre ] = useState<Partial<ITheatre> | null >(null)

    const fetchThetre = async () => {
        try {
            setLoading(true)
            const response: any = await getAllTheatres();
            if (!response.success) {
                throw new Error(response.message)
            }
            settheatres(response.data)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThetre();
    }, [])

    const columns = [
        'Nama',
        'Alamat',
        'Kapasitas',
        'Actions'
    ]

    const handleDelete = async (theatreId: string) => {
        try {
            setLoading(true)
            const response = await deleteTheatre(theatreId)
            if (!response.success) {
                throw new Error(response.message)
            }
            toast.success(response.message)
            fetchThetre()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className='flex justify-between items-center mb-10'>
                <PageTitle title='Teater' />
                <Button onClick={() => {
                    setOpenTheatreForm(true)
                    setFormType('add')
                    setSelectedTheatre(null)
                }}>Tambah Teater</Button>
            </div>

            {loading && <Spinner />}
            
            {!loading && theatres.length === 0 && (
                <h1 className='text-center text-lg'>No Theatres Found</h1>
            )}

            {!loading && theatres.length > 0 && (
                <Table>
                    <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                        <TableHead key={column} className="text-left">{column}</TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {theatres.map((theatre) => (
                        <TableRow key={theatre.id}>
                            <TableCell>{theatre.name}</TableCell>
                            <TableCell>{theatre.address}</TableCell>
                            <TableCell>{theatre.capacity}</TableCell>
                            <TableCell  className='py-5'>
                                <div className='flex gap-2 items-center'>
                                <Button onClick={() => {
                                    setSelectedTheatre(theatre)
                                    setFormType('edit')
                                    setOpenTheatreForm(true)
                                }} variant={"secondary"} size={'icon'}>
                                    <Edit2 size={15} />
                                </Button>
                                <Button onClick={() => handleDelete(theatre.id)} variant={"secondary"} size={'icon'}>
                                    <Trash2 size={15} />
                                </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}

            {openTheatreForm && (
                <TheatreForm
                    openTheatreForm = {openTheatreForm}
                    setOpenTheatreForm = {setOpenTheatreForm}
                    reloadData = {fetchThetre}
                    formType = {formType}
                    selectedTheatre={selectedTheatre!}
                />
            )}
        </div>
    )
}
