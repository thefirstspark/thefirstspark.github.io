export const TIERS = {
  free: {
    name: 'Seeker',
    price: 0,
    monthly_price: 0,
    description: 'Begin your First Spark journey',
    features: [
      'Access to free rituals',
      'Community posts',
      'Monthly newsletter'
    ]
  },
  premium: {
    name: 'Ignite',
    price: 3300, // $33 in cents
    monthly_price: 33,
    description: 'Deepen your spiritual practice',
    features: [
      'All Seeker features',
      'Premium rituals & guides',
      'Monthly group sessions',
      'Private community access',
      'Exclusive content library'
    ]
  },
  soul_map: {
    name: 'Soul Map',
    price: 11100, // $111 in cents
    monthly_price: 111,
    description: 'Your personalized spiritual blueprint',
    features: [
      'All Ignite features',
      'Custom soul map creation',
      'Astrological analysis',
      'Human Design chart',
      'Compatibility readings',
      'Personal session (1:1)',
      '90-day support access'
    ]
  },
  lifetime: {
    name: 'The First Spark',
    price: 100000, // $1000 in cents
    one_time: true,
    description: 'Complete mastery & lifetime access',
    features: [
      'Everything forever',
      'Lifetime soul map access',
      'Unlimited sessions',
      'Inner circle community',
      'Custom ritual creation',
      'Access to all future offerings',
      'Direct contact & mentorship'
    ]
  }
};

export const TIER_LEVELS = {
  free: 0,
  premium: 1,
  soul_map: 2,
  lifetime: 3
};

export function getTierFromLevel(level) {
  return Object.keys(TIER_LEVELS).find(tier => TIER_LEVELS[tier] === level);
}

export function canAccessContent(userTier, requiredTier) {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
}
