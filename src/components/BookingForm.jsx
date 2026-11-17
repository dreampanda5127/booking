import React, { useState } from 'react';
import { TextInput, Textarea, Label, Spinner } from 'flowbite-react';
import { Clock, MessageSquare, Calendar, Globe, ArrowLeft } from 'lucide-react';
import { createBookingApi } from '../services/api';

export default function BookingForm({
  selectedDate,
  selectedSlot,
  selectedTimezone,
  formattedDate,
  onBack,
  onBookingSuccess,
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
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
        conferencing: 'Slack',
      };

      const result = await createBookingApi(payload);
      onBookingSuccess(result.data || payload);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-1">
      <button
        onClick={onBack}
        type="button"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#0a4b37] mb-5 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to calendar
      </button>

      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 mb-5 text-sm text-gray-800 space-y-1.5">
        <div className="flex items-center font-semibold text-gray-900">
          <Calendar className="w-4 h-4 mr-2 text-[#0a4b37]" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-[#0a4b37]" />
          <span>{selectedSlot.timeSlot} &bull; 30 min</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Globe className="w-4 h-4 mr-2 text-[#0a4b37]" />
          <span>{selectedTimezone.label}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <MessageSquare className="w-4 h-4 mr-2 text-[#0a4b37]" />
          <span>Conferencing: <strong className="ml-1 text-gray-900">Slack</strong></span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-1 block">
            <Label htmlFor="fullName" value="Full name *" className="text-sm font-semibold" />
          </div>
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
          <div className="mb-1 block">
            <Label htmlFor="email" value="Email address *" className="text-sm font-semibold" />
          </div>
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

        <div>
          <div className="mb-1 block">
            <Label htmlFor="message" value="Message" className="text-sm font-semibold" />
          </div>
          <Textarea
            id="message"
            placeholder="Please share anything that will help prepare for our chat..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-[#0a4b37] hover:bg-[#073d2c] transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" light={true} className="mr-2" />
              <span>Scheduling chat time...</span>
            </>
          ) : (
            <span>Schedule Event</span>
          )}
        </button>
      </form>
    </div>
  );
}
