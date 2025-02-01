import axios from 'axios';
import dotenv from 'dotenv';
import { logError, logInfo } from '../../utils/logger.mjs';
import { processPickupPoint } from '../../utils/process-pickup-point.mjs';
dotenv.config();

const updateOnIdosell = async (pickupPointsToUpdate) => {
  try {
    const requestBody = {
      params: {
        pickupPoints: pickupPointsToUpdate
          .map((pickupPoint) => processPickupPoint(pickupPoint))
          .filter(Boolean),
      },
    };

    if (requestBody.params.pickupPoints.length > 0) {
      const response = await axios.put(
        process.env.IDOSELL_SHOP_API_URL,
        requestBody,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'X-API-KEY': process.env.IDOSELL_SHOP_API_KEY,
          },
        }
      );

      logInfo(
        `Successfully updated pickup points, status code: ${response.status}`
      );
    }
  } catch (error) { 
    logError(`Error updating pickup points: ${error.message}`);
  }
};

export { updateOnIdosell };
