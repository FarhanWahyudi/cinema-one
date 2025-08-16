import React from 'react'
import ShowForm from '../../_components/show-form'
import PageTitle from '@/components/ui/page-title'

export default function EditShowPage() {
  return (
    <div>
        <PageTitle title='Edit Shows' />
        <ShowForm formType='edit' />
    </div>
  )
}
