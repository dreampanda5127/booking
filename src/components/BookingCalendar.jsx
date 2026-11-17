import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MessageSquare, Info } from 'lucide-react';
import { US_CA_TIMEZONES, getTimeSlotsForTimezone } from '../constants/timezones';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BookingCalendar({ onSelectSlot }) {
  const today = useMemo(() => new Date(2026, 9, 24), []);
  const [currentViewDate, setCurrentViewDate] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 28));
  const [selectedTimezone, setSelectedTimezone] = useState(US_CA_TIMEZONES[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = useMemo(() => getTimeSlotsForTimezone(selectedTimezone), [selectedTimezone]);
  const monthHeader = `${MONTH_NAMES[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;
  const isCurrentMonthView =
    currentViewDate.getFullYear() === today.getFullYear() &&
    currentViewDate.getMonth() === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonthView) return;
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, disabled: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const isPast = dateObj < today;
      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === d;

      days.push({
        dayNumber: d,
        dateObj,
        disabled: isPast,
        isSelected,
      });
    }
    return days;
  }, [currentViewDate, today, selectedDate]);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate]);

  const fullSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDate]);

  const handleConfirmSlot = () => {
    if (selectedSlot) {
      onSelectSlot({
        date: selectedDate,
        formattedDate: fullSelectedDate,
        slot: selectedSlot,
        timezone: selectedTimezone,
      });
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
      {/* Left Column: Title, Duration, Conferencing */}
      <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a4b37] font-serif leading-tight mb-8">
            Booking Realtime Chat Time
          </h1>

          <div className="space-y-4">
            <div className="flex items-center text-sm sm:text-base text-gray-700">
              <Clock className="w-5 h-5 text-gray-800 mr-3.5 flex-shrink-0" />
              <span className="font-semibold text-gray-900 mr-2">Duration:</span>
              <span>30 minutes</span>
            </div>

            <div className="flex items-center text-sm sm:text-base text-gray-700">
              <MessageSquare className="w-5 h-5 text-gray-800 mr-3.5 flex-shrink-0" />
              <span className="font-semibold text-gray-900 mr-2">Conferencing:</span>
              <span>Slack</span>
            </div>
          </div>
        </div>

        {/* Selected Slot Notice */}
        {selectedSlot ? (
          <div className="mt-8 p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl flex items-start text-sm text-[#0369a1]">
            <Info className="w-5 h-5 text-[#0284c7] mr-2.5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-[#0369a1]">You are selecting:</div>
              <div className="font-semibold text-[#0c4a6e]">{fullSelectedDate}</div>
              <div className="text-xs text-[#0284c7] mt-0.5">
                {selectedSlot.timeSlot} ({selectedTimezone.shortName})
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center text-xs text-gray-500">
            <Info className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span>Select a date and time slot to continue</span>
          </div>
        )}
      </div>

      {/* Right Column: Calendar & Time Slots */}
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm font-semibold text-gray-800">{monthHeader}</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={isCurrentMonthView}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-20 text-gray-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {DAY_NAMES.map((name, i) => (
                <span key={i} className="text-xs font-semibold text-gray-400 py-1">{name}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((day, idx) => {
                if (!day.dayNumber) return <div key={idx} className="h-9 w-9" />;
                if (day.disabled) {
                  return (
                    <div key={idx} className="h-9 w-9 mx-auto flex items-center justify-center text-xs text-gray-400 cursor-not-allowed select-none">
                      {day.dayNumber}
                    </div>
                  );
                }
                if (day.isSelected) {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setSelectedDate(day.dateObj); setSelectedSlot(null); }}
                      className="h-9 w-9 mx-auto flex items-center justify-center text-xs font-bold rounded-lg bg-[#0a4b37] text-white shadow-sm"
                    >
                      {day.dayNumber}
                    </button>
                  );
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedDate(day.dateObj); setSelectedSlot(null); }}
                    className="h-9 w-9 mx-auto flex items-center justify-center text-xs font-semibold rounded-lg bg-[#e8f6ef] text-[#0a4b37] hover:bg-[#d1fae5] transition"
                  >
                    {day.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Timezone Selector */}
          <div className="mt-4">
            <label htmlFor="tz-select" className="block text-xs font-semibold text-gray-700 mb-1.5">
              Timezone
            </label>
            <select
              id="tz-select"
              value={selectedTimezone.id}
              onChange={(e) => {
                const found = US_CA_TIMEZONES.find((t) => t.id === e.target.value);
                if (found) setSelectedTimezone(found);
              }}
              className="w-full text-xs sm:text-sm bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-gray-700 focus:ring-1 focus:ring-[#0a4b37] focus:border-[#0a4b37]"
            >
              {US_CA_TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Slots Column */}
        <div className="w-full md:w-48 flex-shrink-0 flex flex-col">
          <div className="text-sm font-semibold text-gray-800 mb-3 text-center md:text-left">
            {formattedSelectedDate}
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot?.time === slot.time;
              return (
                <div key={slot.time} className="flex flex-col space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full py-2.5 px-4 rounded-full border text-xs sm:text-sm font-semibold transition text-center ${
                      isSelected
                        ? 'border-[#0a4b37] text-white bg-[#0a4b37] shadow-sm'
                        : 'border-gray-300 text-gray-700 hover:border-[#0a4b37] hover:text-[#0a4b37] hover:bg-[#e8f6ef]/40'
                    }`}
                  >
                    {slot.time}
                  </button>
                  {isSelected && (
                    <button
                      type="button"
                      onClick={handleConfirmSlot}
                      className="w-full py-2 px-4 rounded-full text-xs font-bold text-white bg-[#0a4b37] hover:bg-[#073d2c] shadow-sm transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


