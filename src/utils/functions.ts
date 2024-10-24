function isYear(search: string) {
  return !isNaN(Number(search)) ? parseInt(search) : undefined;
}

function validateYear(year: number): string | null {
  const currentYear = new Date().getFullYear();
  if (year > currentYear) {
    return `The year cannot be in the future.`;
  }
  if (year < 2005) {
    return `The year must be greater than or equal to 2005.`;
  }
  return null;
}

export { isYear, validateYear };
