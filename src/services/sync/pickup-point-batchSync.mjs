import { logError } from '../../utils/logger.mjs';
import { compareAndSyncPickupPoints } from './pickup-point-changes.mjs';

const pickupPointBatchSync = async (allNovaPosts, limit = 100) => {
  try {
    const totalPages = Math.ceil(allNovaPosts.length / limit);

    for (let i = 0; i < totalPages; i++) {
      const start = i * limit;
      const end = start + limit;
      const pointsBatch = allNovaPosts.slice(start, end);
      await compareAndSyncPickupPoints(pointsBatch, allNovaPosts);
    }
  } catch (error) {
    logError(`Error syncing pickup points: ${error.message}`);
  }
};

export { pickupPointBatchSync };
