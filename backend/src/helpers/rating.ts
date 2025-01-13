export const randomWeightedClosestElo = (ratings: number[], target: number, param1: number = 1) => {
  const diffs = ratings.map((num) => Math.abs(num - target));

  const weights = diffs.map((diff) => 1 / (param1 + diff) ** 0.86);

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const probabilities = weights.map((weight) => weight / totalWeight);

  const randomNum = Math.random();

  let cumulativeProbability = 0;
  for (let i = 0; i < ratings.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomNum <= cumulativeProbability) {
      return i;
    }
  }

  return ratings.length - 1;
};
