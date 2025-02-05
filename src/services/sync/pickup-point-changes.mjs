import {
  getAllIdosellPickupPoints,
  updateIdosellCache,
} from '../../cache/idosellCache.mjs';
import { findPickupPointChanges } from '../../utils/findPickupPointChanges.mjs';
import { logError } from '../../utils/logger.mjs';
import { retry } from '../../utils/retry.mjs';
import { addToIdosell } from '../idosell/add-pickup-points.mjs';
import { deleteFromIdosell } from '../idosell/delete-pickup-points.mjs';
import { updateOnIdosell } from '../idosell/update-pickup-points.mjs';

const compareAndSyncPickupPoints = async (newPickupPoints, allNovaPosts) => {
  try {
    const allIdosells = await getAllIdosellPickupPoints();
    const { pointsToUpdate, pointsToAdd, pointsToDelete } =
      findPickupPointChanges(newPickupPoints, allNovaPosts, allIdosells);

    await Promise.all([
      pointsToUpdate.length > 0
        ? updateOnIdosell(pointsToUpdate)
        : Promise.resolve(),
      pointsToAdd.length > 0 ? addToIdosell(pointsToAdd) : Promise.resolve(),
      pointsToDelete.length > 0
        ? deleteFromIdosell(pointsToDelete).then(() =>
            retry(updateIdosellCache)
          )
        : Promise.resolve(),
    ]);
  } catch (error) {
    logError(`Error in syncing pickup points: ${error.message}`);
  }
};

export { compareAndSyncPickupPoints };
