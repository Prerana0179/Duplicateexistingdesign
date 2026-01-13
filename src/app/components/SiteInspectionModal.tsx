import { X, Calendar, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { TimePickerWheel } from './TimePickerWheel';

interface SiteInspectionModalProps {
  vendorId: string;
  onClose: () => void;
  onPaymentSuccess?: (vendorId: string) => void;
}

export function SiteInspectionModal({ vendorId, onClose, onPaymentSuccess }: SiteInspectionModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  
  const timePickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const timeString = `${hour}:${String(minute).padStart(2, '0')} ${period}`;
    setSelectedTime(timeString);
  };

  const handlePayAndSchedule = () => {
    // Close the inspection modal first
    onClose();
    
    // Then trigger payment success callback
    if (onPaymentSuccess) {
      onPaymentSuccess(vendorId);
    }
  };

  return (
    <>
      {/* Backdrop Overlay - Blurred Glass Effect */}
      <div 
        className="fixed inset-0 backdrop-blur-md bg-white/60 z-40"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Inline CSS to disable all scrollbar UI */}
          <style>{`
            .time-picker-container * {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE/Edge */
            }
            .time-picker-container *::-webkit-scrollbar {
              display: none; /* Chrome/Safari */
            }
          `}</style>

          {/* Modal Header */}
          <div className="relative border-b border-gray-200 p-6 pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Schedule Site Inspection
            </h2>
            <p className="text-sm text-gray-500">
              Select a preferred date & time for the inspection
            </p>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-left bg-white"
                >
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                </button>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                
                {/* Calendar Dropdown */}
                {isCalendarOpen && (
                  <div className="absolute z-50 mt-2 bg-white rounded-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden" ref={calendarRef}>
                    <style>{`
                      .rdp {
                        --rdp-cell-size: 40px;
                        --rdp-accent-color: #000000;
                        --rdp-background-color: #f3f4f6;
                        margin: 0;
                        background: #FFFFFF;
                      }
                      .rdp-months {
                        background: #FFFFFF;
                      }
                      .rdp-month {
                        background: #FFFFFF;
                      }
                      .rdp-table {
                        background: #FFFFFF;
                      }
                    `}</style>
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }}
                      className="p-4"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-left bg-white"
                >
                  {selectedTime ? selectedTime : 'Select a time'}
                </button>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                
                {/* Time Picker Dropdown */}
                {isTimePickerOpen && (
                  <div 
                    className="time-picker-container absolute z-50 mt-2 bg-white rounded-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden" 
                    ref={timePickerRef}
                    style={{ width: '100%' }}
                  >
                    <TimePickerWheel onTimeChange={handleTimeChange} />
                  </div>
                )}
              </div>
            </div>

            {/* Inspection Fee Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Site Inspection Fee</span>
                <span className="text-lg font-bold text-gray-900">₹1,200</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handlePayAndSchedule}
              className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-[#111111] active:bg-black transition-colors"
            >
              Pay ₹1,200 & Schedule Inspection
            </button>

            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="w-full text-gray-600 py-2 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}