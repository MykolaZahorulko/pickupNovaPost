import { comparePickupPoints } from './compare-pickup-point.mjs';

const findPickupPointChanges = (newPickupPoints, allNovaPosts, allIdosells) => {
  const novaPostPointsIds = new Set(allNovaPosts.map((point) => point.Ref));
  const pointsToUpdate = [];
  const pointsToAdd = [];
  const pointsToDelete = [];

  for (const newPoint of newPickupPoints) {
    const existingPoint = allIdosells.find(
      (point) => point.pickupPointExternalId === newPoint.Ref
    );

    if (existingPoint) {
      if (comparePickupPoints(newPoint, existingPoint)) {
        pointsToUpdate.push(newPoint);
      }
    } else {
      pointsToAdd.push(newPoint);
    }
  }

  for (const existingPoint of allIdosells) {
    if (!novaPostPointsIds.has(existingPoint.pickupPointExternalId)) {
      pointsToDelete.push(existingPoint.pickupPointExternalId);
    }
  }

  return { pointsToUpdate, pointsToAdd, pointsToDelete };
};

export { findPickupPointChanges };
