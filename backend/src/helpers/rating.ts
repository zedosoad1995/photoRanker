import { ELO_UPDATE_FACTOR } from "@/constants/rating";
import { SENSITIVITY } from "@shared/constants/rating";

export const calculateNewRating = (
  isWin: boolean,
  playerRating: number,
  opponentRating: number
) => {
  const outcome = Number(isWin);

  const expectedOutcome = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / SENSITIVITY));

  const newRating = playerRating + ELO_UPDATE_FACTOR * (outcome - expectedOutcome);

  return newRating;
};

export const randomWeightedClosestElo = (elos: number[], target: number, param1: number = 1) => {
  const diffs = elos.map((num) => Math.abs(num - target));

  const weights = diffs.map((diff) => 1 / (param1 + diff));

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const probabilities = weights.map((weight) => weight / totalWeight);

  const randomNum = Math.random();

  let cumulativeProbability = 0;
  for (let i = 0; i < elos.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomNum <= cumulativeProbability) {
      return i;
    }
  }

  return elos.length - 1;
};

const RATING_INI = 1500; // 1500 in the paper
const VOLATILITY_INI = 0.06;
const GLICKO_SCALE = 173.7178;
const TAU = 0.5; // 0.3 - 1.2
const RD_INI = 350; // Rating Deviation

interface IPlayer {
  rating: number;
  rd: number;
  vol: number;
}

const getNormalizedRating = (p: IPlayer) => {
  return (p.rating - RATING_INI) / GLICKO_SCALE;
};

const getNormalizedVolatility = (p: IPlayer) => {
  return p.rd / GLICKO_SCALE;
};

const getG = (vol: number) => {
  return 1 / Math.sqrt(1 + (3 * vol * vol) / (Math.PI * Math.PI));
};

const getWinProb = (mu: number, muj: number, volj: number, gj: number) => {
  return 1 / (1 + Math.exp(-gj * (mu - muj)));
};

const getV = (winProb: number, mu: number, muj: number, volj: number, gj: number) => {
  const lossProb = 1 - winProb;

  return 1 / (gj * gj * winProb * lossProb);
};

const getDelta = (isWin: boolean, winProb: number, gj: number, v: number) => {
  return v * gj * (Number(isWin) - winProb);
};

const getNewVolatility = (delta: number, vol: number, rd: number, v: number) => {
  const a = Math.log(vol * vol);
  const convergence = 1e-6;

  const f = (x: number) => {
    return (
      (Math.exp(x) * (delta * delta - rd * rd - v - Math.exp(x))) /
        (2 * Math.pow(rd * rd + v + Math.exp(x), 2)) -
      (x - a) / (TAU * TAU)
    );
  };

  let A = a;
  if (delta * delta > rd * rd - v) {
    var B = Math.log(delta * delta - rd * rd - v);
  } else {
    let k = 1;
    while (f(a - k * TAU) < 0) {
      k += 1;
    }

    var B = a - k * TAU;
  }

  let fA = f(A);
  let fB = f(B);

  while (Math.abs(B - A) > convergence) {
    const C = A + ((A - B) * fA) / (fB - fA);
    const fC = f(C);

    if (fC * fB <= 0) {
      A = B;
      fA = fB;
    } else {
      fA = fA / 2;
    }

    B = C;
    fB = fC;
  }

  return Math.exp(A / 2);
};

const getNewNormalizedRd = (rd: number, newVol: number, v: number) => {
  const preRd = Math.sqrt(rd * rd + newVol * newVol);

  return 1 / Math.sqrt(1 / (preRd * preRd) + 1 / v);
};

const getNewNormalizedRating = (
  mu: number,
  newNormRd: number,
  gj: number,
  isWin: boolean,
  winProb: number
) => {
  return mu + newNormRd * newNormRd * gj * (Number(isWin) - winProb);
};

export const updatePlayerGlicko2 = (p1: IPlayer, p2: IPlayer, isWin: boolean) => {
  const mu = getNormalizedRating(p1);
  const muj = getNormalizedRating(p2);
  const rd = getNormalizedVolatility(p1);
  const rdj = getNormalizedVolatility(p2);

  const gj = getG(rdj);
  const winProb = getWinProb(mu, muj, rdj, gj);
  const v = getV(winProb, mu, muj, rdj, gj);

  const delta = getDelta(isWin, winProb, gj, v);

  const newVol = getNewVolatility(delta, p1.vol, rd, v);
  const newNormRd = getNewNormalizedRd(rd, newVol, v);
  const newMu = getNewNormalizedRating(mu, newNormRd, gj, isWin, winProb);

  return {
    rating: GLICKO_SCALE * newMu + RATING_INI,
    rd: GLICKO_SCALE * newNormRd,
    vol: newVol,
  };
};

export const calculateGlick2WinProb = (p1: IPlayer, p2: IPlayer) => {
  const mu = getNormalizedRating(p1);
  const muj = getNormalizedRating(p2);
  const rdj = getNormalizedVolatility(p2);

  const gj = getG(rdj);
  return getWinProb(mu, muj, rdj, gj);
};
