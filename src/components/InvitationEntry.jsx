import React, { useState } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { TextInput, Spinner } from 'flowbite-react';
import RealtimeChatIllustration from './RealtimeChatIllustration';

export default function InvitationEntry({ onTokenSubmit, errorMessage, isLoading }) {
  const [tokenInput, setTokenInput] = useState('');
  const [inputError, setInputError] = useState('');

  const extractToken = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return '';

    // Check if it's a full URL
    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const urlObj = new URL(trimmed);
        const queryToken = urlObj.searchParams.get('token');
        if (queryToken) return queryToken.trim();

        const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, '');
        if (pathname) {
          const parts = pathname.split('/');
          return parts[parts.length - 1].trim();
        }
      }
    } catch {
      // Treat as raw token
    }

    if (trimmed.includes('token=')) {
      const match = trimmed.match(/token=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return match[1];
    }

    return trimmed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError('');
    const token = extractToken(tokenInput);

    if (!token) {
      setInputError('Please enter your invitation link or access token.');
      return;
    }

    onTokenSubmit(token);
  };

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 sm:p-10 lg:p-12 transition-all">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#e8f6ef] text-[#0a4b37] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a4b37] font-serif mb-2 tracking-tight whitespace-normal sm:whitespace-nowrap">
          Real-Time Chat — Invitation Access
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto whitespace-normal lg:whitespace-nowrap">
          Please enter your personalized invitation link or access token below to schedule your private chat.
        </p>
      </div>

      <RealtimeChatIllustration />

      {(errorMessage || inputError) && (
        <div className="my-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center justify-center gap-2.5 text-center max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span className="font-semibold whitespace-normal sm:whitespace-nowrap">
            {inputError || errorMessage}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl mx-auto">
        <label htmlFor="token-input" className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Invitation Link or Access Token
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <TextInput
              id="token-input"
              type="text"
              placeholder="Paste invitation link or token (e.g. https://schedule-nextech.vercel.app/your-token)"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                if (inputError) setInputError('');
              }}
              disabled={isLoading}
              required
              autoFocus
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !tokenInput.trim()}
            className="w-full sm:w-auto whitespace-nowrap py-2.5 sm:py-3 px-8 rounded-xl font-semibold text-sm text-white bg-[#0a4b37] hover:bg-[#073d2c] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" light={true} />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Access Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4 text-[#0a4b37]" />
        <span>Secured individual invitation access &bull; NexTech Scheduling System</span>
      </div>
    </div>
  );
}

