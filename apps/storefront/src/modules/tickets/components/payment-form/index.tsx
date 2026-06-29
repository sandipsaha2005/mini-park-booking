"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@lib/data/bookings"

type Props = {
  ticketId: string
  price: number
  countryCode: string
}

const initialState = { error: null, booking_id: null }

export default function PaymentForm({ ticketId, price, countryCode }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createBooking, initialState)

  useEffect(() => {
    if (state.booking_id) {
      router.push(`/${countryCode}/account/tickets/${state.booking_id}`)
    }
  }, [state.booking_id, countryCode, router])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Payment Details</h2>
      <p className="text-sm text-gray-400 mb-6">This is a demo — no real payment is processed.</p>

      {/* Mock card UI */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5 mb-6 text-white shadow-md">
        <div className="flex justify-between items-center mb-8">
          <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-xs font-bold tracking-widest opacity-60">PARKPASS</span>
        </div>
        <p className="text-lg tracking-[0.3em] font-mono mb-4">•••• •••• •••• 4242</p>
        <div className="flex justify-between text-xs opacity-70">
          <span>CARDHOLDER NAME</span>
          <span>EXP 12/28</span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="ticket_id" value={ticketId} />
        <input type="hidden" name="quantity" value="1" />

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-gray-300"
            readOnly
            defaultValue="4242 4242 4242 4242"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Expiry
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              defaultValue="12/28"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              CVV
            </label>
            <input
              type="text"
              placeholder="•••"
              defaultValue="123"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              readOnly
            />
          </div>
        </div>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-base shadow-sm flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay ${price.toFixed(2)}
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        🔒 Secure demo payment — no real charge
      </p>
    </div>
  )
}
