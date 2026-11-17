import React from 'react';
import { CheckCircle2, Calendar, Clock, Globe, Mail, User } from 'lucide-react';

export default function BookingConfirmation({ bookingData, onBookAnother }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center py-6">
      <div className="w-16 h-16 bg-[#e8f6ef] text-[#0a4b37] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
        <CheckCircle2 className="w-10 h-10 text-[#0a4b37]" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're Confirmed!
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Your appointment has been successfully scheduled. Please check your mailbox (<strong className="text-gray-900">{bookingData.email}</strong>) for confirmation details. We look forward to connecting with you.
      </p>

      {/* Details Box */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm space-y-4 mb-8">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Date</div>
            <div className="text-sm font-semibold text-gray-900">
              {bookingData.dateFormatted || bookingData.date}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Time & Duration</div>
            <div className="text-sm font-semibold text-gray-900">
              {bookingData.timeSlot || bookingData.time} ({bookingData.duration || '30 min'})
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Globe className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Timezone</div>
            <div className="text-sm text-gray-800">{bookingData.timezone}</div>
          </div>
        </div>

        <div className="flex items-start">
          <User className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">Booked by</div>
            <div className="text-sm text-gray-800">
              {bookingData.fullName} &bull; {bookingData.email}
            </div>
          </div>
        </div>

        {bookingData.message && (
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</div>
            <p className="text-sm text-gray-700 italic bg-gray-50 p-2.5 rounded-lg">
              "{bookingData.message}"
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onBookAnother}
        type="button"
        className="py-3 px-8 rounded-xl font-semibold text-white bg-[#0a4b37] hover:bg-[#073d2c] transition shadow-sm hover:shadow"
      >
        Schedule Another Time
      </button>
    </div>
  );
}
