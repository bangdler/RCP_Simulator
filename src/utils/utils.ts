export const getRandomNumExcludeMax = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min)) + min;

export const getRandomNumIncludeMax = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
