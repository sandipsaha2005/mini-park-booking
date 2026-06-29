type Props = { type: "single" | "combo" }

export default function TicketTypeBadge({ type }: Props) {
  const isCombo = type === "combo"
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
        isCombo
          ? "bg-blue-100 text-blue-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isCombo ? "bg-blue-500" : "bg-emerald-500"
        }`}
      />
      {isCombo ? "Combo Plan" : "Single Park"}
    </span>
  )
}
