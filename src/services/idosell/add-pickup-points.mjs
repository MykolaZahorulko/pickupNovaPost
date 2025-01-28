import axios from 'axios';
import dotenv from 'dotenv';
import { processPickupPoint } from '../../utils/process-pickup-point.mjs';
dotenv.config();

const addToIdosell = async (pickupPointsToAdd) => {
  try {
    const requestBody = {
      params: {
        pickupPoints: pickupPointsToAdd.map((pickupPoint) =>
          processPickupPoint(pickupPoint)
        ),
      },
    };

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

    console.log(
      `Pickup points added to IdoSell,  response status: ${response.status}`
    );
  } catch (error) {
    console.error('Error adding pickup points to IdoSell', error.message);
    throw error;
  }
};

export { addToIdosell };
