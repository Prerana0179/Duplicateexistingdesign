import { Calendar, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface Milestone {
  number: number;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  duration: string;
  durationDays: number;
}

interface MilestoneEdits {
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
}

interface DraggableMilestoneProps {
  milestone: Milestone;
  index: number;
  displayNumber: number;
  isExpanded: boolean;
  currentData: Milestone;
  currentEdits: MilestoneEdits | undefined;
  showActions: boolean;
  isSaving: boolean;
  isSaved: boolean;
  dateError: string | undefined;
  endDateHighlight: boolean;
  calendarOpen: boolean;
  calendarMonth: Date;
  onToggleExpand: (milestoneNumber: number, e: React.MouseEvent) => void;
  onFieldChange: (milestoneNumber: number, field: keyof MilestoneEdits, value: string) => void;
  onSave: (milestoneNumber: number, e: React.MouseEvent) => void;
  onReset: (milestoneNumber: number, e: React.MouseEvent) => void;
  toggleCalendar: (milestoneNumber: number, e: React.MouseEvent) => void;
  handleDateSelect: (milestoneNumber: number, date: Date) => void;
  getCalendarDays: (month: Date) => (Date | null)[];
  isDateDisabled: (date: Date) => boolean;
  isDateSelected: (date: Date, milestoneNumber: number) => boolean;
  setCalendarMonth: (month: Date) => void;
  moveMilestone: (fromIndex: number, toIndex: number) => void;
}

const ITEM_TYPE = 'MILESTONE';

export function DraggableMilestone({
  milestone,
  index,
  displayNumber,
  isExpanded,
  currentData,
  currentEdits,
  showActions,
  isSaving,
  isSaved,
  dateError,
  endDateHighlight,
  calendarOpen,
  calendarMonth,
  onToggleExpand,
  onFieldChange,
  onSave,
  onReset,
  toggleCalendar,
  handleDateSelect,
  getCalendarDays,
  isDateDisabled,
  isDateSelected,
  setCalendarMonth,
  moveMilestone,
}: DraggableMilestoneProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (!cardRef.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveMilestone(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Attach drag ref to the badge (drag handle) and drop ref to the entire card
  drag(dragHandleRef);
  drop(preview(cardRef));

  const opacity = isDragging ? 0.4 : 1;
  const scale = isDragging ? 1.03 : 1;
  const shadow = isDragging 
    ? '0 8px 24px rgba(79, 70, 229, 0.3)' 
    : isExpanded 
      ? '0 4px 12px rgba(79, 70, 229, 0.15)' 
      : '0 1px 3px rgba(0, 0, 0, 0.05)';

  return (
    <div
      id={`milestone-${milestone.number}`}
      ref={cardRef}
      className="bg-white rounded-xl transition-all cursor-pointer select-none"
      style={{ 
        border: isExpanded ? '2px solid #4F46E5' : '1px solid #E5E7EB',
        boxShadow: shadow,
        opacity,
        transform: `scale(${scale})`,
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={(e) => onToggleExpand(milestone.number, e)}
      onMouseEnter={(e) => {
        if (!isExpanded && !isDragging) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded && !isDragging) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Numbered Circle Badge - Drag Handle */}
          <div 
            ref={dragHandleRef}
            className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-bold">{displayNumber}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-bold text-gray-900 text-base leading-tight">
                {milestone.title}
              </h4>
              
              {/* Amount Pill - Editable when expanded */}
              {isExpanded && currentEdits ? (
                <input
                  type="text"
                  value={currentEdits.amount}
                  onChange={(e) => {
                    e.stopPropagation();
                    onFieldChange(milestone.number, 'amount', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-full flex-shrink-0 text-sm font-semibold text-indigo-700 outline-none ring-2 ring-transparent focus:ring-indigo-400 transition-all"
                  style={{
                    backgroundColor: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    width: '120px'
                  }}
                />
              ) : (
                <div 
                  className="px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: '#EEF2FF',
                    border: '1px solid #C7D2FE'
                  }}
                >
                  <span className="text-sm font-semibold text-indigo-700">
                    {currentData.amount}
                  </span>
                </div>
              )}
            </div>

            {/* Description - Editable when expanded */}
            {isExpanded && currentEdits ? (
              <textarea
                value={currentEdits.description}
                onChange={(e) => {
                  e.stopPropagation();
                  onFieldChange(milestone.number, 'description', e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm text-gray-600 mb-3 leading-relaxed p-2 rounded-lg outline-none ring-2 ring-transparent focus:ring-indigo-200 transition-all resize-none"
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  minHeight: '80px'
                }}
                rows={4}
              />
            ) : (
              <p 
                className="text-sm text-gray-600 mb-3 leading-relaxed"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: isExpanded ? 'visible' : 'hidden'
                }}
              >
                {currentData.description}
              </p>
            )}

            {/* Date Controls - Show when expanded */}
            {isExpanded && currentEdits && (
              <>
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                  {/* Start Date Pill - Clickable with Calendar */}
                  <div className="flex-1 relative">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer"
                      style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                      onClick={(e) => toggleCalendar(milestone.number, e)}
                    >
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" strokeWidth={2} />
                      <span className="text-sm text-gray-700 font-medium flex-1">
                        {currentEdits.startDate}
                      </span>
                    </div>

                    {/* Inline Calendar Popover */}
                    {calendarOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 bg-white rounded-xl z-50"
                        style={{
                          border: '1px solid #E5E7EB',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          width: '280px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newMonth = new Date(calendarMonth);
                              newMonth.setMonth(newMonth.getMonth() - 1);
                              setCalendarMonth(newMonth);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
                          </button>
                          
                          <span className="text-sm font-semibold text-gray-900">
                            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newMonth = new Date(calendarMonth);
                              newMonth.setMonth(newMonth.getMonth() + 1);
                              setCalendarMonth(newMonth);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={2} />
                          </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 px-3 py-2 border-b border-gray-100">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="text-center">
                              <span className="text-xs font-medium text-gray-500">{day}</span>
                            </div>
                          ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1 p-3">
                          {getCalendarDays(calendarMonth).map((date, idx) => {
                            if (!date) {
                              return <div key={`empty-${idx}`} className="aspect-square" />;
                            }

                            const disabled = isDateDisabled(date);
                            const selected = isDateSelected(date, milestone.number);

                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!disabled) {
                                    handleDateSelect(milestone.number, date);
                                  }
                                }}
                                disabled={disabled}
                                className="aspect-square flex items-center justify-center text-sm rounded-lg transition-all"
                                style={{
                                  backgroundColor: selected 
                                    ? '#4F46E5' 
                                    : 'transparent',
                                  color: selected 
                                    ? '#FFFFFF' 
                                    : disabled 
                                      ? '#D1D5DB' 
                                      : '#374151',
                                  cursor: disabled ? 'not-allowed' : 'pointer',
                                  fontWeight: selected ? 600 : 500
                                }}
                                onMouseEnter={(e) => {
                                  if (!disabled && !selected) {
                                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!disabled && !selected) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }
                                }}
                              >
                                {date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <span className="text-gray-400 text-sm">→</span>

                  {/* End Date Pill - Read-only (Auto-calculated) */}
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-full flex-1 relative"
                    style={{ 
                      backgroundColor: endDateHighlight ? '#EEF2FF' : '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      cursor: 'not-allowed'
                    }}
                    title="End date is auto-calculated based on start date + duration"
                  >
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                    <input
                      type="text"
                      value={currentEdits.endDate}
                      readOnly
                      disabled
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-gray-500 font-medium bg-transparent outline-none flex-1 cursor-not-allowed"
                      placeholder="Auto-calculated"
                      style={{
                        WebkitTextFillColor: '#6B7280'
                      }}
                    />
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                    {milestone.duration}
                  </div>
                </div>

                {/* Date Error Message */}
                {dateError && (
                  <div className="flex items-start gap-2 mt-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-sm text-red-600 leading-tight">
                      {dateError}
                    </p>
                  </div>
                )}

                {/* Save & Reset Actions - Show only when there are changes */}
                {showActions && (
                  <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                    {/* Reset Button */}
                    <button
                      onClick={(e) => onReset(milestone.number, e)}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Reset
                    </button>

                    {/* Save Button */}
                    <button
                      onClick={(e) => onSave(milestone.number, e)}
                      disabled={isSaving}
                      className="text-sm text-white font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      style={{
                        background: isSaved 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                        minWidth: '80px',
                        justifyContent: 'center'
                      }}
                    >
                      {isSaving ? (
                        <>
                          <div 
                            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                          />
                          <span>Saving...</span>
                        </>
                      ) : isSaved ? (
                        <>
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                          <span>Saved</span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}