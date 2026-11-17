import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Ban } from 'lucide-react';
import { getTimeSlotsForTimezone } from '../constants/timezones';
import TimezoneFilterSelector from './TimezoneFilterSelector';

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarWithSlots({
  today = new Date(),
  selectedDate,
  onSelectDate,
  selectedTimezone,
  onSelectTimezone,
  selectedSlot,
  onSelectSlot,
  formattedSelectedDate,
  unavailableSlots = [],
  isAllDayBlocked = false,
  customBaseSlots = null,
  blockedDates = [],
}) {
  const normalizedToday = useMemo(() => {
    const d = new Date(today);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, [today]);

  const [currentViewDate, setCurrentViewDate] = useState(() => {
    return new Date(normalizedToday.getFullYear(), normalizedToday.getMonth(), 1);
  });

  useEffect(() => {
    if (selectedDate) {
      setCurrentViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  // Compute 30-min slots for selected timezone
  const timeSlots = useMemo(
    () => getTimeSlotsForTimezone(selectedTimezone, customBaseSlots),
    [selectedTimezone, customBaseSlots]
  );

  console.log(timeSlots);

  const monthHeader = `${MONTH_NAMES[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;
  const isCurrentMonthView =
    currentViewDate.getFullYear() === normalizedToday.getFullYear() &&
    currentViewDate.getMonth() === normalizedToday.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonthView) return;
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  };

  const isTodaySelected = useMemo(() => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === normalizedToday.getFullYear() &&
      selectedDate.getMonth() === normalizedToday.getMonth() &&
      selectedDate.getDate() === normalizedToday.getDate()
    );
  }, [selectedDate, normalizedToday]);

  const currentMinutesInSelectedTz = useMemo(() => {
    if (!isTodaySelected) return -1;
    const offsetMin = selectedTimezone?.offsetMinutes ?? -480;
    const tzDate = new Date(Date.now() + offsetMin * 60000);
    return tzDate.getUTCHours() * 60 + tzDate.getUTCMinutes();
  }, [isTodaySelected, selectedTimezone]);

  const nowMinutesInSelectedTz = useMemo(() => {
    const offsetMin = selectedTimezone?.offsetMinutes ?? -480;
    const tzDate = new Date(Date.now() + offsetMin * 60000);
    return tzDate.getUTCHours() * 60 + tzDate.getUTCMinutes();
  }, [selectedTimezone]);

  const isPastDate = useMemo(() => {
    if (!selectedDate) return false;
    const sel = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return sel < normalizedToday;
  }, [selectedDate, normalizedToday]);

  const slotsContainerRef = useRef(null);

  // Auto-scroll to first available slot on date/timezone change
  useEffect(() => {
    if (slotsContainerRef.current) {
      const target = slotsContainerRef.current.querySelector('button:not(:disabled)');
      if (target) {
        slotsContainerRef.current.scrollTop = target.offsetTop - slotsContainerRef.current.offsetTop - 8;
      }
    }
  }, [selectedDate, selectedTimezone]);

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
      const isPast = dateObj < normalizedToday;

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isBlockedDate = Array.isArray(blockedDates) && blockedDates.includes(dateStr);

      const isInvalidDate = isPast || isBlockedDate;

      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === d;

      days.push({ dayNumber: d, dateObj, disabled: isInvalidDate, isSelected });
    }
    return days;
  }, [currentViewDate, normalizedToday, selectedDate, blockedDates]);

  return (
    <div className="flex flex-col sm:flex-row gap-5">
      <div className="flex-1">
        <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
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

          <div className="grid grid-cols-7 text-center mb-1.5">
            {DAY_NAMES.map((name, i) => (
              <span key={i} className="text-xs font-semibold text-gray-400 py-1">{name}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((day, idx) => {
              if (!day.dayNumber) return <div key={idx} className="h-8 w-8" />;
              if (day.disabled) {
                return (
                  <div
                    key={idx}
                    title="Unavailable date"
                    className="h-8 w-8 mx-auto flex items-center justify-center text-xs text-gray-300 bg-gray-50/70 rounded-lg cursor-not-allowed select-none line-through"
                  >
                    {day.dayNumber}
                  </div>
                );
              }
              if (day.isSelected) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectDate(day.dateObj)}
                    className="h-8 w-8 mx-auto flex items-center justify-center text-xs font-bold rounded-lg bg-[#0a4b37] text-white shadow-sm"
                  >
                    {day.dayNumber}
                  </button>
                );
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectDate(day.dateObj)}
                  className="h-8 w-8 mx-auto flex items-center justify-center text-xs font-semibold rounded-lg bg-[#e8f6ef] text-[#0a4b37] hover:bg-[#d1fae5] transition"
                >
                  {day.dayNumber}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3.5">
          <TimezoneFilterSelector
            selectedTimezone={selectedTimezone}
            onSelectTimezone={onSelectTimezone}
          />
        </div>
      </div>

      <div className="w-full sm:w-48 flex-shrink-0 flex flex-col">
        <div className="text-xs font-semibold text-gray-800 mb-2 flex items-center justify-between">
          <span>{formattedSelectedDate}</span>
          <span className="text-[10px] text-gray-400 font-normal">30m</span>
        </div>

        {isAllDayBlocked && (
          <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-1">
            <Ban className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Fully Booked on this date</span>
          </div>
        )}

        <div
          ref={slotsContainerRef}
          className="space-y-1.5 max-h-[355px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {timeSlots.map((slot) => {
            const [sh = 0, sm = 0] = slot.time.split(':').map(Number);
            const slotMin = sh * 60 + sm;

            const isBooked =
              isAllDayBlocked ||
              (Array.isArray(unavailableSlots) && unavailableSlots.includes(slot.time));

            let isPast = false;
            if (isPastDate) {
              isPast = true;
            } else if (isTodaySelected && currentMinutesInSelectedTz >= 0) {
              if (slotMin <= currentMinutesInSelectedTz) {
                isPast = true;
              }
            }

            const isEnabled = !isPast && !isBooked;
            const isDisabled = !isEnabled;
            const isSelected = selectedSlot?.time === slot.time;

            return (
              <button
                key={slot.time}
                data-time={slot.time}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onSelectSlot(slot)}
                className={`w-full py-2 px-3 rounded-full border text-xs font-semibold transition text-center flex items-center justify-center ${
                  isDisabled
                    ? 'border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed opacity-45'
                    : isSelected
                    ? 'border-[#0a4b37] text-white bg-[#0a4b37] shadow-sm cursor-pointer'
                    : 'border-gray-300 text-gray-700 hover:border-[#0a4b37] hover:text-[#0a4b37] hover:bg-[#e8f6ef]/40 cursor-pointer'
                }`}
                title={
                  isBooked
                    ? 'Already booked'
                    : isPast
                    ? 'Past time'
                    : 'Available'
                }
              >
                <span>{slot.time}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-1.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

