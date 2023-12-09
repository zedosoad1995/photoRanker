export const pickRandomKey = <T>(weights: { [key: string]: number }): string => {
  let totalWeight = 0;
  for (const key in weights) {
    totalWeight += weights[key];
  }

  let random = Math.random() * totalWeight;

  for (const key in weights) {
    random -= weights[key];
    if (random <= 0) {
      return key;
    }
  }

  throw new Error("No keys to choose from");
};
