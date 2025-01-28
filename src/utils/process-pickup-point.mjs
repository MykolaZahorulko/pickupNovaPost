import { processSchedule } from './process-schedule.mjs';
import dotenv from 'dotenv';

dotenv.config(); // Importing all variables from env file

const processPickupPoint = (pickupPoint) => {
  // The function returns processed pickup point received from NovaPost, into body to send it to IdoSell
  return {
    pickupPointExternalId: pickupPoint.Ref,
    courierId: process.env.IDOSELL_SHOP_CURIER_ID,
    descriptions: [
      {
        languageId: 'ukr',
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
