import { AppShell } from './components/layout/AppShell'
import { WelcomeStep } from './components/wizard/WelcomeStep'
import { ConnectionsStep } from './components/wizard/ConnectionsStep'
import { MatrixStep } from './components/wizard/MatrixStep'
import { InsightsDashboard } from './components/insights/InsightsDashboard'
import { useNetworkStore } from './store/useNetworkStore'

function App() {
  const currentStep = useNetworkStore((s) => s.currentStep)

  return (
    <AppShell>
      {currentStep === 0 && <WelcomeStep />}
      {currentStep === 1 && <ConnectionsStep />}
      {currentStep === 2 && <MatrixStep />}
      {currentStep === 3 && <InsightsDashboard />}
    </AppShell>
  )
}

export default App
