// Check if some of the pickup points are already on IdoSell, if so, bring them to checking if something has changed, if so to update the pickup point
// If the pickup point isn't on IdoSell, add it
// If the pickup point is on IdoSell, but it's not on NovaPost, delete it
import { addToIdosell } from '../idosell/add-pickup-points.mjs';
import { deleteFromIdosell } from '../idosell/delete-pickup-points.mjs';
import { getFromIdosell } from '../idosell/get-pickup-points.mjs';
import { updateOnIdosell } from '../idosell/update-pickup-points.mjs';
import { getFromNovaPost } from '../novapost/get-pickup-points.mjs';

let idosellCache = []; // Local cache of IdoSell pickup points

// Function to update the cache
const updateCacheFromIdosell = async () => {
  idosellCache = await getFromIdosell(100, 0, true); // Get all points form IdoSell
};

// Function of checking
const compareAndSyncPickupPoints = async (newPickupPoints) => {
  try {
    if (idosellCache.length === 0) {
      await updateCacheFromIdosell(); // If the cache is empty, update it
    }

    const pointsToUpdate = [];
    const pointsToAdd = [];
    const pointsToDelete = [];

    // Create a set of IDs for new pickup points for quick lookup
    const newPickupPointsIds = new Set(
      newPickupPoints.map((point) => point.Ref)
    );

    // Fetch all pickup points from Nova Post
    const novaPostPoints = await getFromNovaPost(); // Assuming it returns an array of pickup points
    const novaPostPointsIds = new Set(novaPostPoints.data.map((point) => point.Ref));

    for (const newPoint of newPickupPoints) {
      const existingPoint = idosellCache.find(
        (point) => point.pickupPointExternalId === newPoint.Ref
      );

      if (existingPoint) {
        // Check if the existing point has changed
        const isChanged = false; // Implement this function separately

        if (isChanged) {
          pointsToUpdate.push(newPoint); // Add the point to the update array
        }
      } else {
        pointsToAdd.push(newPoint); // Add the point to the add array
      }
    }

    // Identify points that need to be deleted
    for (const existingPoint of idosellCache) {
      const isInNovaPost = novaPostPointsIds.has(
        existingPoint.pickupPointExternalId
      ); // Check if the point exists in Nova Post
      if (!isInNovaPost) {
        pointsToDelete.push(existingPoint.pickupPointExternalId); // Add to delete array only if not in Nova Post
      }
    }

    // Update points in IdoSell if there are any changes
    // if (pointsToUpdate.length > 0) {
    // await updateOnIdosell(pointsToUpdate);
    // console.log(`Pickup points ${pointsToUpdate}`);
    // }

    // Add new points to IdoSell if needed
    if (pointsToAdd.length > 0) {
      await addToIdosell(pointsToAdd);
    }

    // Delete points from IdoSell if they no longer exist in the new list
    if (pointsToDelete.length > 0) {
      await deleteFromIdosell(pointsToDelete);
    }

    // Update the cache after all operations
    await updateCacheFromIdosell();
  } catch (error) {
    console.error(`Error in syncing pickup points: ${error.message}`);
    throw error;
  }
};

export { compareAndSyncPickupPoints };
