import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Search, ChevronDown, Check, X } from 'lucide-react';
import { US_CA_TIMEZONES } from '../constants/timezones';

export default function TimezoneFilterSelector({ selectedTimezone, onSelectTimezone }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter timezones based on query
  const filteredTimezones = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return US_CA_TIMEZONES;

    return US_CA_TIMEZONES.filter((tz) => {
      const matchName = tz.name.toLowerCase().includes(q);
      const matchLabel = tz.label.toLowerCase().includes(q);
      const matchUtc = tz.utcOffset.toLowerCase().includes(q);
      const matchLocations = tz.locations.some((loc) => loc.toLowerCase().includes(q));
      return matchName || matchLabel || matchUtc || matchLocations;
    });
  }, [searchQuery]);

  const handleSelect = (tz) => {
    onSelectTimezone(tz);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
        <span className="flex items-center">
          <Globe className="w-3.5 h-3.5 mr-1 text-[#0a4b37]" />
          Timezone (US &amp; Canada)
        </span>
        <span className="text-[11px] font-normal text-gray-500">Filter by city/state</span>
      </label>

      {/* Button to toggle dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white border border-gray-300 hover:border-[#0a4b37] rounded-xl py-2 px-3 text-xs sm:text-sm text-gray-800 flex items-center justify-between transition focus:ring-1 focus:ring-[#0a4b37] shadow-sm"
      >
        <span className="truncate font-medium">{selectedTimezone.label}</span>
        <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown with Search Filter */}
      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/80">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, state, province or timezone (e.g. Toronto, Seattle, Chicago)..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#0a4b37] focus:ring-1 focus:ring-[#0a4b37]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Timezone Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
            {filteredTimezones.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-500">
                No matching US/Canada timezone or city found.
              </div>
            ) : (
              filteredTimezones.map((tz) => {
                const isSelected = selectedTimezone.id === tz.id;
                return (
                  <button
                    key={tz.id}
                    type="button"
                    onClick={() => handleSelect(tz)}
                    className={`w-full text-left px-3 py-2.5 text-xs transition flex items-start justify-between ${
                      isSelected
                        ? 'bg-[#e8f6ef] text-[#0a4b37] font-semibold'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold">{tz.name}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                          {tz.utcOffset}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[280px]">
                        {tz.locations.slice(0, 8).join(', ')}...
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0a4b37] flex-shrink-0 mt-0.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
