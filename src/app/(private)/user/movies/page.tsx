import { getActiveMovies } from '@/actions/movies'
import PageTitle from '@/components/ui/page-title'
import { IMovie } from '@/interfaces'
import React from 'react'
import MovieTitle from './_components/movie-title'
import SearchMovies from './_components/search-movies'
import NoDataMessage from '@/components/functional/no-data-message'
import Spinner from '@/components/functional/spinner'

interface MovieTitleProps {
    searchParams: Promise<{ search?: string}>
}

export default async function UserMovies({ searchParams }: MovieTitleProps) {
    const searchParamsObj = await searchParams

    const response: any = await getActiveMovies({
        search: searchParamsObj.search || ''
    })
    if (!response.success) {
        return <h1>failed to load movie</h1>
    }

    const movies: IMovie[] = response.data;
    return (
        <div className='flex flex-col gap-5'>
            <PageTitle title='Film' />
            <SearchMovies />
                {movies.length === 0 ? (
                    <NoDataMessage />
                ) : (
                    <div className='grid grid-cols-4 gap-10 mt-10'>
                        {movies.map((movie) => (
                            <MovieTitle key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
        </div>
    )
}
