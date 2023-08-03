import { SENSITIVITY } from "@/constants/rating";
import { calculateNewRating } from "@/helpers/rating";

interface IPlayer {
  id: number;
  realElo: number;
  estimatedElo: number;
  votes: number;
}

type IStrategy = "RANDOM" | "CLOSEST";

const NUM_MATCHES = 50 * 10;
const NUM_REPS = 10000;
const STRATEGY: IStrategy = "CLOSEST";
const hasVotingStrategy = true;
const PARAM1 = 1e-3;

function generateRandomNumbers(min: number, max: number, n: number) {
  let randomNumbers = [];
  for (let i = 0; i < n; i++) {
    let randomNumber = Math.random() * (max - min + 1) + min;
    randomNumbers.push(randomNumber);
  }
  return randomNumbers;
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

const ELOS = generateRandomNumbers(0, 2500, 100);

const errors: number[] = [];
const positionDists: number[] = [];

Array(NUM_REPS)
  .fill(0)
  .forEach(() => {
    const players = ELOS.map((elo, index) => ({
      id: index,
      realElo: elo,
      estimatedElo: 1000,
      votes: 0,
    }));

    Array(NUM_MATCHES)
      .fill(0)
      .forEach(() => {
        const [player1, player2] = getMatch(players);
        const [winner, loser] = getWinner(player1, player2);

        const winnerIndex = players.findIndex((player) => player.id === winner.id);
        const loserIndex = players.findIndex((player) => player.id === loser.id);

        const winnerElo = winner.estimatedElo;
        const loserElo = loser.estimatedElo;

        players[winnerIndex].estimatedElo = calculateNewRating(true, winnerElo, loserElo);
        players[winnerIndex].votes += 1;
        players[loserIndex].estimatedElo = calculateNewRating(false, loserElo, winnerElo);
        players[loserIndex].votes += 1;
      });

    const elosAvg = ELOS.reduce((acc, elo) => acc + elo, 0) / ELOS.length;

    errors.push(
      players.reduce(
        (acc, el) => acc + Math.abs(Math.round(el.estimatedElo - 1000 + elosAvg) - el.realElo),
        0
      )
    );

    positionDists.push(calculatePositionDiff(players));
  });

console.log(
  errors.reduce((acc, el) => acc + el, 0) / errors.length,
  PARAM1,
  positionDists.reduce((acc, el) => acc + el, 0) / positionDists.length,
  positionDists.reduce((acc, el) => acc + el, 0) / positionDists.length / ELOS.length,
  (positionDists.reduce((acc, el) => acc + el, 0) /
    positionDists.length /
    ELOS.length /
    ELOS.length) *
    100,
  ELOS.length,
  (NUM_MATCHES / ELOS.length) * 2
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
          remainingPlayers.map((p) => p.estimatedElo),
          player1.estimatedElo
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

function closestPlayer(players: IPlayer[], targetElo: number) {
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
}

function playerWithFewestVotes(players: IPlayer[]) {
  const fewestVotes = Math.min(...players.map((p) => p.votes));
  return players.find((p) => p.votes === fewestVotes)!;
}

function randomWeightedElement(array: number[], target: number) {
  const diffs = array.map((num) => Math.abs(num - target));

  const weights = diffs.map((diff) => 1 / (PARAM1 + diff));

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
  const winProb = calculateWinProb(player1, player2);

  const winner = Math.random() > winProb ? player2 : player1;
  const loser = player1.id === winner.id ? player2 : player1;

  return [winner, loser];
}

function calculateWinProb(player1: IPlayer, player2: IPlayer) {
  return 1 / (1 + Math.pow(10, (player2.realElo - player1.realElo) / SENSITIVITY));
}

function calculatePositionDiff(players: IPlayer[]) {
  const orderedByEstimations = [...players.sort((a, b) => a.estimatedElo - b.estimatedElo)];
  const orderedByReal = [...players.sort((a, b) => a.realElo - b.realElo)];

  return orderedByEstimations.reduce(
    (acc, el, index) => acc + Math.abs(index - orderedByReal.findIndex((r) => r.id === el.id)),
    0
  );
}
