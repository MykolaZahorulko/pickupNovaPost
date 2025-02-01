import { getFromNovaPost } from '../novapost/get-pickup-points.mjs';
import { compareAndSyncPickupPoints } from './pickup-point-service.mjs';

const sync = async (limit = 100) => {
  const {
    info: { totalCount },
  } = await getFromNovaPost(limit, 1);
  const totalPages = Math.ceil(totalCount / limit);
  for (let page = 1; page <= totalPages; page++) {
    const { data: pointsToAdd } = await getFromNovaPost(limit, page);

    await compareAndSyncPickupPoints(pointsToAdd);
  }
};

export { sync };
