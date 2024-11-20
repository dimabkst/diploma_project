import { sensitiveFields } from '../constants/data';

export const omit = <T, F extends keyof T>(obj: T, key: F): Omit<T, F> => {
  const { [key]: _, ...payload } = obj;
  return payload;
};

export const removeUndefinedValues = <T extends object>(obj: T): T => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
};

export const maskSensitiveData = (data: any) => {
  if (!data) return;

  const maskField = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;

    return Array.isArray(obj)
      ? obj.map(maskField)
      : Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, sensitiveFields.includes(key) ? '***' : maskField(value)])
        );
  };

  return maskField(data);
};
