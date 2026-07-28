import type { Connection, ConnectionRatings, RelationshipType, TieStrength, OrgContext, InteractionFrequency, ResourceType, RelativeRank } from '../../types/network'
import { RESOURCE_LABELS } from '../../types/network'
import { useNetworkStore } from '../../store/useNetworkStore'

const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: 'colleague', label: 'Colleague' },
  { value: 'mentor', label: 'Mentor / Advisor' },
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'acquaintance', label: 'Acquaintance' },
]

const TIE_STRENGTH_OPTIONS: { value: TieStrength; label: string; desc: string }[] = [
  { value: 'strong', label: 'Strong', desc: 'Close, frequent contact' },
  { value: 'moderate', label: 'Moderate', desc: 'Regular but not close' },
  { value: 'weak', label: 'Weak', desc: 'Occasional or distant' },
]

const ORG_CONTEXT_OPTIONS: { value: OrgContext; label: string }[] = [
  { value: 'same_team', label: 'Same team' },
  { value: 'same_org_different_team', label: 'Same org, different team' },
  { value: 'different_org', label: 'Different organization' },
]

const FREQUENCY_OPTIONS: { value: InteractionFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'rarely', label: 'Rarely' },
]

const RESOURCE_OPTIONS = (
  Object.entries(RESOURCE_LABELS) as [ResourceType, string][]
).map(([value, label]) => ({ value, label }))

const RANK_OPTIONS: { value: RelativeRank; label: string }[] = [
  { value: 'higher', label: 'Higher rank' },
  { value: 'same', label: 'About the same' },
  { value: 'lower', label: 'Lower rank' },
]

// Wording carried over from the original questionnaire so trust and
// obligation scores stay comparable to historical cohorts.
const RATING_ITEMS: { key: keyof ConnectionRatings; label: string }[] = [
  { key: 'difficultyComfort', label: 'I feel comfortable sharing my personal problems and difficulties with this person.' },
  { key: 'hopesComfort', label: 'I feel comfortable sharing my hopes and dreams with this person.' },
  { key: 'completeTaskTrust', label: 'I trust this person to complete a task they agreed to do for me.' },
  { key: 'hourFavorObligation', label: 'I would feel obliged if this person asked a favor requiring 1 hour of my time in a busy week.' },
  { key: 'dayFavorObligation', label: 'I would feel obliged if this person asked a favor requiring 1 day of my time in a busy week.' },
]

interface ConnectionCardProps {
  connection: Connection
  index: number
}

export function ConnectionCard({ connection, index }: ConnectionCardProps) {
  const updateConnection = useNetworkStore((s) => s.updateConnection)
  const removeConnection = useNetworkStore((s) => s.removeConnection)

  const update = (updates: Partial<Connection>) =>
    updateConnection(connection.id, updates)

  const toggleResource = (resource: ResourceType) => {
    const current = connection.resources
    const next = current.includes(resource)
      ? current.filter((r) => r !== resource)
      : [...current, resource]
    update({ resources: next })
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Connection {index + 1}
        </span>
        <button
          onClick={() => removeConnection(connection.id)}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Name */}
      <input
        type="text"
        value={connection.name}
        onChange={(e) => update({ name: e.target.value })}
        placeholder="Person's name"
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Relationship Type */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Relationship
          </label>
          <select
            value={connection.relationshipType}
            onChange={(e) =>
              update({ relationshipType: e.target.value as RelationshipType })
            }
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {RELATIONSHIP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Org Context */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Organization
          </label>
          <select
            value={connection.orgContext}
            onChange={(e) =>
              update({ orgContext: e.target.value as OrgContext })
            }
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {ORG_CONTEXT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Relative Rank */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Their rank compared to yours
          </label>
          <select
            value={connection.rank}
            onChange={(e) => update({ rank: e.target.value as RelativeRank })}
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {RANK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tie Strength */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Tie strength
        </label>
        <div className="flex gap-2">
          {TIE_STRENGTH_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => update({ tieStrength: o.value })}
              title={o.desc}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                connection.tieStrength === o.value
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interaction Frequency */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          How often do you interact?
        </label>
        <div className="flex gap-2">
          {FREQUENCY_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => update({ interactionFrequency: o.value })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                connection.interactionFrequency === o.value
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          What do they provide? (select all)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RESOURCE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => toggleResource(o.value)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                connection.resources.includes(o.value)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trust & obligation ratings */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-medium text-slate-500 mb-2">
          Rate your agreement (1 = strongly disagree, 5 = strongly agree)
        </label>
        <div className="space-y-2">
          {RATING_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 leading-snug">
                {item.label}
              </span>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`${v} out of 5`}
                    aria-pressed={connection.ratings[item.key] === v}
                    onClick={() =>
                      update({
                        ratings: { ...connection.ratings, [item.key]: v },
                      })
                    }
                    className={`w-6 h-6 text-xs font-medium rounded-full border transition-colors ${
                      connection.ratings[item.key] === v
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
