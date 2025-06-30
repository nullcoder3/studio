import { eachDayOfInterval, isSunday, isSameDay } from 'date-fns';

export function calculateWorkingDays(startDate: Date, holidays: Date[]): number {
  const endDate = new Date();
  if (startDate > endDate) {
    return 0;
  }

  const interval = { start: startDate, end: endDate };
  const allDays = eachDayOfInterval(interval);

  const workingDays = allDays.filter(day => {
    const sunday = isSunday(day);
    const holiday = holidays.some(h => isSameDay(h, day));
    return !sunday && !holiday;
  });

  return workingDays.length;
}
