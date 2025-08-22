import { formatTime } from '@/helpers/date-time-formats';
import { IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs';
import { Heading1 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

interface TheatresAndShowsProps {
    theatresAndShows: {
        theatre: ITheatre;
        shows: IShow[]
    }[];
}

export default function TheatresAndShowsOfMovie({
    theatresAndShows,
}: TheatresAndShowsProps) {
  const router = useRouter()
  const params = useParams()
  return (
    <div>
      <div className='flex flex-col gap-5 mt-5'>
        {theatresAndShows.map((theatreAndShow) => {
          const shows = theatreAndShow.shows
          const sortedShow = shows.sort((a, b) => {
            return Number(a.time.split(':')[0]) - Number(b.time.split(':')[0])
          })
          return (
            <div key={theatreAndShow.theatre.id} className='flex flex-col gap-5 bg-gradient-to-l from-white to-cyan-50 rounded-lg py-10 px-12 z-10'>
              <h1 className='text-xl font-bold text-primary uppercase'>{theatreAndShow.theatre.name} - {theatreAndShow.theatre.address}</h1>
              <div className='flex gap-2'>
                {sortedShow.map((show) => {
                  return (
                    <div
                      key={show.id}
                      className={`px-3 py-1 rounded-lg text-sm cursor-pointer bg-white border`}
                      onClick={() => {
                        router.push(`/user/movies/${params.id}/select-seats?theatreId=${theatreAndShow.theatre.id}&showId=${show.id}`)
                      }}
                    >
                      {formatTime(show.time)}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
