export type RelationshipType =
  | 'colleague'
  | 'mentor'
  | 'friend'
  | 'family'
  | 'acquaintance'

export type TieStrength = 'strong' | 'moderate' | 'weak'

export type OrgContext =
  | 'same_team'
  | 'same_org_different_team'
  | 'different_org'

export type InteractionFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely'

export type ResourceType =
  | 'advice'
  | 'emotional_support'
  | 'career_opportunities'
  | 'information'
  | 'task_help'

export interface Connection {
  id: string
  name: string
  relationshipType: RelationshipType
  tieStrength: TieStrength
  orgContext: OrgContext
  interactionFrequency: InteractionFrequency
  resources: ResourceType[]
}

export type MatrixTieStrength = 'none' | 'weak' | 'strong'

export interface MatrixEntry {
  sourceId: string
  targetId: string
  strength: MatrixTieStrength
}

export interface NetworkData {
  studentName: string
  connections: Connection[]
  matrix: MatrixEntry[]
}
