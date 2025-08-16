"use client"

import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import React, { useState } from 'react'
import TheatreForm from './_components/theatres-form'

export default function AdminThearesPage() {
    const [ openTheatreForm, setOpenTheatreForm ] = useState(false)
    return (
        <div>
            <div className='flex justify-between items-center'>
                <PageTitle title='Theatres' />
                <Button onClick={() => setOpenTheatreForm(true)}>Add theatre</Button>
            </div>

            {openTheatreForm && (
                <TheatreForm
                    openTheatreForm = {openTheatreForm}
                    setOpenTheatreForm = {setOpenTheatreForm}
                    reloadData = {() => {}}
                    formType = 'add'
                />
            )}
        </div>
    )
}
