const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    if (
      typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      trimmed.startsWith('http://')
    ) {
      console.warn(
        'VITE_API_URL uses http:// while page is loaded over https://. Using relative /api proxied via vercel.json rewrite.'
      );
      return '/api';
    }
    return trimmed;
  }
  return '/api';
};

export async function fetchTimezonesApi() {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/timezones`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Could not fetch backend timezones, falling back to static:', err);
    return null;
  }
}

export async function fetchBookingPageSettingApi() {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/page-setting`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return { bookingVersion: 'option2' };
    const data = await response.json();
    return {
      bookingVersion: data?.bookingVersion || 'option2',
    };
  } catch (err) {
    console.warn('Could not fetch booking page setting, defaulting to option2:', err);
    return { bookingVersion: 'option2' };
  }
}


export async function fetchInviteInfoApi(token) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/invite-info?token=${encodeURIComponent(token)}`;

  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Invalid or expired invitation token.');
  }

  return data;
}

export async function createBookingApi(bookingData) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data?.message || `Booking failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return data;
}

export async function fetchUnavailableSlotsApi(dateStr, token = '') {
  const baseUrl = getApiBaseUrl();
  let endpoint = `${baseUrl}/bookings/availability?date=${encodeURIComponent(dateStr)}`;
  if (token) {
    endpoint += `&token=${encodeURIComponent(token)}`;
  }

  try {
    const response = await fetch(endpoint);
    if (!response.ok) return { bookedTimes: [], isAllDayBlocked: false, blockedDates: [] };
    const data = await response.json();
    return {
      bookedTimes: data?.bookedTimes || [],
      isAllDayBlocked: Boolean(data?.isAllDayBlocked),
      blockedDates: Array.isArray(data?.blockedDates) ? data.blockedDates : [],
      serverTime: data?.serverTime || null,
    };
  } catch (err) {
    console.warn('Could not fetch unavailable slots:', err);
    return { bookedTimes: [], isAllDayBlocked: false, blockedDates: [] };
  }
}

export function sendTrackDurationApi(token, durationSeconds) {
  if (!token || !durationSeconds || durationSeconds <= 0) return;
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/track-duration`;

  const payload = JSON.stringify({ token, duration: durationSeconds });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    } catch {
      // Fallback to fetch
    }
  }

  try {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore error
  }
}

export async function unsubscribeApi(token, reason = '') {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/unsubscribe`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, reason }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to unsubscribe.');
  }

  return data;
}

export async function resubscribeApi(token) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/bookings/resubscribe`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to resubscribe.');
  }

  return data;
}

