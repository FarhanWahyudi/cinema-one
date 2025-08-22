"use client"

import { getShowByMovieId, getShowByTheatreId } from '@/actions/shows'
import { getTheatreById } from '@/actions/theatres'
import Spinner from '@/components/functional/spinner'
import { formatDate } from '@/helpers/date-time-formats'
import { IMovie, IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import MoviesAndShowsOfTheatre from '../_components/theatres-and-shows-of-movie'

export default function UserTheatresPage() {
  const params = useParams()
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theatre, setTheatre] = useState<ITheatre | null>(null)
  const [fetchingShows, setFetchingShows] = useState(false)
  const [moviesAndShows, setMoviesAndShows] = useState<{
      movie: IMovie,
      shows: IShow[]
    }[]>([])

  const fetchTheatres = async () => {
      setLoading(true)
      setError(null)
      try {
        const movieData: any = await getTheatreById(params.id as string)
        console.log(movieData)
        if (!movieData.success) {
          throw new Error(movieData.message || 'Failed to fetch movie details')
        }
        console.log(movieData.data.show)
        setTheatre(movieData.data)
      } catch (error: any) {
        setError('Failed to fetch movie details')
      } finally {
        setLoading(false)
      }
    }

    const fetchMoviesAndShows = async () => {
    try {
      setFetchingShows(true)
      const response = await getShowByTheatreId(params.id as string, date)
      if (!response.success) {
        throw new Error(response.message || 'failed to fetch theatres and shows')
      }
      setMoviesAndShows(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setFetchingShows(false)
    }
  }

  useEffect(() => {
    if (date) {
      fetchMoviesAndShows();
    }
  }, [date])

  useEffect(() => {
    fetchTheatres()
  }, [params.id])

    return (
      <div>
        <div className='flex justify-between items-center'>
          <div className='space-y-5'>
            <h2 className='text-4xl font-bold text-cyan-600'>{theatre?.name} </h2>
            <p className='text-2xl w-[500px] text-cyan-900'>Layar besar, suara menggelegar, pengalaman luar biasa, dengan kapasitas kursi sebanyak {theatre?.capacity}</p>
          </div>
          <img src={theatre?.theatre_img} alt="" className='w-[500px] aspect-square rounded-4xl object-cover'/>
        </div>
        <hr className='border-gray-400 my-20'/>
        <div className='flex justify-between items-center'>
          <h2 className='text-4xl font-bold text-gray-700'>Now Showing</h2>
          <div className='w-[50%] bg-white h-20 rounded-xl px-10 flex gap-3'>
            {[...new Set(theatre?.show?.map(show => show.date))].map((date, idx) => (
              <div key={idx}
              className='bg-cyan-600 h-full leading-6 w-max text-lg text-white flex flex-col items-center justify-center px-5 cursor-pointer'
              onClick={() => setDate(date)}>
                {formatDate(date).split(" ").map((char, i) => {
                  if (i === 1) {
                    return <span key={i} className='font-bold'>{char}</span>
                  }
                  return <span key={i}>{char}</span>
                })}
              </div>
            ))}
          </div>
        </div>
        {fetchingShows
          ? <Spinner />
          : <MoviesAndShowsOfTheatre
              moviesAndShows={moviesAndShows}
            />
        }
      </div>
    )
}
