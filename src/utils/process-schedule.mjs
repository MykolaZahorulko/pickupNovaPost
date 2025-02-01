const processSchedule = (schedule, CategoryOfWarehouse, PostMachineType) => {
  // Checking is this point is 24/7 postomat
  if (
    CategoryOfWarehouse === 'Postomat' &&
    PostMachineType === 'FullDayService'
  ) {
    return [
      {
        weekday: 1,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 2,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 3,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 4,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 5,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 6,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
      {
        weekday: 7,
        opening: '00:00',
        closing: '23:59',
        operatingMode: '24h',
      },
    ];
  } else {
    const weekDaysMap = [
      'Monday', // 1
      'Tuesday', // 2
      'Wednesday', // 3
      'Thursday', // 4
      'Friday', // 5
      'Saturday', // 6
      'Sunday', // 7
    ];

    // Transform the schedule object into an array of day-specific objects
    return weekDaysMap.map((day, index) => {
      const hours = schedule[day];

      if (hours === '-') {
        return {
          weekday: index + 1,
          opening: '00:00',
          closing: '00:00',
          operatingMode: 'closed',
        };
      } else {
        const [opening, closing] = hours.split('-');
        return {
          weekday: index + 1,
          opening,
          closing,
          operatingMode: 'open_in',
        };
      }
    });
  }
};

export { processSchedule };
