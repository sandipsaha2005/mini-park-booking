import Link from "next/link"
import { Ticket } from "@lib/data/tickets"
import TicketTypeBadge from "../ticket-type-badge"

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export default function TicketCard({ ticket, countryCode }: { ticket: Ticket; countryCode: string }) {
  const parkCount = ticket.parks?.length || 0
  const firstParkImage = ticket.parks?.[0]?.image_url

  return (
    <Link
      href={`/${countryCode}/tickets/${ticket.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        {firstParkImage ? (
          <img
            src={firstParkImage}
            alt={ticket.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <TicketTypeBadge type={ticket.ticket_type} />
        </div>
        {ticket.available_quantity <= 10 && ticket.available_quantity > 0 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Only {ticket.available_quantity} left
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
          {ticket.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {parkCount === 0
              ? "No parks assigned"
              : parkCount === 1
              ? ticket.parks[0].name
              : `${parkCount} parks included`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-extrabold text-gray-900">
              {formatPrice(ticket.price)}
            </span>
            <span className="text-gray-400 text-sm ml-1">/ ticket</span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
            View Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
