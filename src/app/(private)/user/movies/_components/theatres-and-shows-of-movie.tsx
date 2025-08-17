import { formatTime } from '@/helpers/date-time-formats';
import { IShow, ITheatre } from '@/interfaces'
import dayjs from 'dayjs';
import { Heading1 } from 'lucide-react';
import React from 'react'

interface TheatresAndShowsProps {
    theatresAndShows: {
        theatre: ITheatre;
        shows: IShow[]
    }[];
    selectedTheatre: string | null
    setSelectedTheatre: (theatreId: string | null) => void
    selectedShow: string | null
    setSelectedShow: (showId: string | null) => void
}

export default function TheatresAndShowsOfMovie({
    theatresAndShows,
    selectedTheatre,
    setSelectedTheatre,
    selectedShow,
    setSelectedShow,
}: TheatresAndShowsProps) {
  return (
    <div>
      {theatresAndShows.length === 0 && <h1>No theatres or shows availabel for this movie.</h1>}
      <div className='flex flex-col gap-5 mt-5'>
        {theatresAndShows.map((theatreAndShow) => {
          const shows = theatreAndShow.shows
          const sortedShow = shows.sort((a, b) => {
            return Number(a.time.split(':')[0]) - Number(b.time.split(':')[0])
          })
          return (
            <div key={theatreAndShow.theatre.id} className='flex flex-col gap-3 border border-gray-300 rounded-lg p-5'>
              <div>
                <h1 className='text-sm font-bold text-primary'>{theatreAndShow.theatre.name}</h1>
                <p className='text-xs text-gray-500'>{theatreAndShow.theatre.address}</p>
              </div>
              <div className='flex gap-5'>
                {sortedShow.map((show) => {
                  const isSelected = selectedShow === show.id;
                  return (
                    <div
                      key={show.id}
                      className={`border p-3 rounded-lg text-sm cursor-pointer ${
                        isSelected
                          ? 'border-2 border-primary text-primary'
                          : 'bg-white text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedTheatre(theatreAndShow.theatre.id)
                        setSelectedShow(show.id)
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
