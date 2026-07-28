import { useNetworkStore } from '../../store/useNetworkStore'

export function WelcomeStep() {
  const setStep = useNetworkStore((s) => s.setStep)
  const studentName = useNetworkStore((s) => s.studentName)
  const setStudentName = useNetworkStore((s) => s.setStudentName)
  const connections = useNetworkStore((s) => s.connections)

  const hasExistingData = connections.length > 0

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
        </div>
      </div>
    </div>
  )
}
