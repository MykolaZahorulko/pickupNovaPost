import axios from 'axios';
import dotenv from 'dotenv';
import { getFromIdosell } from './get-pickup-points.mjs';

dotenv.config(); // Importing all variables from env file

// The function deletes pickup points from idosell, that are provided as an argument
const deleteFromIdosell = async (pickupPointsToDelete) => {
  try {
    let requestBody = {
      params: {
        pickupPointDeleteRequests: pickupPointsToDelete.map((pickupPointId) => ({
          pickupPointExternalId: pickupPointId,
        })),
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

    if (response.status === 200) {
      console.log('Successfully deleted pickup points');
    } else {
      console.error('Error while deleting pickup points from IdoSell');
    }
  } catch (error) {
    console.error(
      `Error while deleting pickup points from IdoSell: ${error.message}`
    );
    if (error.response) {
      console.error(
        `Response data: ${JSON.stringify(error.response.data, null, 2)}`
      );
      console.error(`Response status: ${error.response.status}`);
    }
  }
};

export { deleteFromIdosell };
