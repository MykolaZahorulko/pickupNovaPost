const processSchedule = (schedule, CategoryOfWarehouse, PostMachineType) => {
  // Checking is this point is 24/7 postomat
  if (CategoryOfWarehouse === 'Postomat' && PostMachineType === 'FullDayService') {
    // Return 24/7 schedule if the warehouse is a Postomat and operates full day
    return [
      {
        weekday: 1,
        operatingMode: '24h',
      },
      {
        weekday: 2,
        operatingMode: '24h',
      },
      {
        weekday: 3,
        operatingMode: '24h',
      },
      {
        weekday: 4,
        operatingMode: '24h',
      },
      {
        weekday: 5,
        operatingMode: '24h',
      },
      {
        weekday: 6,
        operatingMode: '24h',
      },
      {
        weekday: 7,
        operatingMode: '24h',
      },
    ];
  } else {
    // Map of weekdays in the schedule object to their corresponding numbers
    const weekDaysMap = [
      'Monday',    // 1
      'Tuesday',   // 2
      'Wednesday', // 3
      'Thursday',  // 4
      'Friday',    // 5
      'Saturday',  // 6
      'Sunday',    // 7
    ];

    // Transform the schedule object into an array of day-specific objects
    return weekDaysMap.map((day, index) => {
      const hours = schedule[day]; // Get the working hours for the current day

      if (hours === '-') {
        // If the day is marked as closed, return an object with operatingMode "closed"
        return {
          weekday: index + 1, // Convert index to 1-based weekday numbering
          operatingMode: 'closed',
        };
      } else {
        // If the day has working hours, split them into opening and closing times
        const [opening, closing] = hours.split('-');
        return {
          weekday: index + 1, // Convert index to 1-based weekday numbering
          opening,            // Opening time
          closing,            // Closing time
          operatingMode: 'open_in', // Indicates the warehouse is open
        };
      }
    });
  }
};

export { processSchedule };
