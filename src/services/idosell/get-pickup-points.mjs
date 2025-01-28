import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Importing all variables from env file

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
    // Ensure resultsLimit is within valid range
    if (resultsLimit < 1 || resultsLimit > 100) {
      throw new Error('resultsLimit must be between 1 and 100.');
    }

    if (ifGetAll) {
      let allPickupPoints = [];
      let page = 0;

      while (true) {
        const response = await axios.get(
          `${process.env.IDOSELL_SHOP_API_URL}?courierId=${process.env.IDOSELL_SHOP_CURIER_ID}&resultsLimit=${resultsLimit}&resultsPage=${page}`,
          {
            headers: {
              accept: 'application/json',
              'X-API-KEY': process.env.IDOSELL_SHOP_API_KEY,
            },
          }
        );

        const { result, resultsNumberAll } = response.data;

        // Add current results to the array
        allPickupPoints.push(...result);

        // Break the loop if we received fewer results than the limit
        if (allPickupPoints.length >= resultsNumberAll) break;

        page++; // Increment page for the next iteration
      }

      return allPickupPoints;
    } else {
      const response = await axios.get(
        // The request link is processed by the arguments and data in the .env file
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
    console.error(
      `Error while getting pickup points from IdoSell: ${error.message}`
    );
    if (error.response) {
      console.error(
        `Response data: ${JSON.stringify(error.response.data, null, 2)}`
      );
      console.error(`Response status: ${error.response.status}`);
    }
  }
};

export { getFromIdosell };
