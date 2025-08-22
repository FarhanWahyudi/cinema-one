import { formatDuration, formatTime } from '@/helpers/date-time-formats';
import { IMovie, IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs';
import { Heading1 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

interface MoviesAndShowsProps {
    moviesAndShows: {
        movie: IMovie;
        shows: IShow[]
    }[];
}

export default function MoviesAndShowsOfTheatre({
    moviesAndShows,
}: MoviesAndShowsProps) {
  const router = useRouter()
  const params = useParams()
  return (
    <div>
      <div className='flex flex-col gap-5 mt-5'>
        {moviesAndShows.map((movieAndShow) => {
          const shows = movieAndShow.shows
          const sortedShow = shows.sort((a, b) => {
            return Number(a.time.split(':')[0]) - Number(b.time.split(':')[0])
          })
          return (
            <div key={movieAndShow.movie.id} className='flex items-center'>
              <img src={movieAndShow.movie.poster_url} alt="poster" className='w-40 rounded-lg' />
              <div className='w-72 h-48 bg-gray-900 rounded-r-lg p-5 flex flex-col gap-y-2'>
                <div>
                  <h2 className='uppercase text-xl font-bold text-white line-clamp-2'>{movieAndShow.movie.name}</h2>
                  <span className='capitalize text-gray-300'>{movieAndShow.movie.genre} | {formatDuration(Number(movieAndShow.movie.duration))}</span>
                </div>
                <Link href={`/user/movies/${movieAndShow.movie.id}`} className='text-blue-600'>Movie Detail</Link>
                <div className='flex gap-2'>
                  {sortedShow.map((show) => {
                    return (
                      <div
                        key={show.id}
                        className={`px-2 py-0.5 rounded-lg text-xs cursor-pointer bg-white w-max border`}
                        onClick={() => {
                          router.push(`/user/movies/${show.movie.id}/select-seats?theatreId=${params.id}&showId=${show.id}`)
                        }}
                      >
                        {formatTime(show.time)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
