import axios from 'axios';
import dotenv from 'dotenv';
import { logError } from '../../utils/logger.mjs';

dotenv.config();

const getFromNovaPost = async (limit, page) => {
  try {
    const response = await axios.post(process.env.NOVA_POST_API_URL, {
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      // Add methodProperties only if limit or page is provided
      ...(limit || page
        ? {
            methodProperties: {
              ...(limit && { Limit: limit }),
              ...(page && { Page: page }),
            },
          }
        : {}),
    });

    if (response.data.success) {
      return response.data;
    } else {
      logError(`Error getting pickup points from NovaPost: ${response.data}`);
    }
  } catch (error) {
    logError(`Error getting pickup points from NovaPost: ${error.message}`);
  }
};

export { getFromNovaPost };
