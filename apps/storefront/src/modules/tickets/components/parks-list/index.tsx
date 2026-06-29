import Image from "next/image"
import { Park } from "@lib/data/tickets"

export default function ParksList({ parks }: { parks: Park[] }) {
  if (!parks || parks.length === 0) {
    return (
      <p className="text-gray-400 text-sm italic">No parks listed for this ticket.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {parks.map((park) => (
        <div
          key={park.id}
          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative h-36 w-full bg-gray-100">
            {park.image_url ? (
              <img
                src={park.image_url}
                alt={park.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                <svg className="w-10 h-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-gray-900 text-sm">{park.name}</h4>
            {park.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{park.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
