interface Explanation {
  theoryConnection: string
  explanation: string
  insight: string
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
            ? `You listed ${value} connections. Consider whether there are additional professional contacts you interact with regularly.`
            : value < 20
              ? `You have ${value} connections — a solid professional network that gives you access to diverse resources.`
              : `With ${value} connections, you have a large network. The question is how well-structured it is — size alone doesn't guarantee advantage.`,
        insight:
          value < 10
            ? 'Try to think of people across different parts of your professional life — different teams, organizations, or social contexts.'
            : 'Network size matters, but structure matters more. The metrics below reveal whether your connections give you real advantage.',
      }

    case 'density':
      return {
        theoryConnection: 'Network closure vs. structural holes (Burt, 1992)',
        explanation:
          value < 0.3
            ? `Your network density is low (${(value * 100).toFixed(0)}%). Most of your contacts don't know each other. This is a "sparse" network with many structural holes.`
            : value < 0.6
              ? `Your network has moderate density (${(value * 100).toFixed(0)}%). Some of your contacts know each other, but there are gaps between groups.`
              : `Your network is quite dense (${(value * 100).toFixed(0)}%). Most of your contacts know each other, creating a "closed" network.`,
        insight:
          value < 0.3
            ? 'A sparse network is great for accessing diverse information and brokering between groups. You likely hear about things before others do.'
            : value < 0.6
              ? 'A moderate density is often ideal — you have some closed groups that provide trust and support, plus gaps that give you brokerage opportunities.'
              : 'Dense networks provide trust and cooperation, but your contacts likely share the same information. Consider building connections to people outside your current circle.',
      }

    case 'constraint':
      return {
        theoryConnection: "Burt's structural holes theory (1992)",
        explanation:
          value < 0.3
            ? `Your constraint score is low (${value.toFixed(2)}). Your contacts are not heavily connected to each other, giving you freedom to broker between groups.`
            : value < 0.5
              ? `Your constraint is moderate (${value.toFixed(2)}). Some of your contacts know each other, but you still have room to bridge different groups.`
              : `Your constraint is high (${value.toFixed(2)}). Your contacts are densely connected to each other, which limits your brokerage opportunities.`,
        insight:
          value < 0.3
            ? 'Low constraint means you sit between groups that don\'t interact — a structurally advantageous position. Research shows this is associated with better ideas, faster promotions, and higher pay.'
            : value < 0.5
              ? 'You have some structural holes to exploit. Look for the groups in your network that aren\'t connected — these are your brokerage opportunities.'
              : 'High constraint means your network is redundant — everyone knows everyone. To gain a structural advantage, build connections to people in entirely different circles.',
      }

    case 'effectiveSize': {
      const ratio =
        networkSize && networkSize > 0 ? value / networkSize : 0
      return {
        theoryConnection: "Burt's effective network size (1992)",
        explanation:
          ratio > 0.8
            ? `Your effective network size is ${value.toFixed(1)} out of ${networkSize} contacts — most of your connections are non-redundant.`
            : ratio > 0.5
              ? `Your effective size is ${value.toFixed(1)} out of ${networkSize}. About half your network provides unique, non-overlapping access to information.`
              : `Your effective size is ${value.toFixed(1)} out of ${networkSize}. Many of your contacts are connected to each other, making parts of your network redundant.`,
        insight:
          ratio > 0.8
            ? 'Each of your connections provides access to different people and information. This is an efficient, well-structured network.'
            : ratio > 0.5
              ? 'Some of your connections are redundant — they give you access to the same people and information. That\'s not necessarily bad (it provides reliability), but it limits your reach.'
              : 'Much of your network is redundant. To increase your effective size, build relationships with people who aren\'t already connected to your existing contacts.',
      }
    }

    case 'brokerageScore':
      return {
        theoryConnection:
          'Brokerage and structural holes (Burt, 1992; Granovetter, 1973)',
        explanation:
          value > 0.7
            ? `Your brokerage score is high (${(value * 100).toFixed(0)}%). Most pairs of your contacts don't know each other, putting you in a strong brokerage position.`
            : value > 0.4
              ? `Your brokerage score is moderate (${(value * 100).toFixed(0)}%). You bridge some disconnected groups but others are well-connected.`
              : `Your brokerage score is low (${(value * 100).toFixed(0)}%). Most of your contacts already know each other, leaving few brokerage opportunities.`,
        insight:
          value > 0.7
            ? 'You\'re a broker — you connect people who don\'t otherwise interact. This gives you control over information flow and the ability to combine ideas from different worlds.'
            : value > 0.4
              ? 'You have brokerage potential. Identify the specific groups in your network that aren\'t connected — those are the structural holes where you add the most value.'
              : 'Your network has few structural holes. Consider meeting people from industries, organizations, or social circles different from your current contacts.',
      }

    case 'tieStrengthDistribution':
      return {
        theoryConnection: 'Strength of weak ties (Granovetter, 1973)',
        explanation:
          value > 0.4
            ? `${(value * 100).toFixed(0)}% of your ties are weak. Granovetter showed that weak ties — casual acquaintances — are often more valuable than strong ties for discovering new opportunities.`
            : value > 0.15
              ? `${(value * 100).toFixed(0)}% of your ties are weak. You have a mix of close relationships and more distant connections.`
              : `Only ${(value * 100).toFixed(0)}% of your ties are weak. Most of your network consists of strong or moderate relationships.`,
        insight:
          value > 0.4
            ? 'Your high proportion of weak ties is a strength for information access. Weak ties bridge social worlds and expose you to non-redundant information — they\'re how most people find jobs and discover opportunities.'
            : value > 0.15
              ? 'A healthy mix. Strong ties provide trust and deep support, while weak ties provide novel information. Consider whether your weak ties span different industries or organizations.'
              : 'A network dominated by strong ties is comfortable but may limit your exposure to new ideas. The people you interact with rarely — former colleagues, conference contacts, distant alumni — often provide the most novel and valuable information.',
      }

    default:
      return {
        theoryConnection: '',
        explanation: '',
        insight: '',
      }
  }
}
