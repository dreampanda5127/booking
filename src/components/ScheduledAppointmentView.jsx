import React from 'react';
import {
  Calendar,
  Clock,
  Globe,
  MessageSquare,
  User,
  CheckCircle2,
  CalendarCheck,
  RotateCcw,
} from 'lucide-react';
import RealtimeChatIllustration from './RealtimeChatIllustration';

export default function ScheduledAppointmentView({
  booking,
  contact,
  onReschedule,
  onUnsubscribe,
  isOption2 = false,
}) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-10 transition-all">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#e8f6ef] text-[#0a4b37] rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
          <CalendarCheck className="w-7 h-7 text-[#0a4b37]" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f6ef] text-[#0a4b37] mb-2 uppercase tracking-wide">
          Appointment Confirmed
        </span>
        {
          isOption2 ? "" :
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-2">
              Your Real-Time Chat is Scheduled
            </h1>
        }
        <p className="text-sm text-gray-600">
          {isOption2
            ? 'Your appointment has been confirmed. Details of your scheduled session are below:'
            : 'You will receive an invitation link from our primary email shortly. Please check your mailbox. Details of your appointment are below:'}
        </p>
      </div>

      <RealtimeChatIllustration hideBadges={isOption2} />

      {/* Reschedule Button Layout placed ABOVE details */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-gray-50/90 border border-gray-200/80 rounded-2xl my-4">
        <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Need to change your chat time? You can reschedule your appointment above.
        </p>

        <button
          type="button"
          onClick={onReschedule}
          className="w-full sm:w-auto py-2 px-5 rounded-xl font-semibold text-xs sm:text-sm text-[#0a4b37] bg-white border border-[#0a4b37] hover:bg-[#e8f6ef] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reschedule</span>
        </button>
      </div>

      <div className="bg-[#f8faf9] border border-gray-200/90 rounded-2xl p-5 sm:p-6 text-left space-y-4 my-6 shadow-2xs">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {booking.dateFormatted || booking.date}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Clock className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time & Duration</div>
            <div className="text-sm sm:text-base font-semibold text-gray-900">
              {booking.timeSlot || booking.time} ({booking.duration || '30 min'})
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <Globe className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timezone</div>
            <div className="text-sm text-gray-800">{booking.timezone}</div>
          </div>
        </div>

        {!isOption2 && (
          <div className="flex items-start">
            <MessageSquare className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conferencing</div>
              <div className="text-sm font-semibold text-gray-900">
                {booking.conferencing || 'Slack'}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start border-t border-gray-200/60 pt-3">
          <User className="w-5 h-5 mr-3 text-[#0a4b37] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Participant</div>
            <div className="text-sm text-gray-900 font-medium">
              {booking.fullName} &bull; <span className="text-gray-600">{booking.email}</span>
            </div>
          </div>
        </div>

        {booking.message && (
          <div className="border-t border-gray-200/60 pt-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message Note</div>
            <p className="text-xs sm:text-sm text-gray-700 italic bg-white p-2.5 rounded-lg border border-gray-200">
              "{booking.message}"
            </p>
          </div>
        )}
      </div>

      {!isOption2 && onUnsubscribe && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onUnsubscribe}
            className="text-xs text-gray-400 hover:text-red-600 transition underline underline-offset-4 cursor-pointer"
          >
            No longer wish to receive chat invitations? Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
}
