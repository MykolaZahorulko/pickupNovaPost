import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Importing all variables from env file

const getFromNovaPost = async (limit, page) => {
  try {
    const response = await axios.post(process.env.NOVA_POST_API_URL, {
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      // Add methodProperties only if limit or page is provided
      ...(limit || page ? { methodProperties: { ...(limit && { Limit: limit }), ...(page && { Page: page }) } } : {}),
    });

    if (response.data.success) {
      return response.data; // Returning array of pickup points
    } else {
      throw new Error(`API Error: ${response.data.errors.join(', ')}`);
    }
  } catch (error) {
    console.error('Error fetching pickup points', error.message);
    throw error;
  }
};

export { getFromNovaPost };
