"use client"

import { getMovieById } from '@/actions/movies'
import { getShowByMovieId } from '@/actions/shows'
import Spinner from '@/components/functional/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PageTitle from '@/components/ui/page-title'
import { IMovie, IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TheatresAndShowsOfMovie from '../_components/theatres-and-shows-of-movie'
import { formatDate, formatDuration } from '@/helpers/date-time-formats'
import { Clapperboard } from 'lucide-react'

export default function MovieTheatreAndShowPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [selectedShow, setSelectedShow] = useState<string | null>(null)
  const [fetchingShows, setFetchingShows] = useState(false)
  const [theatresAndShows, setTheatresAndShows] = useState<{
    theatre: ITheatre,
    shows: IShow[]
  }[]>([])
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const upcomingShows = movie?.show?.filter(show => new Date(show.date) >= today) || [];

  const fetchMovie = async () => {
    setLoading(true)
    setError(null)
    try {
      const movieData: any = await getMovieById(params.id as string)
      console.log(movieData)
      if (!movieData.success) {
        throw new Error(movieData.message || 'Failed to fetch movie details')
      }
      console.log(movieData.data.show)
      setMovie(movieData.data)
    } catch (error: any) {
      setError('Failed to fetch movie details')
    } finally {
      setLoading(false)
    }
  }

  const fetchTheatresAndShows = async () => {
    try {
      setFetchingShows(true)
      const response = await getShowByMovieId(params.id as string, date)
      if (!response.success) {
        throw new Error(response.message || 'failed to fetch theatres and shows')
      }
      setTheatresAndShows(response.data)
    } catch (error) {
      toast.error('failed to fecth theatres and shows')
    } finally {
      setFetchingShows(false)
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [params.id])

  useEffect(() => {
    if (date) {
      fetchTheatresAndShows();
    }
  }, [date])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <h1>{error}</h1>
  }
  
  return (
      <div className='flex flex-col gap-5'>
        <div className="w-full h-[500px] bg-black flex justify-between items-center rounded-3xl overflow-hidden">
          <div className="text-white uppercase flex flex-col gap-2 ml-26">
              <h2 className="text-3xl font-bold">{movie?.name}</h2>
              <span>{movie?.genre} - {formatDuration(Number(movie?.duration))}</span>
              <p className='line-clamp-4 text-gray-300 text-sm mt-5'>{movie?.description}</p>
          </div>
          <div className="flex-none w-[50%] min-h-full bg-cover flex items-end py-16 px-32 bg-center rounded-l-full"
              style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.2)), url(${movie?.poster_url})`}}
          >
          </div>
        </div>
        <div className='w-full -mt-16 flex justify-center'>
          <div className='w-[50%] bg-white h-24 rounded-xl px-10 flex gap-3 border border-gray-200 shadow-lg shadow-gray-200'>
          {upcomingShows.length === 0 && (
            <div className='w-full flex justify-center items-center'>
              <h2 className='text-lg font-semibold text-center'>Kami mohon maaf<br/>Film ini tidak ada penayangan untuk satu miggu ke depan</h2>
            </div>
          )}
          {[...new Set(upcomingShows.map(show => show.date))]
          .map((date, idx) => (
            <div key={idx}
            className={`bg-blue-400 h-full w-max text-lg text-white flex flex-col items-center justify-center px-5 cursor-pointer
              ${selectedShow === date ? 'bg-blue-600' : ''}
            `}
            onClick={() => {setDate(date); setSelectedShow(date)}}>
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
        {selectedShow === null && (
          <div className='flex flex-col items-center justify-center gap-5 mt-20'>
            <Clapperboard size={100} strokeWidth={1} className='bg-blue-400 p-5 rounded-full text-white'/>
            <h2 className='text-xl font-semibold'>Silakan pilih jadwal penayangan</h2>
          </div>
        )}
        {fetchingShows
          ? <Spinner />
          : <TheatresAndShowsOfMovie
              theatresAndShows={theatresAndShows}
            />
        }
      </div>
  )
}
