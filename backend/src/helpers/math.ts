export const randomGaussian = (mean = 0, variance = 1) => {
  let u1 = 0,
    u2 = 0;

  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();

  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  return mean + Math.sqrt(variance) * z0;
};
