import React from 'react';

export default function ChatIllustrationSvg() {
  return (
    <svg
      viewBox="0 0 440 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-h-[210px] select-none"
    >
      <defs>
        <linearGradient id="laptopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <linearGradient id="hostGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="guestGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a4b37" />
          <stop offset="100%" stopColor="#146049" />
        </linearGradient>
        <filter id="cShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" floodColor="#0a4b37" />
        </filter>
        <filter id="fShadow" x="-15%" y="-15%" width="135%" height="135%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.1" floodColor="#0a4b37" />
        </filter>
      </defs>

      {/* Laptop & Screen */}
      <g filter="url(#cShadow)">
        <rect x="70" y="16" width="300" height="158" rx="10" fill="url(#laptopGrad)" />
        <rect x="78" y="24" width="284" height="142" rx="7" fill="url(#screenGrad)" />
        <path d="M 40 174 L 400 174 C 405 174 408 178 406 182 L 396 190 C 394 192 390 193 386 193 L 54 193 C 50 193 46 192 44 190 L 34 182 C 32 178 35 174 40 174 Z" fill="#334155" />
        <rect x="195" y="174" width="50" height="3" rx="1.5" fill="#64748b" />
      </g>

      {/* Screen Top Bar */}
      <rect x="78" y="24" width="284" height="23" rx="7" fill="#0a4b37" />
      <circle cx="90" cy="35" r="3" fill="#ef4444" />
      <circle cx="100" cy="35" r="3" fill="#f59e0b" />
      <circle cx="110" cy="35" r="3" fill="#10b981" />
      <text x="128" y="39" fill="#e8f6ef" fontSize="9.5" fontWeight="600" fontFamily="sans-serif"># real-time-chat</text>
      <circle cx="348" cy="35" r="3" fill="#34d399" className="anim-chat-pulse" />
      <text x="318" y="38.5" fill="#a7f3d0" fontSize="8" fontWeight="500" fontFamily="sans-serif">Slack Live</text>

      {/* Host Message */}
      <g transform="translate(90, 53)">
        <circle cx="12" cy="12" r="12" fill="url(#hostGrad)" />
        <circle cx="12" cy="9" r="3" fill="#fff" />
        <path d="M 6 18 C 6 15 9 14 12 14 C 15 14 18 15 18 18 Z" fill="#fff" />
        <rect x="30" y="0" width="168" height="34" rx="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="38" y="12" fill="#0a4b37" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Host</text>
        <text x="64" y="12" fill="#94a3b8" fontSize="7" fontFamily="sans-serif">12:00 PM</text>
        <text x="38" y="25" fill="#334155" fontSize="9" fontFamily="sans-serif">Hi! Ready for our 1:1 chat 👋</text>
      </g>

      {/* Guest Message */}
      <g transform="translate(148, 95)">
        <rect x="0" y="0" width="162" height="32" rx="7" fill="url(#guestGrad)" />
        <text x="10" y="12" fill="#86efac" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">You</text>
        <text x="32" y="12" fill="#a7f3d0" fontSize="7" fontFamily="sans-serif">12:01 PM</text>
        <text x="10" y="24" fill="#ffffff" fontSize="9" fontFamily="sans-serif">Looking forward to connecting! 🚀</text>
        <g transform="translate(170, 0)">
          <circle cx="12" cy="12" r="12" fill="#2563eb" />
          <circle cx="12" cy="9" r="3" fill="#fff" />
          <path d="M 6 18 C 6 15 9 14 12 14 C 15 14 18 15 18 18 Z" fill="#fff" />
        </g>
      </g>

      {/* Typing Indicator */}
      <g transform="translate(122, 134)">
        <rect x="0" y="0" width="46" height="17" rx="8.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="13" cy="8.5" r="2" fill="#059669" className="anim-chat-d1" />
        <circle cx="23" cy="8.5" r="2" fill="#059669" className="anim-chat-d2" />
        <circle cx="33" cy="8.5" r="2" fill="#059669" className="anim-chat-d3" />
      </g>

      {/* Floating Badge Left */}
      <g filter="url(#fShadow)" className="anim-chat-up">
        <rect x="8" y="56" width="108" height="28" rx="14" fill="#ffffff" stroke="#d1fae5" strokeWidth="1" />
        <circle cx="23" cy="70" r="7" fill="#e8f6ef" />
        <path d="M 23 66 L 23 70 L 26 71.5" stroke="#0a4b37" strokeWidth="1.2" strokeLinecap="round" />
        <text x="36" y="68.5" fill="#0a4b37" fontSize="8" fontWeight="700" fontFamily="sans-serif">30-Min Direct</text>
        <text x="36" y="78" fill="#64748b" fontSize="6.5" fontFamily="sans-serif">1-on-1 Session</text>
      </g>

      {/* Floating Badge Right */}
      <g filter="url(#fShadow)" className="anim-chat-down">
        <rect x="324" y="52" width="108" height="28" rx="14" fill="#ffffff" stroke="#e0e7ff" strokeWidth="1" />
        <circle cx="339" cy="66" r="7" fill="#e8f6ef" />
        <text x="336.5" y="70" fill="#0a4b37" fontSize="10" fontWeight="bold" fontFamily="sans-serif">#</text>
        <text x="352" y="65" fill="#0a4b37" fontSize="8" fontWeight="700" fontFamily="sans-serif">Slack Sync</text>
        <text x="352" y="74.5" fill="#10b981" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">● Instant Invite</text>
      </g>
    </svg>
  );
}
