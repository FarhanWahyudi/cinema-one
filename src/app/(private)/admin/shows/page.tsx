import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import Link from 'next/link'
import React from 'react'

export default function AdminShowsPage() {
  return (
    <div>
        <div className='flex justify-between items-center'>
            <PageTitle title='Shows' />
            <Button>
                <Link href={'/admin/shows/add'}>
                    Add Show
                </Link>
            </Button>
        </div>
    </div>
  )
}
