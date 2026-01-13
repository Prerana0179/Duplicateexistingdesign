import { CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface InspectionCompletedBannerProps {
  completionDate: Date | string;
  className?: string;
}

export function InspectionCompletedBanner({ 
  completionDate,
  className = '' 
}: InspectionCompletedBannerProps) {
  // Convert string to Date if needed
  const dateObj = typeof completionDate === 'string' ? new Date(completionDate) : completionDate;
  
  // Format: "11 Jan 2026"
  const formattedDate = format(dateObj, 'dd MMM yyyy');

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden ${className}`}
      style={{
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Green Header */}
      <div 
        className="px-6 py-4 flex items-center gap-3"
        style={{
          backgroundColor: '#10B981', // Emerald green
        }}
      >
        <div 
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-white font-semibold" style={{ fontSize: '18px', lineHeight: '1.2' }}>
            Inspection Completed
          </h3>
          <p className="text-white/90" style={{ fontSize: '13px', lineHeight: '1.3', marginTop: '2px' }}>
            Site inspection has been successfully completed
          </p>
        </div>
      </div>

      {/* Completion Date Row */}
      <div 
        className="px-6 py-3 flex items-center gap-2"
        style={{
          backgroundColor: '#F9FAFB',
        }}
      >
        <Calendar className="w-4 h-4 text-gray-500" strokeWidth={2} />
        <span className="text-sm text-gray-700 font-medium">
          Completed on {formattedDate}
        </span>
      </div>
    </div>
  );
}
