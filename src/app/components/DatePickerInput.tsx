import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DatePickerInputProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
  minDate?: Date; // Disable dates before this
  disabled?: boolean;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = 'Select a date',
  label,
  required = false,
  minDate,
  disabled = false,
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert ISO string to Date object
  const selectedDate = value ? new Date(value) : undefined;

  // Format display value as DD/MM/YYYY
  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Convert to ISO string (YYYY-MM-DD)
      const isoString = format(date, 'yyyy-MM-dd');
      onChange(isoString);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => !disabled && setIsOpen(true)}
          readOnly
          disabled={disabled}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder={placeholder}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }}
        >
          <style>{`
            .date-picker-calendar {
              padding: 12px;
            }
            
            .date-picker-calendar .rdp {
              --rdp-cell-size: 36px;
              --rdp-accent-color: #FF6B35;
              --rdp-background-color: #FFF5F0;
              margin: 0;
            }
            
            .date-picker-calendar .rdp-months {
              justify-content: center;
            }
            
            .date-picker-calendar .rdp-month {
              width: 100%;
            }
            
            .date-picker-calendar .rdp-caption {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0;
              margin-bottom: 12px;
            }
            
            .date-picker-calendar .rdp-caption_label {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
            }
            
            .date-picker-calendar .rdp-nav {
              position: absolute;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .date-picker-calendar .rdp-nav_button {
              width: 28px;
              height: 28px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6B7280;
              background: transparent;
              border: none;
              cursor: pointer;
              transition: all 0.15s;
            }
            
            .date-picker-calendar .rdp-nav_button:hover {
              background: #F3F4F6;
              color: #111827;
            }
            
            .date-picker-calendar .rdp-nav_button_previous {
              margin-left: 0;
            }
            
            .date-picker-calendar .rdp-nav_button_next {
              margin-right: 0;
            }
            
            .date-picker-calendar .rdp-table {
              margin-top: 8px;
            }
            
            .date-picker-calendar .rdp-head_cell {
              font-size: 12px;
              font-weight: 600;
              color: #6B7280;
              text-transform: uppercase;
              padding: 4px 0;
            }
            
            .date-picker-calendar .rdp-cell {
              padding: 2px;
            }
            
            .date-picker-calendar .rdp-day {
              width: 36px;
              height: 36px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 500;
              color: #111827;
              border: none;
              background: transparent;
              cursor: pointer;
              transition: all 0.15s;
            }
            
            .date-picker-calendar .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
              background: #F3F4F6;
            }
            
            .date-picker-calendar .rdp-day_selected {
              background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%) !important;
              color: white !important;
              font-weight: 600;
            }
            
            .date-picker-calendar .rdp-day_selected:hover {
              opacity: 0.9;
            }
            
            .date-picker-calendar .rdp-day_today {
              font-weight: 600;
              color: #FF6B35;
            }
            
            .date-picker-calendar .rdp-day_disabled {
              color: #D1D5DB;
              cursor: not-allowed;
            }
            
            .date-picker-calendar .rdp-day_outside {
              color: #D1D5DB;
            }
          `}</style>
          
          <div className="date-picker-calendar">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={minDate ? { before: minDate } : undefined}
              weekStartsOn={0} // Sunday
              showOutsideDays={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
