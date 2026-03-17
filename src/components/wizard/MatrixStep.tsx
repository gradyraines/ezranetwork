import { useNetworkStore } from '../../store/useNetworkStore'
import { NetworkGraph } from '../visualization/NetworkGraph'
import type { MatrixTieStrength } from '../../types/network'

const STRENGTH_CYCLE: MatrixTieStrength[] = ['none', 'weak', 'strong']
const STRENGTH_COLORS: Record<MatrixTieStrength, string> = {
  none: 'bg-white',
  weak: 'bg-sky-100',
  strong: 'bg-sky-500',
}
const STRENGTH_LABELS: Record<MatrixTieStrength, string> = {
  none: '',
  weak: 'W',
  strong: 'S',
}

export function MatrixStep() {
  const connections = useNetworkStore((s) => s.connections)
  const matrix = useNetworkStore((s) => s.matrix)
  const setMatrixEntry = useNetworkStore((s) => s.setMatrixEntry)
  const setStep = useNetworkStore((s) => s.setStep)

  const named = connections.filter((c) => c.name.trim())

  const lookupStrength = (sourceId: string, targetId: string): MatrixTieStrength => {
    const entry = matrix.find(
      (m) => m.sourceId === sourceId && m.targetId === targetId
    )
    return entry?.strength ?? 'none'
  }

  const handleCellClick = (sourceId: string, targetId: string) => {
    const current = lookupStrength(sourceId, targetId)
    const currentIdx = STRENGTH_CYCLE.indexOf(current)
    const next = STRENGTH_CYCLE[(currentIdx + 1) % STRENGTH_CYCLE.length]
    setMatrixEntry(sourceId, targetId, next)
  }

  const truncateName = (name: string, maxLen = 10) =>
    name.length > maxLen ? name.slice(0, maxLen) + '...' : name

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Matrix */}
      <div className="lg:w-1/2 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Who Knows Whom?</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Click each cell to indicate whether two people know each other.
            Click to cycle: empty (no tie) → W (weak) → S (strong).
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 p-4">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-1" />
                {named.map((c) => (
                  <th
                    key={c.id}
                    className="p-1 text-xs text-slate-500 font-medium"
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      maxWidth: '32px',
                    }}
                  >
                    {truncateName(c.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {named.map((row) => (
                <tr key={row.id}>
                  <td className="p-1 text-xs text-slate-600 font-medium whitespace-nowrap pr-2">
                    {truncateName(row.name)}
                  </td>
                  {named.map((col) => {
                    if (row.id === col.id) {
                      return (
                        <td key={col.id} className="p-1">
                          <div className="w-8 h-8 bg-slate-100 rounded" />
                        </td>
                      )
                    }
                    const strength = lookupStrength(row.id, col.id)
                    return (
                      <td key={col.id} className="p-1">
                        <button
                          onClick={() => handleCellClick(row.id, col.id)}
                          className={`w-8 h-8 rounded border border-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${STRENGTH_COLORS[strength]} ${
                            strength === 'strong' ? 'text-white' : 'text-sky-700'
                          }`}
                          title={`${row.name} ↔ ${col.name}: ${strength || 'none'}`}
                        >
                          {STRENGTH_LABELS[strength]}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded border border-slate-200 bg-white" />
            No tie
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded border border-slate-200 bg-sky-100" />
            Weak tie
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded border border-slate-200 bg-sky-500" />
            Strong tie
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setStep(3)}
            className="flex-1 bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors"
          >
            See your insights
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
