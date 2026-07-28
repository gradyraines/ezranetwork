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

// Resource categories mirror the original Ezra's Network questionnaire so
// proportions are comparable to the historical cohort benchmarks.
export type ResourceType =
  | 'economic'
  | 'career_info'
  | 'task_help'
  | 'social'

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  economic: 'Economic / financial',
  career_info: 'Entrepreneurial info',
  task_help: 'Help executing tasks',
  social: 'Friendship & support',
}

export type RelativeRank = 'higher' | 'same' | 'lower'

// 1–5 agreement ratings replicating the original questionnaire items.
export interface ConnectionRatings {
  difficultyComfort: number // "I feel comfortable sharing my personal problems and difficulties with this person."
  hopesComfort: number // "...sharing my hopes and dreams with this person."
  completeTaskTrust: number // "I trust this person to complete a task they agreed to do for me."
  hourFavorObligation: number // "I feel obliged if this person asks a favor requiring 1 hour of my time in a busy week."
  dayFavorObligation: number // "...requiring 1 day of my time in a busy week."
}

export interface Connection {
  id: string
  name: string
  relationshipType: RelationshipType
  tieStrength: TieStrength
  orgContext: OrgContext
  interactionFrequency: InteractionFrequency
  resources: ResourceType[]
  rank: RelativeRank
  ratings: ConnectionRatings
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
