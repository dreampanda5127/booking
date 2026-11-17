import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Label, Spinner } from 'flowbite-react';
import { Clock, Globe, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { createBookingApi } from '../services/api';

export default function InlineBookingForm({
  selectedDate,
  selectedSlot,
  selectedTimezone,
  formattedDate,
  contact = null,
  token = '',
  isReschedule = false,
  onBookingSuccess,
  onSlotConflict,
}) {
  const [fullName, setFullName] = useState(contact?.fullName || '');
  const [email, setEmail] = useState(contact?.contactEmail || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    if (contact?.fullName) setFullName(contact.fullName);
    if (contact?.contactEmail) setEmail(contact.contactEmail);
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedSlot) return setErrorMessage('Please select a 30-minute time slot first.');
    if (!fullName.trim()) return setErrorMessage('Full name is required.');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setErrorMessage('Please enter a valid email address.');
    }

    setIsSubmitting(true);
    try {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');

      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        message: message.trim(),
        date: `${y}-${m}-${d}`,
        dateFormatted: formattedDate,
        time: selectedSlot.time,
        timeSlot: selectedSlot.timeSlot,
        timezone: selectedTimezone.label,
        timezoneOffset: `${selectedTimezone.offsetMinutes}`,
        duration: '30 min',
        conferencing: 'Real-Time Chat',
        token: token || '',
        isReschedule: Boolean(isReschedule),
      };

      const result = await createBookingApi(payload);
      const data = result?.data || payload;
      setConfirmed(data);
      if (onBookingSuccess) onBookingSuccess(data);
    } catch (err) {
      const errMsg = err?.message || 'Failed to submit booking. Please try again.';
      setErrorMessage(errMsg);
      // Stale calendar or conflict detection
      if (err?.status === 409 || errMsg.toLowerCase().includes('already booked') || errMsg.toLowerCase().includes('unavailable')) {
        if (onSlotConflict) onSlotConflict();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (confirmed) {
    return (
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 text-center">
        <div className="w-10 h-10 bg-[#0a4b37] text-white rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Chat Time Confirmed!</h3>
        <p className="text-sm text-gray-600 mb-6">
          Your appointment has been successfully scheduled. Please check your mailbox (<strong className="text-gray-900">{confirmed.email}</strong>) for confirmation details. We look forward to connecting with you.
        </p>
        <div className="bg-white rounded-xl p-3 text-left text-xs text-gray-700 space-y-1 border border-[#86efac] mb-3">
          <div><strong>Name:</strong> {confirmed.fullName}</div>
          <div><strong>Date:</strong> {confirmed.dateFormatted || formattedDate}</div>
          <div><strong>Time:</strong> {confirmed.timeSlot || selectedSlot.timeSlot} (30 min)</div>
          <div><strong>Timezone:</strong> {selectedTimezone.utcOffset} {selectedTimezone.shortName}</div>
        </div>
        <button
          type="button"
          onClick={() => { setConfirmed(null); setFullName(''); setEmail(''); setMessage(''); }}
          className="inline-flex items-center text-xs font-semibold text-[#0a4b37] bg-white border border-[#0a4b37] rounded-xl px-3 py-1.5 hover:bg-[#e8f6ef]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Book Another Time
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
        <span>Enter Details</span>
        {selectedSlot && (
          <span className="text-[11px] text-[#0a4b37] bg-[#e8f6ef] px-2 py-0.5 rounded-full font-semibold">
            30 min: {selectedSlot.time}
          </span>
        )}
      </h2>

      {selectedSlot ? (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-2.5 mb-3 text-xs text-gray-800 space-y-0.5">
          <div className="font-semibold text-[#0a4b37] flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span>{formattedDate} &bull; {selectedSlot.timeSlot}</span>
          </div>
          <div className="text-gray-600 flex items-center text-[11px]">
            <Globe className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-gray-400" />
            <span className="truncate">{selectedTimezone.label}</span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-xs text-amber-800">
          Select a 30-minute time slot to proceed.
        </div>
      )}

      {errorMessage && (
        <div className="mb-2.5 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fullName" value="Full name *" className="text-xs font-semibold text-gray-700 mb-1 block" />
            <TextInput
              id="fullName"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email address *" className="text-xs font-semibold text-gray-700 mb-1 block" />
            <TextInput
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message" value="Message" className="text-xs font-semibold text-gray-700 mb-1 block" />
          <Textarea
            id="message"
            placeholder="Share anything to prepare for our chat..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="resize-none text-xs p-2 min-h-16"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <div className="text-[11px] text-gray-500">
            Duration: <strong className="text-gray-800">30 min</strong>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !selectedSlot}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#0a4b37] hover:bg-[#073d2c] transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" light={true} className="mr-1.5" />
                <span>Scheduling...</span>
              </>
            ) : (
              <span>Confirm 30-min Booking</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

