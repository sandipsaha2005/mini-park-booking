import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { getBooking } from "@lib/data/bookings"
import ParksList from "@modules/tickets/components/parks-list"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Booking Details — ParkPass",
}

export default async function BookingDetailPage(props: {
  params: Promise<{ countryCode: string; id: string }>
}) {
  const { countryCode, id } = await props.params
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) return notFound()

  const booking = await getBooking(id)
  if (!booking) return notFound()

  const statusColor =
    booking.status === "confirmed"
      ? "bg-emerald-100 text-emerald-700"
      : booking.status === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"

  return (
    <div>
      <Link
        href={`/${countryCode}/account/tickets`}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Tickets
      </Link>

      {/* Status banner */}
      {booking.status === "confirmed" && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-8">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-emerald-800">Booking Confirmed!</p>
            <p className="text-sm text-emerald-600">Your ticket is ready. Show this at the park entrance.</p>
          </div>
        </div>
      )}

      {/* Booking details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor} inline-block mb-3`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900">{booking.ticket_name}</h1>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-extrabold text-gray-900">${booking.total_price.toFixed(2)}</p>
            <p className="text-sm text-gray-400">Total paid</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Booking ID</p>
            <p className="text-sm font-mono text-gray-700 truncate">{booking.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Quantity</p>
            <p className="text-sm text-gray-700">{booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Booked On</p>
            <p className="text-sm text-gray-700">
              {new Date(booking.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Parks you can visit */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {booking.parks?.length === 1 ? "Park You Can Visit" : `Parks You Can Visit (${booking.parks?.length || 0})`}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Show your booking confirmation at the entrance of any of these parks.
        </p>
        <ParksList parks={booking.parks || []} />
      </div>
    </div>
  )
}
