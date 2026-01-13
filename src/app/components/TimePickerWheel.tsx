import { useEffect, useRef, useState } from 'react';

interface TimePickerWheelProps {
  onTimeChange: (hour: number, minute: number, period: 'AM' | 'PM') => void;
}

export function TimePickerWheel({ onTimeChange }: TimePickerWheelProps) {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

  useEffect(() => {
    onTimeChange(selectedHour, selectedMinute, selectedPeriod);
  }, [selectedHour, selectedMinute, selectedPeriod, onTimeChange]);

  const renderWheel = (
    items: (number | string)[],
    selectedValue: number | string,
    onChange: (value: any) => void,
    formatValue?: (value: number | string) => string
  ) => {
    const itemHeight = 40;
    const visibleItems = 5;
    const selectedIndex = items.indexOf(selectedValue);

    return (
      <div className="relative h-[200px] overflow-hidden">
        {/* Selection Highlight Band */}
        <div 
          className="absolute left-0 right-0 bg-[#F5F5F5] rounded-xl pointer-events-none z-10"
          style={{
            top: `${itemHeight * 2}px`,
            height: `${itemHeight}px`,
          }}
        />

        {/* Scrollable Items Container - Fully Clipped */}
        <div className="relative h-full overflow-hidden z-20">
          {items.map((item, index) => {
            const offset = index - selectedIndex;
            const isSelected = index === selectedIndex;
            const distance = Math.abs(offset);
            
            // Only render items that are within the visible range
            if (distance > 3) return null;

            // Determine color based on distance from selected item - NO opacity changes
            let textColor = '#000000'; // Selected (black)
            if (distance === 1) {
              textColor = '#4B5563'; // Adjacent (dark gray)
            } else if (distance >= 2) {
              textColor = '#9CA3AF'; // Distant (light gray, still readable)
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => onChange(item)}
                className="absolute left-0 right-0 flex items-center justify-center transition-all duration-200"
                style={{
                  height: `${itemHeight}px`,
                  top: `${(offset + 2) * itemHeight}px`,
                  fontSize: isSelected ? '16px' : '15px',
                  fontWeight: isSelected ? 600 : 400,
                  color: textColor,
                }}
              >
                {formatValue ? formatValue(item) : item}
              </button>
            );
          })}
        </div>

        {/* Top Edge Fade - Very Thin, Only at Container Edge */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '10px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
          }}
        />

        {/* Bottom Edge Fade - Very Thin, Only at Container Edge */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
          style={{
            height: '10px',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[20px] p-4 overflow-hidden">
      <div className="grid grid-cols-3 gap-2 overflow-hidden">
        {/* Hour Wheel */}
        <div className="border-r border-[#EDEDED] overflow-hidden">
          {renderWheel(hours, selectedHour, setSelectedHour)}
        </div>

        {/* Minute Wheel */}
        <div className="border-r border-[#EDEDED] overflow-hidden">
          {renderWheel(minutes, selectedMinute, setSelectedMinute, (val) => 
            String(val).padStart(2, '0')
          )}
        </div>

        {/* Period Wheel */}
        <div className="overflow-hidden">
          {renderWheel(periods, selectedPeriod, setSelectedPeriod)}
        </div>
      </div>
    </div>
  );
}