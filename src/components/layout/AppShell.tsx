import { StepIndicator } from './StepIndicator'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
              Network Analysis Tool
            </h1>
          </div>
          <StepIndicator />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-400">
        Built on network science from Burt, Granovetter, and Lin
      </footer>
    </div>
  )
}
