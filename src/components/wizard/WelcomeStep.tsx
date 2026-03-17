import { useRef } from 'react'
import { useNetworkStore } from '../../store/useNetworkStore'

export function WelcomeStep() {
  const setStep = useNetworkStore((s) => s.setStep)
  const studentName = useNetworkStore((s) => s.studentName)
  const setStudentName = useNetworkStore((s) => s.setStudentName)
  const connections = useNetworkStore((s) => s.connections)
  const importData = useNetworkStore((s) => s.importData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasExistingData = connections.length > 0

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const json = ev.target?.result as string
      const success = importData(json)
      if (!success) {
        alert('Invalid file format. Please select a valid network data JSON file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Map Your Professional Network
        </h2>
        <p className="text-slate-600 mb-6">
          This exercise helps you visualize and analyze your professional network
          using concepts from network science. You'll discover how your connections
          are structured and what that means for your access to information,
          opportunities, and support.
        </p>

        <div className="bg-slate-50 rounded-lg p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
            How it works
          </h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex gap-3">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                1
              </span>
              <p>
                <strong>Add your connections</strong> — List at least 10 people in
                your professional network with a few key attributes each.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                2
              </span>
              <p>
                <strong>Map who knows whom</strong> — Indicate which of your
                connections know each other.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <p>
                <strong>Explore your insights</strong> — See an interactive
                visualization and metrics that reveal the structure of your network.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Estimated time: 20-30 minutes
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="studentName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Your name
            </label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setStep(1)}
            disabled={!studentName.trim()}
            className="w-full bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {hasExistingData ? 'Continue where you left off' : 'Get started'}
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200" />
            <span>or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-slate-300 text-slate-600 py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Import previous data (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-700 text-sm mb-1">
            Structural Holes
          </h4>
          <p className="text-xs text-slate-500">
            Discover where you bridge disconnected groups — and the advantage that
            creates. (Ron Burt)
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-700 text-sm mb-1">
            Strength of Weak Ties
          </h4>
          <p className="text-xs text-slate-500">
            Learn why your casual acquaintances may be your most valuable
            connections. (Mark Granovetter)
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="font-semibold text-slate-700 text-sm mb-1">
            Network Density
          </h4>
          <p className="text-xs text-slate-500">
            Understand the tradeoff between trust (dense networks) and information
            diversity (sparse networks).
          </p>
        </div>
      </div>
    </div>
  )
}
