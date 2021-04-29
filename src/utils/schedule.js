import moment from 'moment';

export const generateSchedules = () => {
  /**
   * generate schedules from today
   */
  const days = [];

  for (let index = 1; index <= 5; index++) {
    days.push(moment().add('day', index));
  }
  return days;
};
