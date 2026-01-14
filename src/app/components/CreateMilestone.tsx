import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { DatePickerInput } from './DatePickerInput';

/**
 * Create Milestone Component (Vendor View Only)
 * 
 * This component is EXCLUSIVELY for vendors to create project milestones
 * after completing site inspections.
 * 
 * CRITICAL: This component must NEVER be shown in Customer view.
 * Customer view uses the separate "Edit Milestones" component.
 * 
 * FORM FIELDS:
 * - Project Title (required)
 * - Start Date (required)
 * - End Date (required)
 * - Duration (auto-calculated from dates)
 * - Number of Milestones (required)
 * - Total Cost (₹) (required, full width)
 * - Notes / Description (optional)
 * 
 * SIMPLIFIED DESIGN:
 * - Removed "Estimated Cost" field (vendors work with total project cost only)
 * - Shows only "Total Cost in Words" (no separate estimated cost conversion)
 * - AI generates milestone breakdown based on total cost divided by number of milestones
 */

interface CreateMilestoneProps {
  onGenerateMilestones?: (data: MilestoneFormData) => void;
  milestonesGenerated?: boolean;
}

export interface MilestoneFormData {
  projectTitle: string;
  startDate: string;
  endDate: string;
  duration: number;
  numberOfMilestones: number;
  totalCost: string;
  notes: string;
}

// Number to words conversion (Indian system)
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return ones[hundred] + ' Hundred' + (rest > 0 ? ' ' + convertLessThanThousand(rest) : '');
  }
  
  if (num < 1000) {
    return convertLessThanThousand(num);
  }
  
  // Indian numbering system: crore, lakh, thousand
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  
  let result = '';
  
  if (crore > 0) {
    result += convertLessThanThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand ';
  }
  if (rest > 0) {
    result += convertLessThanThousand(rest);
  }
  
  return result.trim();
}

export function CreateMilestone({ onGenerateMilestones, milestonesGenerated }: CreateMilestoneProps) {
  const [projectTitle, setProjectTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [numberOfMilestones, setNumberOfMilestones] = useState('1');
  const [totalCost, setTotalCost] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-calculate end date when start date or number of days change
  useEffect(() => {
    if (startDate && numberOfDays && parseInt(numberOfDays) > 0) {
      const start = new Date(startDate);
      const days = parseInt(numberOfDays);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      
      // Format end date as YYYY-MM-DD for consistency
      const year = end.getFullYear();
      const month = String(end.getMonth() + 1).padStart(2, '0');
      const day = String(end.getDate()).padStart(2, '0');
      setEndDate(`${year}-${month}-${day}`);
    } else {
      setEndDate('');
    }
  }, [startDate, numberOfDays]);

  // Convert costs to words
  const totalCostInWords = totalCost 
    ? numberToWords(parseInt(totalCost.replace(/,/g, ''))) + ' Rupees Only'
    : 'Enter total cost to see in words';

  const handleGenerateMilestones = () => {
    const formData: MilestoneFormData = {
      projectTitle,
      startDate,
      endDate,
      duration: parseInt(numberOfDays) || 0,
      numberOfMilestones: parseInt(numberOfMilestones) || 1,
      totalCost,
      notes,
    };
    
    onGenerateMilestones?.(formData);
  };

  const isFormValid = projectTitle && startDate && numberOfDays && numberOfMilestones && totalCost;

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden"
      style={{
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header with Orange Gradient */}
      <div 
        className="px-6 py-4 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        }}
      >
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-white font-semibold" style={{ fontSize: '18px', lineHeight: '1.2' }}>
            Create Milestone
          </h3>
          <p className="text-white/90" style={{ fontSize: '13px', lineHeight: '1.3', marginTop: '2px' }}>
            Set up project milestones after completing the inspection
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter project title"
          />
        </div>

        {/* Date Row with Duration in Between */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* Start Date */}
          <DatePickerInput
            value={startDate}
            onChange={setStartDate}
            label="Start Date"
            placeholder="Select start date"
            required
            minDate={new Date()} // Disable past dates
          />

          {/* No. of Days (Editable Input) */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              No. of Days <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={numberOfDays}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow positive integers
                if (value === '' || (parseInt(value) > 0 && !value.includes('.'))) {
                  setNumberOfDays(value);
                }
              }}
              disabled={!startDate}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              style={{ 
                minWidth: '120px',
                textAlign: 'center',
                fontWeight: '500',
              }}
              placeholder={startDate ? "Enter days" : "—"}
            />
          </div>

          {/* End Date (Auto-calculated, Read-only) */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={endDate ? new Date(endDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) : ''}
              readOnly
              disabled
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
              style={{ 
                fontWeight: '500',
                cursor: 'not-allowed',
              }}
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Financial Configuration Row: Milestones + Total Cost + Cost in Words */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Number of Milestones - Matches Start Date width */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Number of Milestones <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={numberOfMilestones}
              onChange={(e) => setNumberOfMilestones(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="1"
            />
          </div>

          {/* Total Cost - Matches No. of Days position */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Total Cost (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={totalCost}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setTotalCost(value);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ 
                minWidth: '120px',
              }}
              placeholder="Enter total cost"
            />
          </div>

          {/* Total Cost in Words - EXACTLY matches End Date width (1fr) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Total Cost in Words
            </label>
            <input
              type="text"
              value={totalCostInWords}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
              style={{ 
                cursor: 'default',
              }}
              placeholder="Enter total cost to see in words"
            />
          </div>
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Notes / Description
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Enter project details, scope of work, special requirements, etc."
          />
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerateMilestones}
            disabled={!isFormValid}
            className="w-full text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            style={{
              height: '48px',
              fontSize: '15px',
              background: isFormValid 
                ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                : '#E5E7EB',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              opacity: isFormValid ? 1 : 0.6,
            }}
          >
            <Target className="w-5 h-5" strokeWidth={2} />
            {milestonesGenerated ? 'Regenerate Milestones' : 'Create Milestones'}
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            {milestonesGenerated 
              ? 'Update milestones with new values if needed' 
              : 'AI will generate detailed milestones based on your inputs'}
          </p>
        </div>
      </div>
    </div>
  );
}