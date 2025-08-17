"use client"

import { getMovieById } from '@/actions/movies'
import { getShowByMovieId } from '@/actions/shows'
import Spinner from '@/components/functional/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PageTitle from '@/components/ui/page-title'
import { IMovie, IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TheatresAndShowsOfMovie from '../_components/theatres-and-shows-of-movie'

export default function MovieTheatreAndShowPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [movie, setMovie] = useState<IMovie | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [selectedTheatre, setSelectedTheatre] = useState<string | null>(null)
  const [selectedShow, setSelectedShow] = useState<string | null>(null)
  const [fetchingShows, setFetchingShows] = useState(false)
  const [theatresAndShows, setTheatresAndShows] = useState<{
    theatre: ITheatre,
    shows: IShow[]
  }[]>([])

  const fetchMovie = async () => {
    setLoading(true)
    setError(null)
    try {
      const movieData: any = await getMovieById(params.id as string)
      console.log(movieData)
      if (!movieData.success) {
        throw new Error(movieData.message || 'Failed to fetch movie details')
      }
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
        <PageTitle title={movie?.name!} />
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-1'>
            <span className='text-sm text-gray-600'>Select Date</span>
            <Input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button
            disabled={!selectedShow || !selectedTheatre}
          >
            Continue
          </Button>
        </div>
        {fetchingShows
          ? <Spinner />
          : <TheatresAndShowsOfMovie
              theatresAndShows={theatresAndShows}
              selectedTheatre={selectedTheatre}
              setSelectedTheatre={setSelectedTheatre}
              selectedShow={selectedShow}
              setSelectedShow={setSelectedShow}
            />
        }
      </div>
  )
}
