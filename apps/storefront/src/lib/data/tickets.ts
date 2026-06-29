"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export type Park = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  status: string
}

export type Ticket = {
  id: string
  name: string
  price: number
  available_quantity: number
  status: string
  ticket_type: "single" | "combo"
  park_ids: string[]
  parks: Park[]
}

export const listTickets = async (): Promise<Ticket[]> => {
  const result = await sdk.client.fetch<{ tickets: Ticket[] }>("/store/tickets", {
    method: "GET",
    cache: "no-store",
  })
  return result.tickets || []
}

export const getTicket = async (id: string): Promise<Ticket | null> => {
  try {
    const result = await sdk.client.fetch<{ ticket: Ticket }>(`/store/tickets/${id}`, {
      method: "GET",
      cache: "no-store",
    })
    return result.ticket || null
  } catch {
    return null
  }
}
