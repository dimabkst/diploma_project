export const sanitizeString = (input: string) => {
  return input.trim().replace(/\s{2,}/g, ' ');
};

export const sanitizeAndCapitalizeFirstLetters = (input: string): string => {
  const sanitized = sanitizeString(input);

  return sanitized
    .split(' ')
    .map((word) => {
      if (word.length === 0) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
