import { SENSITIVITY } from "@shared/constants/rating";
import { calculateGlick2WinProb, updatePlayerGlicko2 } from "@/helpers/rating";
import { randomGaussian } from "@/helpers/math";

interface IPlayerGlicko {
  rating: number;
  rd: number;
  vol: number;
}

interface IPlayer {
  id: number;
  realElo: IPlayerGlicko;
  estimatedElo: IPlayerGlicko;
  votes: number;
}

type IStrategy = "RANDOM" | "CLOSEST";

const NUM_REPS = 1;
const STRATEGY: IStrategy = "CLOSEST";
const hasVotingStrategy = true;
const PARAM1 = 1;
const PARAM2 = 1;
const NUM_PLAYERS = 100;
const MATCHES_PER_PLAYER = 1000;
const NUM_MATCHES = (NUM_PLAYERS / 2) * MATCHES_PER_PLAYER;

const RATING_INI = 1500; // 1500 in the paper
const VOLATILITY_INI = 0.0001;
const GLICKO_SCALE = 173.7178;
const TAU = 0.5; // 0.3 - 1.2
const RD_INI = 350; // Rating Deviation

const RANDOM_VOTING_PROB = 0.0;
const RATING_MISALIGNMENT_95 = 0;
const VAR = (RATING_MISALIGNMENT_95 / 2) ** 2;

const GLICKO_INI = {
  rating: RATING_INI,
  rd: RD_INI,
  vol: VOLATILITY_INI,
};

function generateRandomPlayers(min: number, max: number, n: number): IPlayerGlicko[] {
  let randomPlayers = [];
  for (let i = 0; i < n; i++) {
    let randomPlayer: IPlayerGlicko = {
      rating: Math.random() * (max - min + 1) + min,
      rd: RD_INI,
      vol: VOLATILITY_INI,
    };
    randomPlayers.push(randomPlayer);
  }
  return randomPlayers;
}

/* const ELOS = [
  0, 25, 50, 75, 100, 110, 125, 140, 150, 160, 175, 185, 200, 215, 225, 230, 250, 259, 275, 290,
  300, 320, 325, 335, 350, 360, 375, 400, 425, 450, 466, 475, 490, 500, 517, 525, 533, 550, 566,
  575, 590, 600, 619, 625, 632, 650, 669, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900, 925,
  950, 975, 1000, 1025, 1050, 1075, 1100, 1125, 1150, 1175, 1200, 1225, 1250, 1275, 1300, 1325,
  1350, 1375, 1400, 1425, 1450, 1475, 1500, 1525, 1550, 1575, 1600, 1625, 1650, 1675, 1700, 1725,
  1800, 1805, 1850, 1875, 1880, 1902, 1930, 1951, 1960, 2000,
];
 */

const errors: number[] = [];
const positionDists: number[] = [];

Array(NUM_REPS)
  .fill(0)
  .forEach(() => {
    const ELOS = generateRandomPlayers(0, 2500, NUM_PLAYERS);

    const players = ELOS.map((elo, index) => ({
      id: index,
      realElo: elo,
      estimatedElo: GLICKO_INI,
      votes: 0,
    }));

    Array(NUM_MATCHES)
      .fill(0)
      .forEach(() => {
        const [player1, player2] = getMatch(players);
        const [winner, loser] = getWinner(player1, player2);

        const winnerIndex = players.findIndex((player) => player.id === winner.id);
        const loserIndex = players.findIndex((player) => player.id === loser.id);

        players[winnerIndex].estimatedElo = updatePlayerGlicko2(
          winner.estimatedElo,
          loser.estimatedElo,
          true
        );
        players[winnerIndex].votes += 1;
        players[loserIndex].estimatedElo = updatePlayerGlicko2(
          loser.estimatedElo,
          winner.estimatedElo,
          false
        );
        players[loserIndex].votes += 1;
      });

    const elosAvg = ELOS.reduce((acc, elo) => acc + elo.rating, 0) / ELOS.length;

    errors.push(
      players.reduce(
        (acc, el) =>
          acc +
          Math.abs(Math.round(el.estimatedElo.rating - RATING_INI + elosAvg) - el.realElo.rating),
        0
      )
    );

    positionDists.push(calculatePositionDiff(players));

    const confInterval = findConfidenceInterval(players);

    console.log(
      confInterval,
      confInterval.reduce((acc, el) => acc + Number(!(el[1] >= el[0] && el[1] <= el[2])), 0)
    );

    /* console.log(
      players,
      players.reduce((acc, curr) => acc + curr.estimatedElo.rating, 0),
      players.reduce((acc, curr) => acc + curr.realElo.rating, 0)
    ); */
  });

console.log(
  errors.reduce((acc, el) => acc + el, 0) / errors.length,
  PARAM1,
  positionDists.reduce((acc, el) => acc + el, 0) / positionDists.length,
  positionDists.reduce((acc, el) => acc + el, 0) / positionDists.length / NUM_PLAYERS,
  (positionDists.reduce((acc, el) => acc + el, 0) /
    positionDists.length /
    NUM_PLAYERS /
    NUM_PLAYERS) *
    100,
  NUM_PLAYERS,
  (NUM_MATCHES / NUM_PLAYERS) * 2
);

function getMatch(players: IPlayer[]) {
  let player1: IPlayer;

  if (hasVotingStrategy) {
    player1 = playerWithFewestVotes(players);
  } else {
    player1 = randomPlayer(players);
  }

  const remainingPlayers = players.filter(({ id }) => id !== player1.id);

  let player2: IPlayer;
  if (STRATEGY === "RANDOM") {
    player2 = randomPlayer(remainingPlayers);
  } else {
    player2 =
      remainingPlayers[
        randomWeightedElement(
          remainingPlayers.map((p) => p.estimatedElo.rating),
          player1.estimatedElo.rating
        )
      ];

    //player2 = closestPlayer(remainingPlayers, player1.estimatedElo);
  }

  return [player1, player2];
}

function randomPlayer(players: IPlayer[]) {
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex];
}

/* function closestPlayer(players: IPlayer[], targetElo: number) {
  let bestMatch = players[0];
  let bestDiff = Math.abs(players[0].estimatedElo - targetElo);

  for (const player of players.slice(1)) {
    const diff = Math.abs(player.estimatedElo - targetElo);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestMatch = player;
    }
  }

  return bestMatch;
} */

function playerWithFewestVotes(players: IPlayer[]) {
  const fewestVotes = Math.min(...players.map((p) => p.votes));
  return players.find((p) => p.votes === fewestVotes)!;
}

function randomWeightedElement(array: number[], target: number) {
  const diffs = array.map((num) => Math.abs(num - target));

  const weights = diffs.map((diff) => 1 / (PARAM1 + Math.pow(diff, PARAM2)));

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const probabilities = weights.map((weight) => weight / totalWeight);

  const randomNum = Math.random();

  let cumulativeProbability = 0;
  for (let i = 0; i < array.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomNum <= cumulativeProbability) {
      return i;
    }
  }

  return array.length - 1;
}

function getWinner(player1: IPlayer, player2: IPlayer) {
  const winProb = calculateWinProb(
    randomGaussian(player1.realElo.rating, VAR),
    randomGaussian(player2.realElo.rating, VAR)
  );

  if (Math.random() < RANDOM_VOTING_PROB) {
    var winner = Math.random() > 0.5 ? player2 : player1;
  } else {
    var winner = Math.random() > winProb ? player2 : player1;
  }
  const loser = player1.id === winner.id ? player2 : player1;

  return [winner, loser];
}

function calculateWinProb(player1: number, player2: number) {
  return 1 / (1 + Math.pow(10, (player2 - player1) / SENSITIVITY));
}

function calculatePositionDiff(players: IPlayer[]) {
  const orderedByEstimations = [
    ...players.sort((a, b) => a.estimatedElo.rating - b.estimatedElo.rating),
  ];
  const orderedByReal = [...players.sort((a, b) => a.realElo.rating - b.realElo.rating)];

  return orderedByEstimations.reduce(
    (acc, el, index) => acc + Math.abs(index - orderedByReal.findIndex((r) => r.id === el.id)),
    0
  );
}

function findConfidenceInterval(players: IPlayer[]) {
  const orderedByEstimations = [
    ...players.sort((a, b) => a.estimatedElo.rating - b.estimatedElo.rating),
  ];

  const orderedByReal = [...players.sort((a, b) => a.realElo.rating - b.realElo.rating)];

  const calculateScore = (score: number) => {
    const index = orderedByEstimations.findIndex((p) => score < p.estimatedElo.rating);

    if (index === -1) return 10;

    return Number(((index * 10) / orderedByEstimations.length).toFixed(1));
  };

  const calculateRealScore = (score: number) => {
    const index = orderedByReal.findIndex((p) => score < p.realElo.rating);

    if (index === -1) return 10;

    return Number(((index * 10) / orderedByEstimations.length).toFixed(1));
  };

  const ret = [];
  for (const player of players) {
    const rating = player.estimatedElo;

    ret.push([
      calculateScore(rating.rating - rating.rd * 1.2),
      //calculateScore(rating.rating),
      calculateRealScore(player.realElo.rating),
      calculateScore(rating.rating + rating.rd * 1.2),
      calculateScore(rating.rating),
    ]);
  }

  return ret;
}
