import {
  UPDATE_SCRAPER_STATUS,
  UPDATE_SCRAPER_TYPE,
  UPDATE_NO_OF_MONTHS_TO_SCAN,
} from '../constants/actions/scraper';

/**
 *
 * @param {string} status
 * @returns
 */
export function updateScraperStatus(status) {
  return {
    type: UPDATE_SCRAPER_STATUS,
    data: status,
  };
}

/**
 *
 * @param {string} type
 * @returns
 */
export function updateScraperType(type) {
  return {
    type: UPDATE_SCRAPER_TYPE,
    data: type,
  };
}

/**
 *
 * @param {number} months
 * @returns
 */
export function updateNoOfMonthsToScan(months) {
  return {
    type: UPDATE_NO_OF_MONTHS_TO_SCAN,
    data: months,
  };
}
