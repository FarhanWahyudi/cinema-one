import React from 'react'
import ShowForm from '../../_components/show-form'
import PageTitle from '@/components/ui/page-title'
import { getShowById } from '@/actions/shows';

interface EditShowPageProps {
  params: Promise<{ id: string }>
}

export default async function EditShowPage({ params }: EditShowPageProps) {
  const { id } = await params
  const response = await getShowById(id)
  if (!response.success) {
    return <h1>{response.message}</h1>
  }

  const initialValues = response.data
  return (
    <div>
        <PageTitle title='Edit Penayangan' />
        <ShowForm formType='edit' initialValues={initialValues}/>
    </div>
  )
}
