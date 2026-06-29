import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getTicket } from "@lib/data/tickets"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentForm from "@modules/tickets/components/payment-form"

type Props = {
  params: Promise<{ countryCode: string; ticketId: string }>
}

export const metadata: Metadata = {
  title: "Complete Booking — ParkPass",
}

export default async function BookingPage({ params }: Props) {
  const { countryCode, ticketId } = await params

  const [ticket, customer] = await Promise.all([
    getTicket(ticketId),
    retrieveCustomer().catch(() => null),
  ])

  if (!customer) {
    redirect(`/${countryCode}/account`)
  }

  if (!ticket || ticket.status !== "active" || ticket.available_quantity === 0) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <a
          href={`/${countryCode}/tickets/${ticket.id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to ticket
        </a>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">{ticket.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {ticket.parks?.length === 1
                  ? ticket.parks[0].name
                  : `${ticket.parks?.length || 0} parks included`}
              </p>
            </div>
            <p className="text-xl font-extrabold text-gray-900">${ticket.price.toFixed(2)}</p>
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-900">${ticket.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment form */}
        <PaymentForm
          ticketId={ticket.id}
          price={ticket.price}
          countryCode={countryCode}
        />
      </div>
    </div>
  )
}
