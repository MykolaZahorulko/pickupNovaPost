import { processPickupPoint } from './process-pickup-point.mjs';

const comparePickupPoints = (pointToCompare, existingPoint) => {
  if (!pointToCompare || !existingPoint) return true;

  const processedPoint = processPickupPoint(pointToCompare);
  if (!processedPoint) return true;

  // Check status
  if (
    existingPoint.serviceStatus.toLowerCase() !==
    processedPoint.serviceStatus.toLowerCase()
  ) {
    return true;
  }

  // Check address
  if (
    existingPoint.address.street !== processedPoint.address.street ||
    existingPoint.address.city !== processedPoint.address.city ||
    existingPoint.address.zipCode !== processedPoint.address.zipCode
  ) {
    return true;
  }

  // Check geo
  if (
    areCoordinatesDifferent(
      existingPoint.coordinates.latitude,
      processedPoint.coordinates.latitude
    ) ||
    areCoordinatesDifferent(
      existingPoint.coordinates.longitude,
      processedPoint.coordinates.longitude
    )
  ) {
    return true;
  }

  // Check paying options
  if (
    !areArraysEqual(processedPoint.paymentForms, existingPoint.paymentForms)
  ) {
    return true;
  }

  // Check schedule
  if (
    !areSchedulesEqual(
      existingPoint.operatingDays,
      processedPoint.operatingDays
    )
  ) {
    return true;
  }

  // Check description
  if (checkDescription(existingPoint, processedPoint)) {
    return true;
  }

  return false;
};

// Functions with comparing logic below

function areCoordinatesDifferent(coord1, coord2) {
  return Math.abs(parseFloat(coord1) - parseFloat(coord2)) > 0.0001;
}

function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.slice().sort().join(',') === arr2.slice().sort().join(',');
}

function areSchedulesEqual(schedule1, schedule2) {
  if (schedule1.length !== schedule2.length) return false;

  return schedule1.every((day1, index) => {
    const day2 = schedule2[index];

    return (
      day1.weekday === day2.weekday &&
      day1.opening === day2.opening &&
      day1.closing === day2.closing &&
      day1.operatingMode === day2.operatingMode
    );
  });
}

function checkDescription(existingPoint, processedPoint) {
  const existingDesc = existingPoint.descriptions.find(
    (desc) => desc.languageId === 'ukr'
  );
  const processedDesc = processedPoint.descriptions.find(
    (desc) => desc.languageId === 'ukr'
  );

  return (
    !existingDesc ||
    !processedDesc ||
    existingDesc.name !== processedDesc.name ||
    existingDesc.description !== processedDesc.description
  );
}

export { comparePickupPoints };
