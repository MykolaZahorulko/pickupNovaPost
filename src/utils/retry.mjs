import { logWarning } from './logger.mjs';

const retry = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      logWarning(`Error: ${error.message}. Retry ${i + 1} from ${retries}`);
      if (i < retries - 1)
        await new Promise((res) => setTimeout(res, delay * (i + 1)));
    }
  }
};

export { retry };
