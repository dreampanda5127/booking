import React from 'react';
import {
  BellOff,
  RotateCcw,
  Heart,
  Calendar,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import RealtimeChatIllustration from './RealtimeChatIllustration';

export default function UnsubscribedConfirmationView({
  contact,
  onResubscribe,
  isLoading = false,
  error = '',
}) {
  const contactName = contact?.fullName || 'there';
  const email =
    contact?.contactEmail ||
    (Array.isArray(contact?.contactEmails) && contact.contactEmails[0]) ||
    '';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-10 transition-all text-center">
      {/* Warm Header Badge */}
      <div className="w-16 h-16 bg-[#f3f4f6] text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
        <BellOff className="w-8 h-8 text-gray-500" />
      </div>

      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-2 uppercase tracking-wide">
        Unsubscribed
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-3">
        You're Unsubscribed from Invitations
      </h1>

      <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed mb-6">
        Hi <strong className="text-gray-900">{contactName}</strong>, we have updated your preferences.
        You will no longer receive real-time chat invitations or reminders from us.
      </p>

      <RealtimeChatIllustration />

      {/* Warm, friendly reassurance box */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 sm:p-6 text-left my-6 shadow-2xs">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs sm:text-sm text-[#14532d] leading-relaxed">
            <p className="font-semibold text-[#166534]">
              We respect your time and preferences!
            </p>
            <p>
              We completely understand if now isn't the right time. Our calendar is always open to you whenever you're ready.
              You can subscribe again at any time to pick a convenient slot that fits your schedule.
            </p>
            <p className="text-[#15803d] flex items-center gap-1.5 pt-1 font-medium">
              <Sparkles className="w-4 h-4 text-[#16a34a]" />
              We'd love to connect whenever you are ready!
            </p>
          </div>
        </div>
      </div>

      {email && (
        <div className="text-xs text-gray-500 mb-6">
          Preferences applied to: <span className="font-mono text-gray-700 font-medium">{email}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action: Subscribe Again */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onResubscribe}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#0a4b37] hover:bg-[#073627] active:bg-[#05291e] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Resubscribing...</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Subscribe Again to Pick a Time</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        Clicking "Subscribe Again" instantly re-enables your invitation link and takes you straight to the scheduling calendar.
      </p>
    </div>
  );
}
