export const toBoolean = (value: string | null | undefined): boolean => {
  if (value == null) return false;

  const normalized = value.trim().toLowerCase();

  return ['1'].includes(normalized);
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
