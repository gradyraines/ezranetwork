import { useEffect, useRef } from 'react'
import { useNetworkStore } from '../../store/useNetworkStore'
import { ConnectionCard } from './ConnectionCard'
import { NetworkGraph } from '../visualization/NetworkGraph'

const MIN_CONNECTIONS = 10

export function ConnectionsStep() {
  const connections = useNetworkStore((s) => s.connections)
  const addConnection = useNetworkStore((s) => s.addConnection)
  const setStep = useNetworkStore((s) => s.setStep)

  const listRef = useRef<HTMLDivElement>(null)
  const scrollToNewCard = useRef(false)

  const handleAddConnection = () => {
    scrollToNewCard.current = true
    addConnection()
  }

  // After a card is added via the button, scroll it into view and focus its name field
  useEffect(() => {
    if (!scrollToNewCard.current) return
    scrollToNewCard.current = false
    const lastCard = listRef.current?.lastElementChild as HTMLElement | null
    if (!lastCard) return
    lastCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
    lastCard.querySelector('input')?.focus({ preventScroll: true })
  }, [connections.length])

  const namedConnections = connections.filter((c) => c.name.trim())
  const canProceed = namedConnections.length >= MIN_CONNECTIONS

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Connection forms */}
      <div className="lg:w-1/2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Your Connections
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Add at least {MIN_CONNECTIONS} people from your professional network.
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-2xl font-bold ${
                canProceed ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {namedConnections.length}
            </span>
            <span className="text-sm text-slate-400">
              /{MIN_CONNECTIONS} min
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              canProceed ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
            style={{
              width: `${Math.min(100, (namedConnections.length / MIN_CONNECTIONS) * 100)}%`,
            }}
          />
        </div>

        <div
          ref={listRef}
          className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1"
        >
          {connections.map((connection, i) => (
            <ConnectionCard key={connection.id} connection={connection} index={i} />
          ))}
        </div>

        <button
          onClick={handleAddConnection}
          className="w-full border-2 border-dashed border-slate-300 text-slate-500 py-3 rounded-lg text-sm font-medium hover:border-slate-400 hover:text-slate-600 transition-colors"
        >
          + Add connection
        </button>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={!canProceed}
            className="flex-1 bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next: Who knows whom
          </button>
        </div>
      </div>

      {/* Right: Live graph */}
      <div className="lg:w-1/2 lg:sticky lg:top-32 lg:self-start">
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-[500px]">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Your network (live preview)
          </h3>
          <NetworkGraph height="calc(100% - 28px)" />
        </div>
      </div>
    </div>
  )
}
