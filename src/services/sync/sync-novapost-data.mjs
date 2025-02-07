import { updateIdosellCache } from '../../cache/idosellCache.mjs';
import {
  getAllNovaPostPickupPoints,
  updateNovaPostCache,
} from '../../cache/novapostCache.mjs';
import { logInfo } from '../../utils/logger.mjs';
import { retry } from '../../utils/retry.mjs';
import { pickupPointBatchSync } from './pickup-point-batchSync.mjs';

const syncNovapostData = async () => {
  try {
    logInfo('Cron for NovaPost syncing started\n');

    await Promise.all([retry(updateIdosellCache), retry(updateNovaPostCache)]);

    const allNovaPosts = await getAllNovaPostPickupPoints();

    await pickupPointBatchSync(allNovaPosts, 100); // Main function

    logInfo('Cron for NovaPost syncing completed\n');
  } catch (error) {
    logInfo(`Error during NovaPost sync: ${error.message}`);
  }
};

export { syncNovapostData };
