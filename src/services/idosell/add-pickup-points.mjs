import axios from 'axios';
import dotenv from 'dotenv';
import { logError, logInfo, logWarning } from '../../utils/logger.mjs';
import { processPickupPoint } from '../../utils/process-pickup-point.mjs';
dotenv.config();

const addToIdosell = async (pickupPointsToAdd) => {
  try {
    const requestBody = {
      params: {
        pickupPoints: pickupPointsToAdd
          .map((pickupPoint) => processPickupPoint(pickupPoint))
          .filter(Boolean),
      },
    };

    if (requestBody.params.pickupPoints.length > 0) {
      const response = await axios.post(
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

      if (response.status === 200) {
        logInfo(
          `Successfully added pickup points, status code: ${response.status}`
        );
      } else {
        logWarning(
          `The pickup points are already added, status code: ${response.status}`
        );
      }
    }
  } catch (error) {
    logError(`Error adding pickup points: ${error.message}`);
  }
};

export { addToIdosell };
