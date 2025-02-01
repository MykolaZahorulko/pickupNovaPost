import { runCron } from './cron/cron.mjs';
import { sync } from './services/sync/sync.mjs';
import { logError, logInfo } from './utils/logger.mjs';

const main = async () => {
  try {
    runCron(async () => {
      try {
        logInfo('Cron for NovaPost sync started\n');
        await sync(100); // Main function
        logInfo('Cron for NovaPost sync completed\n');
      } catch (error) {
        logError(`Error syncing NovaPost pickup points: ${error.message}`);
      }
    }, 60);
  } catch (error) {
    logError(`Error in main process: ${error.message}`);
  }
};

main();
