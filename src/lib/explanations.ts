interface Explanation {
  theoryConnection: string
  explanation: string
}

export function getExplanation(
  metric: string,
  value: number,
  networkSize?: number
): Explanation {
  switch (metric) {
    case 'networkSize':
      return {
        theoryConnection: 'Network composition',
        explanation:
          value < 10
            ? `A count of the people you listed. Every other metric is computed from these contacts and the ties you drew among them. You named ${value}. The structure metrics get more reliable once you pass ten or so, because each one works on pairs of contacts.`
            : value < 20
              ? `A count of the people you listed. Every other metric is computed from these contacts and the ties you drew among them. You named ${value}, which is typical for this exercise.`
              : `A count of the people you listed. Every other metric is computed from these contacts and the ties you drew among them. You named ${value}, more than most people manage. Past this point the structure of the network matters more than the raw count.`,
      }

    case 'density':
      return {
        theoryConnection: 'Network closure vs. structural holes (Burt, 1992)',
        explanation:
          value < 0.3
            ? `Density is the share of pairs among your contacts who know each other. The tool counts every possible pair, checks whether you marked a tie between them, and divides. At ${(value * 100).toFixed(0)}%, most pairs in your network are strangers to each other. Burt calls these gaps structural holes, and they are where brokerage happens.`
            : value < 0.6
              ? `Density is the share of pairs among your contacts who know each other. The tool counts every possible pair, checks whether you marked a tie between them, and divides. At ${(value * 100).toFixed(0)}%, parts of your network cluster together while gaps remain between the clusters.`
              : `Density is the share of pairs among your contacts who know each other. The tool counts every possible pair, checks whether you marked a tie between them, and divides. At ${(value * 100).toFixed(0)}%, most of your contacts know each other. Closed networks are good at trust and mutual help. They also tend to pass the same information around.`,
      }

    case 'constraint':
      return {
        theoryConnection: "Burt's structural holes theory (1992)",
        explanation:
          value < 0.3
            ? `Constraint measures how much your contacts overlap. For each person, it asks how much of your network leads back to that same group, then adds it up. Yours is ${value.toFixed(2)}, which is low. You sit between groups that mostly ignore each other, and Burt found that this position pays: people with low constraint tend to get better ideas and earlier promotions.`
            : value < 0.5
              ? `Constraint measures how much your contacts overlap. For each person, it asks how much of your network leads back to that same group, then adds it up. Yours is ${value.toFixed(2)}, in the middle range. Some of your contacts know each other, and you still bridge a few separate groups.`
              : `Constraint measures how much your contacts overlap. For each person, it asks how much of your network leads back to that same group, then adds it up. Yours is ${value.toFixed(2)}, which is high. Most paths through your network loop back to the same people, so there is little left for you to broker.`,
      }

    case 'effectiveSize': {
      const ratio = networkSize && networkSize > 0 ? value / networkSize : 0
      return {
        theoryConnection: "Burt's effective network size (1992)",
        explanation:
          ratio > 0.8
            ? `Effective size discounts your network for redundancy. A contact counts for less when they know the same people you already reach. Five contacts who all know each other amount to roughly one effective contact. Yours is ${value.toFixed(1)} out of ${networkSize}, so almost every contact opens a different door.`
            : ratio > 0.5
              ? `Effective size discounts your network for redundancy. A contact counts for less when they know the same people you already reach. Five contacts who all know each other amount to roughly one effective contact. Yours is ${value.toFixed(1)} out of ${networkSize}. Around half your network is unique reach, and the rest overlaps.`
              : `Effective size discounts your network for redundancy. A contact counts for less when they know the same people you already reach. Five contacts who all know each other amount to roughly one effective contact. Yours is ${value.toFixed(1)} out of ${networkSize}. Much of your network reaches the same people, which is reliable but narrow.`,
      }
    }

    case 'brokerageScore':
      return {
        theoryConnection:
          'Brokerage and structural holes (Burt, 1992; Granovetter, 1973)',
        explanation:
          value > 0.7
            ? `The share of pairs among your contacts with no tie between them. Every disconnected pair is a bridge that runs through you, because you are the one person both sides know. At ${(value * 100).toFixed(0)}%, you connect people who would otherwise never meet. Information crosses from one side of your network to the other only if you carry it.`
            : value > 0.4
              ? `The share of pairs among your contacts with no tie between them. Every disconnected pair is a bridge that runs through you, because you are the one person both sides know. At ${(value * 100).toFixed(0)}%, you bridge some groups while others are already connected without you.`
              : `The share of pairs among your contacts with no tie between them. Every disconnected pair is a bridge that runs through you, because you are the one person both sides know. At ${(value * 100).toFixed(0)}%, your contacts mostly know each other already, so there is little between them for you to broker.`,
      }

    case 'tieStrengthDistribution':
      return {
        theoryConnection: 'Strength of weak ties (Granovetter, 1973)',
        explanation:
          value > 0.4
            ? `Your mix of strong, moderate, and weak ties. The number to watch is the weak share. Granovetter's point was that acquaintances move in circles you don't, so news tends to reach you through them. Weak ties are ${(value * 100).toFixed(0)}% of your network, which is a lot of reach into other circles. Jobs and opportunities travel exactly this way.`
            : value > 0.15
              ? `Your mix of strong, moderate, and weak ties. The number to watch is the weak share. Granovetter's point was that acquaintances move in circles you don't, so news tends to reach you through them. Weak ties are ${(value * 100).toFixed(0)}% of your network, alongside a core of closer relationships. The strong ties carry support, and the weak ones carry news.`
              : `Your mix of strong, moderate, and weak ties. The number to watch is the weak share. Granovetter's point was that acquaintances move in circles you don't, so news tends to reach you through them. Weak ties are only ${(value * 100).toFixed(0)}% of your network. A close-knit network is comfortable, and it mostly tells you things you already know.`,
      }

    default:
      return {
        theoryConnection: '',
        explanation: '',
      }
  }
}
