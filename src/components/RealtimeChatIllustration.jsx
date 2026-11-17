import React from 'react';
import { MessageSquare, Zap, ShieldCheck } from 'lucide-react';
import ChatIllustrationSvg from './ChatIllustrationSvg';

export default function RealtimeChatIllustration({ hideBadges = false }) {
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

        {/* Feature Highlights Grid - hidden in Option 2 */}
        {!hideBadges && (
          <div className="mt-3 pt-3 border-t border-emerald-900/10 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xs rounded-lg px-2.5 py-1.5 border border-emerald-900/5">
              <Zap className="w-3.5 h-3.5 text-[#0a4b37] flex-shrink-0" />
              <span className="text-[11px] font-medium text-gray-700">Instant Slack Link</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xs rounded-lg px-2.5 py-1.5 border border-emerald-900/5">
              <MessageSquare className="w-3.5 h-3.5 text-[#0a4b37] flex-shrink-0" />
              <span className="text-[11px] font-medium text-gray-700">1-on-1 Real-Time Chat</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xs rounded-lg px-2.5 py-1.5 border border-emerald-900/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0a4b37] flex-shrink-0" />
              <span className="text-[11px] font-medium text-gray-700">Auto Timezone Sync</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

