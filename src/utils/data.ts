export const removeUndefinedValues = <T extends object>(obj: T): T => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
};
