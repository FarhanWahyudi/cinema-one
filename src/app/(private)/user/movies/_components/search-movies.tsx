"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

export default function SearchMovies() {
    const [ searchTerm, setSearchTerm ] = useState<string>('')
    const router = useRouter()

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`/user/movies?search=${searchTerm}`)
    }
    return (
        <form onSubmit={handleSearch} className='flex gap-5'>
            <Input
                className='h-10 px-5 rounded-full border-none shadow-none bg-gray-100'
                placeholder='Mau nonton apa, nih?'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type='text'
            />

            <Button type='submit' className='h-10 bg-cyan-600'>
                Search
            </Button>
        </form>
    )
}
