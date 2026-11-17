import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Clock, MessageSquare, Calendar as CalendarIcon, AlertTriangle, BellOff, KeyRound } from 'lucide-react';
import { US_CA_TIMEZONES, getTimeSlotsForTimezone } from './constants/timezones';
import CalendarWithSlots from './components/CalendarWithSlots';
import InlineBookingForm from './components/InlineBookingForm';
import RealtimeChatIllustration from './components/RealtimeChatIllustration';
import InvitationEntry from './components/InvitationEntry';
import ScheduledAppointmentView from './components/ScheduledAppointmentView';
import BookingSkeleton from './components/BookingSkeleton';
import UnsubscribedConfirmationView from './components/UnsubscribedConfirmationView';
import UnsubscribeModal from './components/UnsubscribeModal';
import {
  fetchTimezonesApi,
  fetchInviteInfoApi,
  fetchUnavailableSlotsApi,
  fetchBookingPageSettingApi,
  sendTrackDurationApi,
  unsubscribeApi,
  resubscribeApi,
} from './services/api';

const getInitialToken = () => {
  if (typeof window === 'undefined') return '';
  const q = new URLSearchParams(window.location.search).get('token');
  if (q) return q.trim();
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return path && path !== 'index.html' ? path.split('/').pop().trim() : '';
};

const getInitialVersionOverride = () => {
  if (typeof window === 'undefined') return null;
  const p = new URLSearchParams(window.location.search);
  const v = p.get('version') || p.get('option') || p.get('v');
  if (v === '2' || v === 'option2') return 'option2';
  if (v === '1' || v === 'option1') return 'option1';
  return null;
};

export default function App() {
  const [bookingVersion, setBookingVersion] = useState(() => getInitialVersionOverride() || 'option1');
  const [token, setToken] = useState(getInitialToken);
  const [isVerifying, setIsVerifying] = useState(() => Boolean(getInitialToken()));
  const [tokenError, setTokenError] = useState('');
  const [quickTokenInput, setQuickTokenInput] = useState('');
  const [contact, setContact] = useState(null);
  const [existingBooking, setExistingBooking] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isResubscribing, setIsResubscribing] = useState(false);
  const [resubscribeError, setResubscribeError] = useState('');

  const [timezones, setTimezones] = useState(US_CA_TIMEZONES);
  const [customBaseSlots, setCustomBaseSlots] = useState(null);
  const [today, setToday] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(US_CA_TIMEZONES[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [isAllDayBlocked, setIsAllDayBlocked] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [staleWarning, setStaleWarning] = useState('');

  const isOption2 = bookingVersion === 'option2';

  const visitStartTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchTimezonesApi().then((tzData) => {
      if (tzData?.timezones?.length) {
        setTimezones(tzData.timezones);
        setSelectedTimezone((p) => tzData.timezones.find((t) => t.id === p.id) || tzData.timezones[0]);
      }
      if (Array.isArray(tzData?.basePacificMinutesSlots) && tzData.basePacificMinutesSlots.length === 48) {
        setCustomBaseSlots(tzData.basePacificMinutesSlots);
      }
      if (tzData?.bookingVersion && !getInitialVersionOverride()) {
        setBookingVersion(tzData.bookingVersion);
      }
    });

    fetchBookingPageSettingApi().then((data) => {
      if (data?.bookingVersion && !getInitialVersionOverride()) {
        setBookingVersion(data.bookingVersion);
      }
    });
  }, []);

  // Update website title based on active version (Option 1: keep original, Option 2: Schedule a Real-Time)
  useEffect(() => {
    document.title = isOption2 ? 'Schedule a Real-Time' : 'Booking Realtime Chat Time';
  }, [isOption2]);

  const verifyToken = useCallback(async (tokenToVerify) => {
    if (!tokenToVerify) return;
    setIsVerifying(true);
    setTokenError('');
    try {
      const res = await fetchInviteInfoApi(tokenToVerify);
      setContact(res.contact || null);
      setExistingBooking(res.existingBooking || null);
      const isUnsub = Boolean(res.contact?.unsubscribed || res.contact?.status === 'archived');
      setIsUnsubscribed(isUnsub);
      if (res.serverTime) {
        const sDate = new Date(res.serverTime);
        if (!isNaN(sDate.getTime())) {
          setToday(sDate);
          setSelectedDate(sDate);
        }
      }
    } catch (err) {
      setContact(null);
      setExistingBooking(null);
      setIsUnsubscribed(false);
      setTokenError(err?.message || 'Invalid or expired invitation.');
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (token) verifyToken(token);
  }, [token, verifyToken]);

  useEffect(() => {
    if (!token) return;
    visitStartTimeRef.current = Date.now();
    const report = () => {
      const sec = Math.round((Date.now() - visitStartTimeRef.current) / 1000);
      if (sec > 0) {
        sendTrackDurationApi(token, sec);
        visitStartTimeRef.current = Date.now();
      }
    };
    const timer = setInterval(report, 60000);
    const onHide = () => { if (document.visibilityState === 'hidden') report(); };
    window.addEventListener('beforeunload', report);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(timer);
      window.removeEventListener('beforeunload', report);
      document.removeEventListener('visibilitychange', onHide);
      report();
    };
  }, [token]);

  const loadAvailability = useCallback(async () => {
    if (!selectedDate) return;
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const res = await fetchUnavailableSlotsApi(`${y}-${m}-${d}`, token);
    setUnavailableSlots(res.bookedTimes || []);
    setIsAllDayBlocked(res.isAllDayBlocked || false);
    if (Array.isArray(res.blockedDates)) {
      setBlockedDates(res.blockedDates);
    }
    if (selectedSlot && res.bookedTimes?.includes(selectedSlot.time)) {
      setSelectedSlot(null);
      setStaleWarning('The selected slot was just booked. Please pick another.');
    }
  }, [selectedDate, token, selectedSlot]);

  useEffect(() => {
    loadAvailability();
  }, [selectedDate, token]);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }, [selectedDate]);

  const fullSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [selectedDate]);

  const handleTokenSubmit = (newToken) => {
    setToken(newToken);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', `/${encodeURIComponent(newToken)}`);
    }
  };

  const handleQuickTokenSubmit = (e) => {
    e.preventDefault();
    const trimmed = quickTokenInput.trim();
    if (!trimmed) return;
    let extracted = trimmed;
    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const urlObj = new URL(trimmed);
        const queryToken = urlObj.searchParams.get('token');
        if (queryToken) extracted = queryToken.trim();
        else {
          const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, '');
          if (pathname) {
            const parts = pathname.split('/');
            extracted = parts[parts.length - 1].trim();
          }
        }
      }
    } catch {}
    if (trimmed.includes('token=')) {
      const match = trimmed.match(/token=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) extracted = match[1];
    }
    setToken(extracted);
    verifyToken(extracted);
  };

  const handleBookingSuccess = (newBooking) => {
    setExistingBooking(newBooking);
    setIsRescheduling(false);
  };

  const handleSlotConflict = () => {
    loadAvailability();
    setSelectedSlot(null);
    setStaleWarning('This time slot was just booked. The schedule has been refreshed with current availability.');
  };

  const handleUnsubscribeConfirm = async () => {
    if (!token) return;
    setIsUnsubscribing(true);
    try {
      await unsubscribeApi(token);
      setIsUnsubscribed(true);
      setIsUnsubscribeModalOpen(false);
      setContact((prev) => (prev ? { ...prev, unsubscribed: true, status: 'archived' } : prev));
      setExistingBooking((prev) => (prev ? { ...prev, status: 'archived', unsubscribed: true } : null));
    } catch (err) {
      alert(err?.message || 'Failed to unsubscribe. Please try again.');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleResubscribe = async () => {
    if (!token) return;
    setIsResubscribing(true);
    setResubscribeError('');
    try {
      await resubscribeApi(token);
      setIsUnsubscribed(false);
      setContact((prev) => (prev ? { ...prev, unsubscribed: false, status: 'replied' } : prev));
      if (existingBooking) {
        setExistingBooking((prev) => (prev ? { ...prev, unsubscribed: false } : null));
      }
    } catch (err) {
      setResubscribeError(err?.message || 'Failed to resubscribe. Please try again.');
    } finally {
      setIsResubscribing(false);
    }
  };

  // 1. Show lazyloading skeleton while verifying token via API
  if (isVerifying) {
    return <BookingSkeleton />;
  }

  // 2. Option 1: If no token, or invalid visit (tokenError), show wide InvitationEntry
  if (!isOption2 && (!token || tokenError || !contact)) {
    return (
      <main className="min-h-screen bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <InvitationEntry
          onTokenSubmit={handleTokenSubmit}
          errorMessage={tokenError}
          isLoading={isVerifying}
        />
      </main>
    );
  }

  // 3. If unsubscribed, show warm UnsubscribedConfirmationView with Subscribe Again action
  if (isUnsubscribed) {
    return (
      <main className="min-h-screen bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <UnsubscribedConfirmationView
          contact={contact}
          onResubscribe={handleResubscribe}
          isLoading={isResubscribing}
          error={resubscribeError}
        />
      </main>
    );
  }

  if (existingBooking && !isRescheduling) {
    return (
      <main className="min-h-screen bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <ScheduledAppointmentView
          booking={existingBooking}
          contact={contact}
          onReschedule={() => setIsRescheduling(true)}
          onUnsubscribe={!isOption2 ? () => setIsUnsubscribeModalOpen(true) : null}
          isOption2={isOption2}
        />
        {!isOption2 && (
          <UnsubscribeModal
            isOpen={isUnsubscribeModalOpen}
            onClose={() => setIsUnsubscribeModalOpen(false)}
            onConfirm={handleUnsubscribeConfirm}
            isLoading={isUnsubscribing}
            contactName={contact?.fullName || ''}
          />
        )}
      </main>
    );
  }

  const pageTitle = isOption2
    ? 'Schedule a Real-Time'
    : (contact?.fullName
      ? `Schedule a Real-Time Chat with ${contact.fullName}`
      : 'Schedule a Real-Time Chat');

  return (
    <main className="min-h-screen bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1380px] bg-[#f6f8f7] rounded-3xl shadow-sm border border-gray-200/80 p-4 sm:p-6 lg:p-8 transition-all">

        {isOption2 && tokenError && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2">
            <span>{tokenError} You can still schedule an appointment below directly.</span>
            <button
              type="button"
              onClick={() => setTokenError('')}
              className="text-amber-700 font-bold px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {isRescheduling && existingBooking && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
            <div>
              <strong>Reschedule Mode:</strong> You currently have a chat booked for{' '}
              <span className="font-semibold">{existingBooking.dateFormatted || existingBooking.date} at {existingBooking.timeSlot || existingBooking.time}</span>.
              Selecting and confirming a new time will reschedule your chat.
            </div>
            <button
              type="button"
              onClick={() => setIsRescheduling(false)}
              className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 transition whitespace-nowrap cursor-pointer"
            >
              Cancel Reschedule
            </button>
          </div>
        )}

        {staleWarning && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{staleWarning}</span>
            </div>
            <button
              type="button"
              onClick={() => setStaleWarning('')}
              className="text-xs text-red-500 hover:text-red-700 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex justify-between max-lg:flex-col gap-8 lg:gap-10">
          <div className="flex-grow border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a4b37] font-serif leading-tight">
                  {pageTitle}
                </h1>
                {!isOption2 && (
                  <button
                    type="button"
                    onClick={() => setIsUnsubscribeModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 shadow-2xs"
                    title="Unsubscribe from invitations"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                    <span>Unsubscribe</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm sm:text-base text-gray-700">
                  <Clock className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 mr-2">Duration:</span>
                  <span>30 minutes</span>
                </div>

                {!isOption2 && (
                  <div className="flex items-center text-sm sm:text-base text-gray-700">
                    <MessageSquare className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900 mr-2">Conferencing:</span>
                    <span>Slack</span>
                  </div>
                )}
              </div>
            </div>

            <RealtimeChatIllustration hideBadges={isOption2} />

            <div className="mt-2 p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl text-xs sm:text-sm text-[#0369a1]">
              <div className="flex items-center font-semibold text-[#0c4a6e] mb-1">
                <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0 text-[#0284c7]" />
                <span>{fullSelectedDate}</span>
              </div>
              <div className="text-[#0369a1] font-medium">
                {selectedSlot ? `${selectedSlot.timeSlot} (30 min)` : 'Select an available 30-min slot'}
              </div>
              <div className="text-xs text-[#0284c7] mt-0.5 truncate">
                {selectedTimezone.utcOffset} {selectedTimezone.name}
              </div>
            </div>
          </div>

          <div className="max-lg:w-full lg:max-w-[768px] flex flex-col justify-between">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <CalendarWithSlots
                today={today}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                  setStaleWarning('');
                }}
                selectedTimezone={selectedTimezone}
                onSelectTimezone={(tz) => {
                  setSelectedTimezone(tz);
                  setSelectedSlot(null);
                }}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  setStaleWarning('');
                }}
                formattedSelectedDate={formattedSelectedDate}
                unavailableSlots={unavailableSlots}
                isAllDayBlocked={isAllDayBlocked}
                customBaseSlots={customBaseSlots}
                blockedDates={blockedDates}
              />
            </div>

            <div className="mt-2 pt-6 border-t border-gray-200 bg-white rounded-xl shadow-sm p-4">
              <InlineBookingForm
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                selectedTimezone={selectedTimezone}
                formattedDate={fullSelectedDate}
                contact={contact}
                token={token}
                isReschedule={isRescheduling}
                isOption2={isOption2}
                onBookingSuccess={handleBookingSuccess}
                onSlotConflict={handleSlotConflict}
              />
            </div>
          </div>
        </div>

        {!isOption2 && (
          <UnsubscribeModal
            isOpen={isUnsubscribeModalOpen}
            onClose={() => setIsUnsubscribeModalOpen(false)}
            onConfirm={handleUnsubscribeConfirm}
            isLoading={isUnsubscribing}
            contactName={contact?.fullName || ''}
          />
        )}
      </div>
    </main>
  );
}

