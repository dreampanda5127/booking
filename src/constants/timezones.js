// Comprehensive US & Canada Timezones with UTC Offsets (No GMT)
export const US_CA_TIMEZONES = [
  {
    id: 'America/Los_Angeles',
    name: 'Pacific Time (US & Canada)',
    utcOffset: 'UTC-08:00',
    label: '(UTC-08:00) Pacific Time (US & Canada)',
    shortName: 'PT',
    offsetMinutes: -480,
    offsetFromPacific: 0,
    locations: [
      'Los Angeles', 'San Francisco', 'Seattle', 'San Diego', 'Portland',
      'Las Vegas', 'San Jose', 'Sacramento', 'Vancouver', 'Victoria', 'CA', 'WA', 'OR', 'NV', 'BC'
    ],
  },
  {
    id: 'America/Denver',
    name: 'Mountain Time (US & Canada)',
    utcOffset: 'UTC-07:00',
    label: '(UTC-07:00) Mountain Time (US & Canada)',
    shortName: 'MT',
    offsetMinutes: -420,
    offsetFromPacific: 60,
    locations: [
      'Denver', 'Salt Lake City', 'Calgary', 'Edmonton', 'Albuquerque',
      'Boise', 'Colorado Springs', 'El Paso', 'Cheyenne', 'Helena', 'CO', 'UT', 'AB', 'NM', 'ID', 'WY', 'MT'
    ],
  },
  {
    id: 'America/Phoenix',
    name: 'Arizona Time (No DST)',
    utcOffset: 'UTC-07:00',
    label: '(UTC-07:00) Arizona Time (No DST)',
    shortName: 'MST',
    offsetMinutes: -420,
    offsetFromPacific: 60,
    locations: [
      'Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler', 'Gilbert',
      'Glendale', 'Tempe', 'Peoria', 'Flagstaff', 'Arizona', 'AZ'
    ],
  },
  {
    id: 'America/Chicago',
    name: 'Central Time (US & Canada)',
    utcOffset: 'UTC-06:00',
    label: '(UTC-06:00) Central Time (US & Canada)',
    shortName: 'CT',
    offsetMinutes: -360,
    offsetFromPacific: 120,
    locations: [
      'Chicago', 'Dallas', 'Houston', 'Austin', 'San Antonio',
      'Minneapolis', 'Winnipeg', 'Kansas City', 'New Orleans',
      'Nashville', 'Memphis', 'Oklahoma City', 'Milwaukee', 'TX', 'IL', 'MN', 'MB', 'MO', 'TN', 'WI'
    ],
  },
  {
    id: 'America/New_York',
    name: 'Eastern Time (US & Canada)',
    utcOffset: 'UTC-05:00',
    label: '(UTC-05:00) Eastern Time (US & Canada)',
    shortName: 'ET',
    offsetMinutes: -300,
    offsetFromPacific: 180,
    locations: [
      'New York', 'Toronto', 'Montreal', 'Miami', 'Atlanta', 'Boston',
      'Philadelphia', 'Washington DC', 'Detroit', 'Charlotte', 'Orlando',
      'Tampa', 'Ottawa', 'Quebec', 'Pittsburgh', 'NY', 'ON', 'QC', 'FL', 'GA', 'MA', 'PA', 'DC', 'MI'
    ],
  },
  {
    id: 'America/Halifax',
    name: 'Atlantic Time (Canada)',
    utcOffset: 'UTC-04:00',
    label: '(UTC-04:00) Atlantic Time (Canada)',
    shortName: 'AT',
    offsetMinutes: -240,
    offsetFromPacific: 240,
    locations: [
      'Halifax', 'Moncton', 'Saint John', 'Fredericton', 'Charlottetown',
      'Sydney', 'Dartmouth', 'Nova Scotia', 'New Brunswick', 'PEI', 'NS', 'NB', 'PE'
    ],
  },
  {
    id: 'America/St_Johns',
    name: 'Newfoundland Time (Canada)',
    utcOffset: 'UTC-03:30',
    label: '(UTC-03:30) Newfoundland Time (Canada)',
    shortName: 'NT',
    offsetMinutes: -210,
    offsetFromPacific: 270,
    locations: [
      'St. John\'s', 'Corner Brook', 'Gander', 'Mount Pearl', 'Newfoundland', 'Labrador', 'NL'
    ],
  },
  {
    id: 'America/Anchorage',
    name: 'Alaska Time (US)',
    utcOffset: 'UTC-09:00',
    label: '(UTC-09:00) Alaska Time (US)',
    shortName: 'AKT',
    offsetMinutes: -540,
    offsetFromPacific: -60,
    locations: [
      'Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Alaska', 'AK'
    ],
  },
  {
    id: 'Pacific/Honolulu',
    name: 'Hawaii-Aleutian Time (US)',
    utcOffset: 'UTC-10:00',
    label: '(UTC-10:00) Hawaii Time (US)',
    shortName: 'HST',
    offsetMinutes: -600,
    offsetFromPacific: -120,
    locations: [
      'Honolulu', 'Hilo', 'Kahului', 'Kailua', 'Oahu', 'Maui', 'Kauai', 'Hawaii', 'HI'
    ],
  },
];

// All 30-minute interval slots from 00:00 to 23:30 (48 slots across 24h)
export const ALL_DAY_30MIN_SLOTS = Array.from({ length: 48 }, (_, i) => i * 30);
export const WORKING_HOURS_30MIN_SLOTS = ALL_DAY_30MIN_SLOTS;
export const BASE_PACIFIC_30MIN_SLOTS = ALL_DAY_30MIN_SLOTS;

export function formatMinutesToTime(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const padHours = hours24.toString().padStart(2, '0');
  const padMin = minutes.toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'pm' : 'am';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;

  return {
    display24: `${padHours}:${padMin}`,
    display12: `${hours12}:${padMin} ${period}`,
    slotLabel: `${padHours}:${padMin}`,
  };
}

export function getTimeSlotsForTimezone(timezone, customBaseSlots = null) {
  // Always include all 48 slots from 00:00 to 23:30 (00:00 - 00:30 through 23:30 - 00:00)
  const baseSlots = ALL_DAY_30MIN_SLOTS;

  return baseSlots.map((baseMin) => {
    const localStart = baseMin;
    const localEnd = localStart + 30; // 30 minutes duration
    const startObj = formatMinutesToTime(localStart);
    const endObj = formatMinutesToTime(localEnd);

    return {
      rawMinutes: localStart,
      time: startObj.display24, // e.g. "00:00", "00:30", ..., "23:30"
      time12: startObj.display12, // e.g. "12:00 am", "12:30 am", ..., "11:30 pm"
      timeSlot: `${startObj.display24} - ${endObj.display24}`, // "00:00 - 00:30" to "23:30 - 00:00"
      duration: '30 min',
    };
  });
}


