export const omit = <T, F extends keyof T>(obj: T, key: F): Omit<T, F> => {
  const { [key]: _, ...payload } = obj;
  return payload;
};

export const removeUndefinedValues = <T extends object>(obj: T): T => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
};
