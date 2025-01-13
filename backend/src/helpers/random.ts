export const pickRandomKey = <T extends string>(weights: Record<T, number>, randNum?: number): T => {
  if(randNum !== undefined){
    if(randNum < 0 || randNum > 1){
      throw new Error("Random number must be between 0 and 1");
    }
  }

  let totalWeight = 0;
  for (const key in weights) {
    totalWeight += weights[key];
  }

  let random = (randNum === undefined ? Math.random() : randNum) * totalWeight;

  for (const key in weights) {
    random -= weights[key];
    if (random <= 0) {
      return key;
    }
  }

  throw new Error("No keys to choose from");
};
