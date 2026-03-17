import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type {
  Connection,
  MatrixEntry,
  MatrixTieStrength,
  RelationshipType,
  TieStrength,
  OrgContext,
  InteractionFrequency,
  ResourceType,
} from '../types/network'

interface NetworkStore {
  // Navigation
  currentStep: number
  setStep: (step: number) => void

  // Student info
  studentName: string
  setStudentName: (name: string) => void

  // Connections
  connections: Connection[]
  addConnection: () => void
  updateConnection: (id: string, updates: Partial<Connection>) => void
  removeConnection: (id: string) => void

  // Matrix
  matrix: MatrixEntry[]
  setMatrixEntry: (sourceId: string, targetId: string, strength: MatrixTieStrength) => void
  getMatrixEntry: (sourceId: string, targetId: string) => MatrixTieStrength

  // Persistence
  resetAll: () => void
  exportData: () => string
  importData: (json: string) => boolean
}

function createEmptyConnection(): Connection {
  return {
    id: uuidv4(),
    name: '',
    relationshipType: 'colleague' as RelationshipType,
    tieStrength: 'moderate' as TieStrength,
    orgContext: 'same_team' as OrgContext,
    interactionFrequency: 'monthly' as InteractionFrequency,
    resources: [] as ResourceType[],
  }
}

export const useNetworkStore = create<NetworkStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      setStep: (step) => set({ currentStep: step }),

      studentName: '',
      setStudentName: (name) => set({ studentName: name }),

      connections: [],
      addConnection: () =>
        set((state) => ({
          connections: [...state.connections, createEmptyConnection()],
        })),
      updateConnection: (id, updates) =>
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeConnection: (id) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== id),
          // Also remove matrix entries referencing this connection
          matrix: state.matrix.filter(
            (m) => m.sourceId !== id && m.targetId !== id
          ),
        })),

      matrix: [],
      setMatrixEntry: (sourceId, targetId, strength) =>
        set((state) => {
          // Enforce symmetry: always store both directions
          const filtered = state.matrix.filter(
            (m) =>
              !(
                (m.sourceId === sourceId && m.targetId === targetId) ||
                (m.sourceId === targetId && m.targetId === sourceId)
              )
          )
          if (strength === 'none') {
            return { matrix: filtered }
          }
          return {
            matrix: [
              ...filtered,
              { sourceId, targetId, strength },
              { sourceId: targetId, targetId: sourceId, strength },
            ],
          }
        }),
      getMatrixEntry: (sourceId, targetId) => {
        const entry = get().matrix.find(
          (m) => m.sourceId === sourceId && m.targetId === targetId
        )
        return entry?.strength ?? 'none'
      },

      resetAll: () =>
        set({
          currentStep: 0,
          studentName: '',
          connections: [],
          matrix: [],
        }),
      exportData: () => {
        const { studentName, connections, matrix } = get()
        return JSON.stringify({ studentName, connections, matrix }, null, 2)
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json)
          if (data.connections && Array.isArray(data.connections)) {
            set({
              studentName: data.studentName || '',
              connections: data.connections,
              matrix: data.matrix || [],
              currentStep: 1,
            })
            return true
          }
          return false
        } catch {
          return false
        }
      },
    }),
    {
      name: 'network-tool-data',
    }
  )
)
