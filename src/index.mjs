import { getFromNovaPost } from './services/novapost/get-pickup-points.mjs'
import { compareAndSyncPickupPoints } from './services/sync/pickup-point-service.mjs';

const main = async () => {
  try {
    const pointsToAdd = await getFromNovaPost(10, 1);
    await compareAndSyncPickupPoints(pointsToAdd.data);
  } catch (error) {
    console.error('Error starting the engine', error.message);
    throw error;
  }
};

main();
