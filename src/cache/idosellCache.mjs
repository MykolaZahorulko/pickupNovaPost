import { getFromIdosell } from '../services/idosell/get-pickup-points.mjs';
import { logInfo, logWarning } from '../utils/logger.mjs';

let idosellCache = [];
let isIdosellCacheUpdating = false;

const updateIdosellCache = async () => {
  if (isIdosellCacheUpdating) return;
  isIdosellCacheUpdating = true;
  try {
    const newData = await getFromIdosell(100, 0, true);
    if (Array.isArray(newData) && newData.length > 0) {
      idosellCache = newData;
      logInfo(
        `IdoSell cache updated, ${idosellCache.length} items --- idoCache`
      );
    } else {
      logWarning(
        `Received empty or invalid data while updating IdoSell cache --- idoCache`
      );
    }
  } finally {
    isIdosellCacheUpdating = false;
  }
};

const getAllIdosellPickupPoints = async () => {
  return idosellCache;
};

export { getAllIdosellPickupPoints, updateIdosellCache };
