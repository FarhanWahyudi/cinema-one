"use client"

import { getAllBookings } from '@/actions/bookings';
import PageTitle from '@/components/ui/page-title'
import { IBooking, IMovie } from '@/interfaces';
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
import NoDataMessage from '@/components/functional/no-data-message';

export default function UserBookingsPage() {
  const [bookings, setBookins] = useState<IBooking[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response: any = await getAllBookings();
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
      fetchBookings()
  }, [])

  const columns = [
      'Teater',
      'Film',
      'Penayangan',
      'Kursi',
      'Jumlah',
      'Status',
      'Waktu Pemesanan'
  ]

  return (
    <div>
        <PageTitle title='Daftar Booking' />

        {loading && <Spinner />}
        
        {!loading && bookings.length === 0 && (
          <NoDataMessage />
        )}

        {!loading && bookings.length > 0 && (
          <Table className='mt-10'>
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
                  
                  <TableCell className='uppercase'>{booking.theatre?.name}</TableCell>
                  <TableCell className='uppercase'>{booking.movie?.name}</TableCell>
                  <TableCell>{formatDate(booking.show!.date)} - {formatTime(booking.show!.time)}</TableCell>
                  <TableCell>{booking.seat_number.join(', ')}</TableCell>
                  <TableCell>{booking.total_amount}</TableCell>
                  <TableCell>{booking.status.toUpperCase()}</TableCell>
                  <TableCell>{formatDate(booking.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        )}
    </div>
  )
}
