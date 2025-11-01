// get today's date in MMDD format
export function getTodayAsMMDD(): string {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${month}${day}`;
}
