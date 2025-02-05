import dotenv from 'dotenv';
import { runCron } from './cron/cron.mjs';
import { syncNovapostData } from './services/sync/sync-novapost-data.mjs';
import { logError } from './utils/logger.mjs';

dotenv.config();

const main = async () => {
  try {
    runCron(syncNovapostData, process.env.CRON_INTERVAL);
  } catch (error) {
    logError(`Error in main process: ${error.message}`);
  }
};

main();
