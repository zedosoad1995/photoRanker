import { calculateNewRating } from "../rating";

it("Increases rating, when player wins", () => {
  const PLAYER_RATING = 1000;
  const OPPONENT_RATING = 1000;

  const newRating = calculateNewRating(true, PLAYER_RATING, OPPONENT_RATING);

  expect(newRating).toBeGreaterThan(PLAYER_RATING);
});

it("Increases rating more, when opponent has higher rating", () => {
  const PLAYER_RATING = 0;
  const OPPONENT_RATING_HIGHER = 1000;
  const OPPONENT_RATING_LOWER = -1000;

  const newRatingOpponentHigher = calculateNewRating(
    true,
    PLAYER_RATING,
    OPPONENT_RATING_HIGHER
  );
  const newRatingOpponentLower = calculateNewRating(
    true,
    PLAYER_RATING,
    OPPONENT_RATING_LOWER
  );

  expect(newRatingOpponentHigher).toBeGreaterThan(newRatingOpponentLower);
  expect(newRatingOpponentHigher).toBeGreaterThan(PLAYER_RATING);
  expect(newRatingOpponentLower).toBeGreaterThan(PLAYER_RATING);
});

it("Decreases rating, when player loses", () => {
  const PLAYER_RATING = 1000;
  const OPPONENT_RATING = 1000;

  const newRating = calculateNewRating(false, PLAYER_RATING, OPPONENT_RATING);

  expect(newRating).toBeLessThan(PLAYER_RATING);
});

it("Decreases rating more, when opponent has lower rating", () => {
  const PLAYER_RATING = 0;
  const OPPONENT_RATING_HIGHER = 1000;
  const OPPONENT_RATING_LOWER = -1000;

  const newRatingOpponentHigher = calculateNewRating(
    false,
    PLAYER_RATING,
    OPPONENT_RATING_HIGHER
  );
  const newRatingOpponentLower = calculateNewRating(
    false,
    PLAYER_RATING,
    OPPONENT_RATING_LOWER
  );

  expect(newRatingOpponentLower).toBeLessThan(newRatingOpponentHigher);
  expect(newRatingOpponentHigher).toBeLessThan(PLAYER_RATING);
  expect(newRatingOpponentLower).toBeLessThan(PLAYER_RATING);
});
