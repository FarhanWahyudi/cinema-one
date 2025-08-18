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
      {theatresAndShows.length === 0 && <h1>Tidak ada penayangan film ini pada tanggal yang anda pilih.</h1>}
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
                  const isSelected = selectedShow === show.id;
                  return (
                    <div
                      key={show.id}
                      className={`px-3 py-1 rounded-lg text-sm cursor-pointer bg-white border ${
                        isSelected
                          ? 'border-black'
                          : ''
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
