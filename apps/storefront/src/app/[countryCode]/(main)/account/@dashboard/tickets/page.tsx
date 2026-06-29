import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listBookings } from "@lib/data/bookings"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Tickets — ParkPass",
}

export default async function MyTicketsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) return notFound()

  const bookings = await listBookings()

  const statusColor = (s: string) => {
    if (s === "confirmed") return "bg-emerald-100 text-emerald-700"
    if (s === "cancelled") return "bg-red-100 text-red-700"
    return "bg-yellow-100 text-yellow-700"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {bookings.length > 0
              ? `${bookings.length} booking${bookings.length > 1 ? "s" : ""}`
              : "No bookings yet"}
          </p>
        </div>
        <Link
          href={`/${countryCode}`}
          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book More
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p className="text-lg font-semibold text-gray-500">No tickets yet</p>
          <p className="mt-1 mb-6">Browse available tickets and book your first adventure.</p>
          <Link
            href={`/${countryCode}`}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Explore Tickets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/${countryCode}/account/tickets/${booking.id}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors truncate">
                    {booking.ticket_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {booking.parks?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {booking.parks.length === 1
                          ? booking.parks[0].name
                          : `${booking.parks.length} parks`}
                      </span>
                    )}
                    <span>Qty: {booking.quantity}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-extrabold text-gray-900">${booking.total_price.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(booking.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
