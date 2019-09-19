import { dateClearTime } from './date-clear-time.helper';

export const getDaysInMonth = (date: Date): number => {
  // https://habr.com/ru/post/177059/
  const maxDaysInMonth: number = 33;
  return maxDaysInMonth - dateClearTime(new Date(date.getFullYear(), date.getMonth(), maxDaysInMonth)).getDate();
};
