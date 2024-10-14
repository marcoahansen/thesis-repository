function isYear(search: string) {
  return !isNaN(Number(search)) ? parseInt(search) : undefined;
}

export { isYear };
