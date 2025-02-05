import { logDebug } from './logger.mjs';
import { processSchedule } from './process-schedule.mjs';
import dotenv from 'dotenv';

dotenv.config();

const processPickupPoint = (pickupPoint) => {
  // The function returns processed pickup point received from NovaPost, into body to send it to IdoSell, if it's not point only for sending
  if (
    pickupPoint.CategoryOfWarehouse === 'DropOff' ||
    !pickupPoint.PostalCodeUA
  ) {
    logDebug(`Skipping point ${pickupPoint.Number}: not eligible for pickup.`);
    return;
  }
  return {
    pickupPointExternalId: pickupPoint.Ref,
    courierId: process.env.IDOSELL_SHOP_CURIER_ID,
    descriptions: [
      {
        languageId: 'ukr',
        name: pickupPoint.Description,
        description: `${pickupPoint.SettlementAreaDescription} область, ${pickupPoint.SettlementRegionsDescription ? pickupPoint.SettlementRegionsDescription + ' район,' : ''} ${pickupPoint.SettlementTypeDescription} ${pickupPoint.SettlementDescription}, ${pickupPoint.Description}`,
      },
      {
        languageId: 'pol',
        name: pickupPoint.Description,
        description: `${pickupPoint.SettlementAreaDescription} область, ${pickupPoint.SettlementRegionsDescription ? pickupPoint.SettlementRegionsDescription + ' район,' : ''} ${pickupPoint.SettlementTypeDescription} ${pickupPoint.SettlementDescription}, ${pickupPoint.Description}`,
      },
    ],
    paymentForms:
      pickupPoint.CategoryOfWarehouse !== 'Postomat'
        ? pickupPoint.POSTerminal === '1'
          ? ['card', 'cash']
          : ['cash']
        : ['card'],
    serviceStatus:
      pickupPoint.WarehouseStatus === 'Working'
        ? 'available'
        : 'out_of_service',
    address: {
      street: pickupPoint.ShortAddress,
      zipCode: pickupPoint.PostalCodeUA,
      city: pickupPoint.SettlementDescription,
    },
    coordinates: {
      longitude: Number(pickupPoint.Longitude),
      latitude: Number(pickupPoint.Latitude),
    },
    operatingDays: processSchedule(
      pickupPoint.Schedule,
      pickupPoint.CategoryOfWarehouse,
      pickupPoint.PostMachineType
    ),
  };
};

export { processPickupPoint };
