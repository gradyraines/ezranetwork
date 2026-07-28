import type { Connection, MatrixEntry } from '../types/network'
import { RESOURCE_LABELS } from '../types/network'
import type { ElementDefinition } from 'cytoscape'

const ORG_COLORS: Record<string, string> = {
  same_team: '#10B981',
  same_org_different_team: '#F59E0B',
  different_org: '#0EA5E9',
}

const TIE_WEIGHTS: Record<string, number> = {
  strong: 3,
  moderate: 2,
  weak: 1,
}

export function buildElements(
  connections: Connection[],
  matrix: MatrixEntry[],
  studentName: string
): ElementDefinition[] {
  const elements: ElementDefinition[] = []
  const named = connections.filter((c) => c.name.trim())

  if (named.length === 0) return elements

  // Ego node
  elements.push({
    data: {
      id: 'ego',
      label: studentName || 'You',
      isEgo: true,
    },
  })

  // Alter nodes
  for (const conn of named) {
    elements.push({
      data: {
        id: conn.id,
        label: conn.name,
        orgContext: conn.orgContext,
        color: ORG_COLORS[conn.orgContext] || '#94a3b8',
        tieStrength: conn.tieStrength,
        relationshipType: conn.relationshipType,
        interactionFrequency: conn.interactionFrequency,
        resources: conn.resources.map((r) => RESOURCE_LABELS[r]).join(', '),
      },
    })
  }

  // Ego-to-alter edges
  for (const conn of named) {
    elements.push({
      data: {
        id: `ego-${conn.id}`,
        source: 'ego',
        target: conn.id,
        weight: TIE_WEIGHTS[conn.tieStrength] || 2,
        tieStrength: conn.tieStrength,
        isEgoEdge: true,
      },
    })
  }

  // Alter-to-alter edges from matrix (only use unique pairs)
  const seen = new Set<string>()
  const namedIds = new Set(named.map((c) => c.id))
  for (const entry of matrix) {
    if (entry.strength === 'none') continue
    if (!namedIds.has(entry.sourceId) || !namedIds.has(entry.targetId)) continue
    const pairKey = [entry.sourceId, entry.targetId].sort().join('-')
    if (seen.has(pairKey)) continue
    seen.add(pairKey)

    elements.push({
      data: {
        id: `alter-${pairKey}`,
        source: entry.sourceId,
        target: entry.targetId,
        weight: TIE_WEIGHTS[entry.strength] || 1,
        tieStrength: entry.strength,
        isEgoEdge: false,
      },
    })
  }

  return elements
}
