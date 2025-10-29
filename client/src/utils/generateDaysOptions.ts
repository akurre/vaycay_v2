export function generateDaysOptions(
  selectedMonth: string
): Array<{ value: string; label: string }> {
  const numberOfDays = new Date(2022, parseInt(selectedMonth, 10), 0).getDate();
  const daysOptions = [];

  for (let i = 1; i <= numberOfDays; i++) {
    const dayFormatted = i.toString().padStart(2, '0');
    daysOptions.push({
      value: dayFormatted,
      label: dayFormatted,
    });
  }

  return daysOptions;
}
