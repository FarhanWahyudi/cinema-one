import PageTitle from '@/components/ui/page-title'
import React from 'react'
import ShowForm from '../_components/show-form'

export default function AddShowPage() {
  return (
    <div>
        <PageTitle title='Tambah Penayangan' />
        <ShowForm formType='add' />
    </div>
  )
}
