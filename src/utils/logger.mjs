import { format } from 'date-fns';

const getCurrentTime = () => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
};

export const logInfo = (message) => {
  console.log(`[INFO] ${getCurrentTime()} - ${message}`);
};

export const logWarning = (message) => {
  console.warn(`[WARN] ${getCurrentTime()} - ${message}`);
};

export const logError = (message, error = null) => {
  console.error(`[ERROR] ${getCurrentTime()} - ${message}`);
  if (error) {
    console.error(error);
  }
};

export const logDebug = (message) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${getCurrentTime()} - ${message}`);
  }
};
