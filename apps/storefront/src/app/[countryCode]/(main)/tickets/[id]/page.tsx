import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTicket } from "@lib/data/tickets"
import { retrieveCustomer } from "@lib/data/customer"
import TicketTypeBadge from "@modules/tickets/components/ticket-type-badge"
import ParksList from "@modules/tickets/components/parks-list"
import BookButton from "@modules/tickets/components/book-button"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const ticket = await getTicket(id)
  return {
    title: ticket ? `${ticket.name} — ParkPass` : "Ticket Not Found",
  }
}

export default async function TicketDetailPage({ params }: Props) {
  const { countryCode, id } = await params
  const [ticket, customer] = await Promise.all([
    getTicket(id),
    retrieveCustomer().catch(() => null),
  ])

  console.log({ ticket });
  
  if (!ticket) return notFound()

  const parkCount = ticket.parks?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <a
            href={`/${countryCode}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to tickets
          </a>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="mb-3">
                <TicketTypeBadge type={ticket.ticket_type} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                {ticket.name}
              </h1>
              <p className="text-white/70 text-lg">
                {parkCount === 0
                  ? "Parks TBA"
                  : parkCount === 1
                  ? `Access to ${ticket.parks[0].name}`
                  : `Access to ${parkCount} parks`}
              </p>
            </div>
            <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5 text-center">
              <p className="text-white/60 text-sm mb-1">Price per ticket</p>
              <p className="text-4xl font-extrabold">${ticket.price.toFixed(2)}</p>
              <p className="text-white/50 text-xs mt-1">
                {ticket.available_quantity > 0
                  ? `${ticket.available_quantity} available`
                  : "Sold out"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Parks section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {parkCount === 1 ? "Park Included" : `Parks Included (${parkCount})`}
            </h2>
            <p className="text-gray-500 mb-6">
              {ticket.ticket_type === "single"
                ? "Your ticket grants access to the following park."
                : "Your combo ticket grants access to all of the following parks."}
            </p>
            <ParksList parks={ticket.parks} />
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Book Your Visit</h3>
              <p className="text-sm text-gray-500 mb-5">
                Secure your spot at {parkCount === 1 ? ticket.parks[0]?.name || "the park" : `${parkCount} parks`}.
              </p>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-5">
                <span className="text-gray-600 text-sm">Price</span>
                <span className="font-bold text-gray-900">${ticket.price.toFixed(2)}</span>
              </div>

              {ticket.status !== "active" ? (
                <div className="text-center py-4 text-red-500 font-medium">
                  This ticket is currently unavailable.
                </div>
              ) : ticket.available_quantity === 0 ? (
                <div className="text-center py-4 text-orange-500 font-medium">
                  Sold out — check back later.
                </div>
              ) : (
                <BookButton
                  ticketId={ticket.id}
                  ticketName={ticket.name}
                  price={ticket.price}
                  isLoggedIn={!!customer}
                  countryCode={countryCode}
                />
              )}

              <ul className="mt-5 space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instant booking confirmation
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid for one visit per ticket
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View in My Account anytime
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
