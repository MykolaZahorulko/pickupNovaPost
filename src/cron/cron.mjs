let blocker = false;

const runCron = (taskFunc, intervalInMin) => {
  const interval = intervalInMin * 60 * 1000;

  const executeTask = async () => {
    if (blocker) {
      setTimeout(() => executeTask(), 1000);
      return;
    }

    blocker = true;

    try {
      await taskFunc(); // Function goes
      setTimeout(() => executeTask(), interval);
    } catch (error) {
      setTimeout(() => executeTask(), interval);
    } finally {
      blocker = false;
    }
  };

  executeTask(); // Cron goes
};

export { runCron };
