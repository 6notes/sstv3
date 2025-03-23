export function computeBilling(storage: number) {
  const ratesByThreshold = {
    tier1: { rate: 4, threshold: 10 },
    tier2: { rate: 2, threshold: 100 },
    tier3: { rate: 1, threshold: Infinity },
  } as const;
  let resultingRate: number = ratesByThreshold.tier1.rate;
  if (storage > ratesByThreshold.tier1.threshold) {
    resultingRate = ratesByThreshold.tier2.rate;
  } else if (storage > ratesByThreshold.tier2.threshold) {
    resultingRate = ratesByThreshold.tier3.rate;
  }
  const centsInADollar = 100;
  const priceInCents = resultingRate * storage * centsInADollar;
  return priceInCents;
}
