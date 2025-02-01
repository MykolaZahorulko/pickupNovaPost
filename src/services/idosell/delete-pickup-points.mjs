import axios from 'axios';
import dotenv from 'dotenv';
import { logError, logInfo } from '../../utils/logger.mjs';

dotenv.config();

const deleteFromIdosell = async (pickupPointsToDelete) => {
  try {
    let requestBody = {
      params: {
        pickupPointDeleteRequests: pickupPointsToDelete.map(
          (idPointToDelete) => ({
            pickupPointExternalId: idPointToDelete,
          })
        ),
      },
    };

    const response = await axios.post(
      `${process.env.IDOSELL_SHOP_API_URL}/delete`,
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
      `Successfully deleted pickup points, status code: ${response.status}`
    );
  } catch (error) {
    logError(`Error deleting pickup points: ${error.message}`);
  }
};

export { deleteFromIdosell };
