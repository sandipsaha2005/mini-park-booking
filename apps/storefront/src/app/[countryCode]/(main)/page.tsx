import { Metadata } from "next"
import { listTickets } from "@lib/data/tickets"
import TicketCard from "@modules/tickets/components/ticket-card"

export const metadata: Metadata = {
  title: "ParkPass — Explore Park Tickets",
  description: "Book your next adventure. Explore single-park passes and multi-park combo deals.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const tickets = await listTickets()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="20" cy="20" r="40" fill="white" />
            <circle cx="80" cy="80" r="50" fill="white" />
            <circle cx="80" cy="10" r="20" fill="white" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
            Tickets available now
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Your Next Adventure
            <br />
            <span className="text-emerald-300">Starts Here</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto mb-10">
            Choose from single-park passes or unlock multiple parks with our combo plans. Book in minutes.
          </p>
          <a
            href="#tickets"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors text-lg shadow-xl"
          >
            Explore Tickets
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Available Tickets</h2>
            <p className="text-gray-500 mt-2">
              {tickets.length > 0
                ? `${tickets.length} ticket${tickets.length > 1 ? "s" : ""} available`
                : "Check back soon for new tickets"}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Single Park
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Combo Plan
            </span>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-xl font-semibold text-gray-500">No tickets available yet</p>
            <p className="mt-1">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} countryCode={countryCode} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Ready to explore?</h3>
            <p className="text-emerald-100">Create a free account to book tickets and manage your visits.</p>
          </div>
          <a
            href={`/${countryCode}/account`}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-7 py-3.5 rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Create Account
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
