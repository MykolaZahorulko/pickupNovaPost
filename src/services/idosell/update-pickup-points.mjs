import axios from 'axios';
import dotenv from 'dotenv';
import { processPickupPoint } from '../../utils/process-pickup-point.mjs';
dotenv.config();

const updateOnIdosell = async (pickupPointsToUpdate) => {
  try {
    const requestBody = {
      params: {
        pickupPoints: pickupPointsToUpdate.map((pickupPoint) =>
          processPickupPoint(pickupPoint)
        ),
      },
    };

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

    console.log(
      `Pickup points updated on IdoSell,  response status: ${response.status}`
    );
  } catch (error) {
    console.error('Error adding pickup points to IdoSell', error.message);
    throw error;
  }
};

export { updateOnIdosell };
