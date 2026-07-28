import type { Connection, MatrixEntry } from '../types/network'

// Port of the original Ezra's Network aggregate.py so scores are computed
// identically to the historical cohorts students compare against.
//
// Field mapping between the two apps:
//   veryCloseTies  <- old "Very Strong" closeness -> new 'strong'
//   closeTies      <- old "Strong" closeness      -> new 'moderate'
//   yourUnit       <- old "In my department"      -> new 'same_team'
//   notInOrg       <- old "In another organization" -> new 'different_org'
//   emotionalTrust <- mean(difficultyComfort) and mean(hopesComfort), averaged
//   obligation     <- mean(hourFavorObligation) and mean(dayFavorObligation), averaged

export interface ClassicMetrics {
  numTies: number
  netDensity: number
  higherRank: number
  sameRank: number
  lowerRank: number
  notInOrg: number
  yourUnit: number
  veryCloseTies: number
  closeTies: number
  econResources: number
  careerResources: number
  getThingsDoneResources: number
  socialResources: number
  emotionalTrust: number
  getThingsDoneTrust: number
  obligation: number
}

function proportion(conns: Connection[], pred: (c: Connection) => boolean): number {
  if (conns.length === 0) return 0
  return conns.filter(pred).length / conns.length
}

function average(conns: Connection[], get: (c: Connection) => number | undefined): number {
  const vals = conns
    .map(get)
    .filter((v): v is number => v !== undefined && v !== null)
  if (vals.length === 0) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function computeClassicMetrics(
  connections: Connection[],
  matrix: MatrixEntry[]
): ClassicMetrics {
  const named = connections.filter((c) => c.name.trim())
  const n = named.length
  const namedIds = new Set(named.map((c) => c.id))

  // Network density exactly as the original: connected alter pairs / all alter pairs
  // (any strength counts as connected).
  const seen = new Set<string>()
  let connectedPairs = 0
  for (const entry of matrix) {
    if (entry.strength === 'none') continue
    if (!namedIds.has(entry.sourceId) || !namedIds.has(entry.targetId)) continue
    const key = [entry.sourceId, entry.targetId].sort().join('-')
    if (seen.has(key)) continue
    seen.add(key)
    connectedPairs++
  }
  const possiblePairs = n > 1 ? (n * (n - 1)) / 2 : 0
  const netDensity = possiblePairs > 0 ? connectedPairs / possiblePairs : 0

  return {
    numTies: n,
    netDensity,
    higherRank: proportion(named, (c) => c.rank === 'higher'),
    sameRank: proportion(named, (c) => c.rank === 'same'),
    lowerRank: proportion(named, (c) => c.rank === 'lower'),
    notInOrg: proportion(named, (c) => c.orgContext === 'different_org'),
    yourUnit: proportion(named, (c) => c.orgContext === 'same_team'),
    veryCloseTies: proportion(named, (c) => c.tieStrength === 'strong'),
    closeTies: proportion(named, (c) => c.tieStrength === 'moderate'),
    econResources: proportion(named, (c) => c.resources.includes('economic')),
    careerResources: proportion(named, (c) => c.resources.includes('career_info')),
    getThingsDoneResources: proportion(named, (c) => c.resources.includes('task_help')),
    socialResources: proportion(named, (c) => c.resources.includes('social')),
    emotionalTrust:
      (average(named, (c) => c.ratings?.difficultyComfort) +
        average(named, (c) => c.ratings?.hopesComfort)) /
      2,
    getThingsDoneTrust: average(named, (c) => c.ratings?.completeTaskTrust),
    obligation:
      (average(named, (c) => c.ratings?.hourFavorObligation) +
        average(named, (c) => c.ratings?.dayFavorObligation)) /
      2,
  }
}
