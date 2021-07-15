import {
  UPDATE_SCRAPER_STATUS,
  UPDATE_SCRAPER_TYPE,
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
