import React from 'react'
import MovieForm from '../../_components/movie-form'
import PageTitle from '@/components/ui/page-title'

export default function EditMoviePage() {
  return (
    <div>
        <PageTitle title='Add Movie' />
        <MovieForm formType='add' />
    </div>
  )
}
