import { comparePickupPoints } from '../../utils/compare-pickup-point.mjs';
import { logError } from '../../utils/logger.mjs';
import { addToIdosell } from '../idosell/add-pickup-points.mjs';
import { deleteFromIdosell } from '../idosell/delete-pickup-points.mjs';
import { getFromIdosell } from '../idosell/get-pickup-points.mjs';
import { updateOnIdosell } from '../idosell/update-pickup-points.mjs';
import { getFromNovaPost } from '../novapost/get-pickup-points.mjs';

let idosellCache = [];

const updateCacheFromIdosell = async () => {
  idosellCache = await getFromIdosell(100, 0, true);
};

const compareAndSyncPickupPoints = async (newPickupPoints) => {
  try {
    const pointsToUpdate = [];
    const pointsToAdd = [];
    const pointsToDelete = [];

    if (idosellCache.length === 0) {
      await updateCacheFromIdosell();
    }

    const novaPostPoints = await getFromNovaPost();
    const novaPostPointsIds = new Set(
      novaPostPoints.data.map((point) => point.Ref)
    );

    // Comparing, updating or adding points
    for (const newPoint of newPickupPoints) {
      // Either point is on IdoSell or not
      const existingPoint = idosellCache.find(
        (point) => point.pickupPointExternalId === newPoint.Ref
      );

      if (existingPoint) {
        const isChanged = comparePickupPoints(newPoint, existingPoint);

        if (isChanged) {
          pointsToUpdate.push(newPoint);
        }
      } else {
        pointsToAdd.push(newPoint);
      }
    }

    // Identify points that need to be deleted
    for (const existingPoint of idosellCache) {
      const isInNovaPost = novaPostPointsIds.has(
        existingPoint.pickupPointExternalId
      );
      if (!isInNovaPost) {
        pointsToDelete.push(existingPoint.pickupPointExternalId);
      }
    }

    if (pointsToUpdate.length > 0) {
      await updateOnIdosell(pointsToUpdate);
    }

    if (pointsToAdd.length > 0) {
      await addToIdosell(pointsToAdd);
    }

    if (pointsToDelete.length > 0) {
      await deleteFromIdosell(pointsToDelete);
    }

    await updateCacheFromIdosell();
  } catch (error) {
    logError(`Error in syncing pickup points: ${error.message}`);
  }
};

export { compareAndSyncPickupPoints };
