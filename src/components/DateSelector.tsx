import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelectDate }) => {
  const today = new Date();

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onSelectDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onSelectDate(newDate);
  };

  const handleToday = () => {
    onSelectDate(today);
  };

  const isToday =
    selectedDate.toDateString() === today.toDateString();

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-600/15 rounded-lg backdrop-blur-sm border border-yellow-600/30">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-yellow-600 font-mono tracking-tight">DATE SELECTOR</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePreviousDay}
          className="p-3 hover:bg-yellow-600/10 rounded-lg transition-all duration-300 active:scale-95 backdrop-blur-sm border border-yellow-600/30 hover:border-yellow-600/50"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5 text-yellow-600" />
        </button>

        <div className="flex-1 px-6 py-4 border border-yellow-600/30 rounded-lg text-center backdrop-blur-md bg-black/50">
          <p className="text-lg md:text-xl font-semibold text-white font-mono">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {isToday && (
            <p className="text-xs text-yellow-600 font-mono font-bold mt-2 animate-pulse tracking-widest">TODAY</p>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-3 hover:bg-yellow-600/10 rounded-lg transition-all duration-300 active:scale-95 backdrop-blur-sm border border-yellow-600/30 hover:border-yellow-600/50"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5 text-yellow-600" />
        </button>

        {!isToday && (
          <button
            onClick={handleToday}
            className="px-6 py-2.5 bg-yellow-600/20 text-yellow-600 rounded-lg hover:bg-yellow-600/30 transition-all duration-300 text-sm font-mono font-bold active:scale-95 backdrop-blur-sm border border-yellow-600/40 tracking-widest uppercase"
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
};
