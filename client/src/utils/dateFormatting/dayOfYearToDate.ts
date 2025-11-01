// convert day of year (1-365) to date string in format "MMDD"
export function dayOfYearToDate(dayOfYear: number): string {
  // days in each month (non-leap year)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let remainingDays = dayOfYear;
  let month = 1;

  for (let i = 0; i < daysInMonth.length; i++) {
    if (remainingDays <= daysInMonth[i]) {
      month = i + 1;
      break;
    }
    remainingDays -= daysInMonth[i];
  }

  const day = remainingDays;

  // format as MMDD with leading zeros
  return `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
}
