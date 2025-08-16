import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import Link from 'next/link'
import React from 'react'

export default function AdminMoviesPage() {
  return (
    <div>
        <div className='flex justify-between items-center'>
            <PageTitle title='Movies' />
            <Button>
                <Link href={'/admin/movies/add'}>
                    Add Movie
                </Link>
            </Button>

        </div>
    </div>
  )
}
