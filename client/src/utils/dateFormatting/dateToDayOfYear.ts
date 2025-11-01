// convert a date string in format "MMDD" to day of year (1-365)
export function dateToDayOfYear(dateStr: string | null | undefined): number {
  if (!dateStr || dateStr.length !== 4) {
    return 1;
  }

  const month = Number.parseInt(dateStr.substring(0, 2), 10);
  const day = Number.parseInt(dateStr.substring(2, 4), 10);

  // days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let dayOfYear = day;
  for (let i = 0; i < month - 1; i++) {
    dayOfYear += daysInMonth[i];
  }

  return dayOfYear;
}
