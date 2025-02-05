import { getFromNovaPost } from '../services/novapost/get-pickup-points.mjs';
import { logInfo, logWarning } from '../utils/logger.mjs';

let novaPostCache = [];
let isNovaPostCacheUpdating = false;

const updateNovaPostCache = async () => {
  if (isNovaPostCacheUpdating) return;
  isNovaPostCacheUpdating = true;

  try {
    const pickupPoints = await getFromNovaPost();
    if (Array.isArray(pickupPoints) && pickupPoints.length > 0) {
      novaPostCache = pickupPoints;
      logInfo(
        `NovaPost cache updated, ${novaPostCache.length} items --- novaCache`
      );
    } else {
      logWarning(
        `Received empty or invalid data while updating NovaPost cache --- novaCache`
      );
    }
  } finally {
    isNovaPostCacheUpdating = false;
  }
};

const getAllNovaPostPickupPoints = async () => {
  return novaPostCache;
};

export { getAllNovaPostPickupPoints, updateNovaPostCache };
