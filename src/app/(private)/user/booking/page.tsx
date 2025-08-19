"use client"

import { getUserBookings } from '@/actions/bookings';
import PageTitle from '@/components/ui/page-title'
import { IBooking } from '@/interfaces';
import { IUserStore, useUsersStore } from '@/store/users-store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Spinner from '@/components/functional/spinner';
import { formatDate, formatTime } from '@/helpers/date-time-formats';
import dayjs from 'dayjs';

export default function UserBookingsPage() {
  const [bookings, setBookins] = useState<IBooking[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useUsersStore() as IUserStore

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response: any = await getUserBookings(user!.id);
      if (!response.success) {
        throw new Error(response.message)
      }
      setBookins(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const columns = [
      'Teater',
      'Film',
      'Penayangan',
      'Kursi',
      'Status',
      'Actions'
  ]

  return (
    <div>
        <PageTitle title='Booking saya' />

        {loading && <Spinner />}
        
        {!loading && bookings.length === 0 && (
          <h1 className='text-center text-lg'>No Bookings Found</h1>
        )}

        {!loading && bookings.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-left">{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  
                  <TableCell>{booking.theatre?.name}</TableCell>
                  <TableCell>{booking.movie?.name}</TableCell>
                  <TableCell>{formatDate(booking.show!.date)} {formatTime(booking.show!.time)}</TableCell>
                  <TableCell>{booking.seat_numbers.join(', ')}</TableCell>
                  <TableCell>{booking.status.toUpperCase()}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-5'>
                      {dayjs(booking.show?.date).isAfter(dayjs()) && (
                        <span className='text-sm cursor-pointer py-5'>Cancel</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
    </div>
  )
}
