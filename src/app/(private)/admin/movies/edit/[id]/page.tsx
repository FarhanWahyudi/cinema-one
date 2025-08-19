import React from 'react'
import MovieForm from '../../_components/movie-form'
import PageTitle from '@/components/ui/page-title'
import { getMovieById } from '@/actions/movies';

interface EditMoviePageProps {
  params : Promise<{ id: string }>
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  const { id } = await params;
  const movieResponse = await getMovieById(id);
  if (!movieResponse.success) {
    return <h1>{movieResponse.message}</h1>
  }

  const movie = movieResponse.data;
  return (
    <div>
        <PageTitle title='Edit Film' />
        <MovieForm formType='edit' initialValues={movie} />
    </div>
  )
}
