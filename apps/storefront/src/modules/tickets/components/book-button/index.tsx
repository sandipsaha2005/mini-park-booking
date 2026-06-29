"use client"

import { useRouter } from "next/navigation"

type Props = {
  ticketId: string
  ticketName: string
  price: number
  isLoggedIn: boolean
  countryCode: string
}

export default function BookButton({ ticketId, ticketName, price, isLoggedIn, countryCode }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/${countryCode}/account`)
      return
    }
    router.push(`/${countryCode}/book/${ticketId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors text-base shadow-sm hover:shadow-md"
    >
      {isLoggedIn ? `Book Now — $${price.toFixed(2)}` : "Login to Book"}
    </button>
  )
}
