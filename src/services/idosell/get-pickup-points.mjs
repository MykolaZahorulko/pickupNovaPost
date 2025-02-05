import axios from 'axios';
import dotenv from 'dotenv';
import pLimit from 'p-limit';
import { logError } from '../../utils/logger.mjs';

const limit = pLimit(100); // max 100 requests at once, when we get all points

dotenv.config();

/**
 * Get pickup points from IdoSell.
 * @param {number} resultsLimit - Number of results per page (1-100).
 * @param {number} resultsPage - Page number for paginated results.
 * @param {boolean} ifGetAll - Whether to fetch all pickup points.
 * @param {string} [pickupPointId] - Specific pickup point ID to fetch.
 * @returns {Promise<Array|Object>} - Returns an array of all pickup points if ifGetAll=true, otherwise a single page of results.
 */

const getFromIdosell = async (
  resultsLimit = 30,
  resultsPage = 0,
  ifGetAll = false,
  pickupPointId
) => {
  try {
    if (ifGetAll) {
      const firstResponse = await axios.get(
        `${process.env.IDOSELL_SHOP_API_URL}?courierId=${process.env.IDOSELL_SHOP_CURIER_ID}&resultsLimit=${resultsLimit}&resultsPage=0`,
        {
          headers: {
            accept: 'application/json',
            'X-API-KEY': process.env.IDOSELL_SHOP_API_KEY,
          },
        }
      );

      const { resultsNumberAll, result } = firstResponse.data;
      const totalPages = Math.ceil(resultsNumberAll / resultsLimit);

      const requests = [];
      for (let page = 1; page < totalPages; page++) {
        requests.push(
          limit(() =>
            axios.get(
              `${process.env.IDOSELL_SHOP_API_URL}?courierId=${process.env.IDOSELL_SHOP_CURIER_ID}&resultsLimit=${resultsLimit}&resultsPage=${page}`,
              {
                headers: {
                  accept: 'application/json',
                  'X-API-KEY': process.env.IDOSELL_SHOP_API_KEY,
                },
              }
            )
          )
        );
      }

      const responses = await Promise.all(requests);
      const allResults = responses.flatMap((res) => res.data.result);
      return [...result, ...allResults];
    } else {
      const response = await axios.get(
        `${process.env.IDOSELL_SHOP_API_URL}?courierId=${process.env.IDOSELL_SHOP_CURIER_ID}&pickupPointId=${pickupPointId ? pickupPointId : ''}&resultsPage=${resultsPage}&resultsLimit=${resultsLimit}`,
        {
          headers: {
            accept: 'application/json',
            'X-API-KEY': process.env.IDOSELL_SHOP_API_KEY,
          },
        }
      );

      return response.data;
    }
  } catch (error) {
    logError(
      `Error while getting pickup points from IdoSell: ${error.message}`
    );
  }
};

export { getFromIdosell };
