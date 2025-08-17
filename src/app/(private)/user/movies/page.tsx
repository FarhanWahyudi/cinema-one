import { getActiveMovies } from '@/actions/movies'
import PageTitle from '@/components/ui/page-title'
import { IMovie } from '@/interfaces'
import React from 'react'
import MovieTitle from './_components/movie-title'

export default async function UserMovies() {
    const response: any = await getActiveMovies({})
    if (!response.success) {
        return <h1>failed to load movie</h1>
    }

    if (response.data.length === 0) {
        return <h1>No Movies Found</h1>
    }

    const movies: IMovie[] = response.data;
    return (
        <div>
            <PageTitle title='Latest in Theatres' />
            <div className='grid grid-cols-4 gap-5 mt-5'>
                {movies.map((movie) => (
                    <MovieTitle key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}
