export const getUndefinedScoreText = (
  gender?: string | null,
  group?: string | null,
  label?: string
) => {
  if (!gender) {
    return;
  }

  if (!group) {
    return `This stat shows how attractive this photo is in comparison with the ${gender} population.`;
  }

  return `This stat shows how attractive this photo is in comparison with the ${gender} population for the ${label}: ${group}.`;
};

export const getTooltipScoreText = (
  score: number,
  gender?: string | null,
  group?: string | null,
  label?: string
) => {
  if (!gender) {
    return;
  }

  if (!group) {
    return `This photo is more attractive than ${score.toFixed(
      2
    )}% of the ${gender} population.`;
  }

  return `This photo is more attractive than ${score.toFixed(
    2
  )}% of the ${gender} population for the ${label}: ${group}.`;
};
