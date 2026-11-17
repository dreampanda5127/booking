import React from 'react';
import ChatIllustrationSvg from './ChatIllustrationSvg';

export default function RealtimeChatIllustration({ hideBadges = true }) {
  return (
    <div className="my-5 w-full">
      <div className="relative bg-gradient-to-b from-white via-[#f4faf7] to-[#eaf5ef] rounded-2xl p-4 border border-[#d1e7dd] shadow-xs overflow-hidden">
        {/* Soft ambient background glows */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#10b981]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#0a4b37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* SVG Graphic */}
        <div className="w-full flex justify-center">
          <ChatIllustrationSvg />
        </div>
      </div>
    </div>
  );
}

