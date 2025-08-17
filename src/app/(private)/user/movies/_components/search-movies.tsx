"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function SearchMovies() {
    const [ searchTerm, setSearchTerm ] = useState<string>('')
    const router = useRouter()

    const handleSearch = () => {
        router.push(`/user/movies?search=${searchTerm}`)
    }
    return (
        <div className='flex gap-5'>
            <Input
                className='h-14'
                placeholder='Search Movies...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type='text'
            />

            <Button onClick={handleSearch} className='h-14'>
                Search
            </Button>
        </div>
    )
}
