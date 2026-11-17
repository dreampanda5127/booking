import React from 'react';
import { BellOff, Loader2, AlertTriangle, X } from 'lucide-react';

export default function UnsubscribeModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  contactName = '',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 max-w-md w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <BellOff className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">
          Unsubscribe from Invitations?
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {contactName ? `Hi ${contactName}, if ` : 'If '}
          you unsubscribe, you will no longer receive invitations or scheduling reminders for real-time chats.
          You can always resubscribe at any time to pick a convenient slot whenever you're ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          >
            Keep My Subscription
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Unsubscribing...</span>
              </>
            ) : (
              <span>Yes, Unsubscribe</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
