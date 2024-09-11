export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_MINUTE = 60;
export const DAYS_IN_WEEK = 7;
export const MS_IN_SECOND = 1000;

export const MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;
export const SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_DAY;
export const MS_IN_DAY: number = MS_IN_SECOND * SECONDS_IN_DAY;
export const MS_IN_WEEK: number = MS_IN_DAY * DAYS_IN_WEEK;

export const MIN_LOCATION_RADIUS_METRES = 30;
export const MAX_LOCATION_RADIUS_METRES = 1000 * 10000; // 10,000km
