import PageTitle from '@/components/ui/page-title'
import React from 'react'
import MovieForm from '../_components/movie-form'

export default function AddMoviepage() {
  return (
    <div>
        <PageTitle title='Add Movie' />
        <MovieForm formType='add' />
    </div>
  )
}
