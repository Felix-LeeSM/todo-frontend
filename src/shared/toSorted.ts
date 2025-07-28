export const toSorted = <T>(arr: T[], comparator?: (a: T, b: T) => number): T[] => {
  return [...arr].sort(comparator);
};
