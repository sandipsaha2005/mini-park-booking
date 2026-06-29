"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { Park } from "./tickets"

export type Booking = {
  id: string
  ticket_id: string
  ticket_name: string
  customer_id: string
  customer_email: string
  quantity: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  parks: Park[]
}

export const listBookings = async (): Promise<Booking[]> => {
  const headers = await getAuthHeaders()
  try {
    const result = await sdk.client.fetch<{ bookings: Booking[] }>("/store/bookings", {
      method: "GET",
      headers,
      cache: "no-store",
    })
    return result.bookings || []
  } catch {
    return []
  }
}

export const getBooking = async (id: string): Promise<Booking | null> => {
  const headers = await getAuthHeaders()
  try {
    const result = await sdk.client.fetch<{ booking: Booking }>(`/store/bookings/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    return result.booking || null
  } catch {
    return null
  }
}

export const createBooking = async (
  _prevState: { error: string | null; booking_id: string | null },
  formData: FormData
): Promise<{ error: string | null; booking_id: string | null }> => {
  const headers = await getAuthHeaders()
  const ticket_id = formData.get("ticket_id") as string
  const quantity = parseInt(formData.get("quantity") as string, 10) || 1

  try {
    const result = await sdk.client.fetch<{ booking: Booking }>("/store/bookings", {
      method: "POST",
      headers,
      body: { ticket_id, quantity },
    })
    revalidateTag("bookings")
    return { error: null, booking_id: result.booking.id }
  } catch (err: any) {
    return { error: err?.message || "Booking failed. Please try again.", booking_id: null }
  }
}
