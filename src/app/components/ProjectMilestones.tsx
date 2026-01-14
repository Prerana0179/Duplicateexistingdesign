import { Calendar, CheckCircle2, Clock, Check, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableMilestone } from './DraggableMilestone';
import { MilestoneProgressBar } from './MilestoneProgressBar';
import { MilestoneFormData } from './CreateMilestone';

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

const milestones: Milestone[] = [
  {
    number: 1,
    title: 'Project Initiation & Planning',
    status: 'In Progress',
    description: 'Initial site survey, design finalization, permits and approvals, material procurement planning, and project kick-off meeting with stakeholders.',
    amount: '₹35,624.92',
    startDate: '15 Jan 2026',
    endDate: '22 Jan 2026',
    duration: '7 days',
    durationDays: 7
  },
  {
    number: 2,
    title: 'Foundation & Excavation Work',
    status: 'Pending',
    description: 'Site excavation, foundation layout marking, PCC work, reinforcement and concrete pouring for foundation, and plinth beam construction.',
    amount: '₹42,749.90',
    startDate: '23 Jan 2026',
    endDate: '05 Feb 2026',
    duration: '13 days',
    durationDays: 13
  },
  {
    number: 3,
    title: 'Structural Framework - Ground Floor',
    status: 'Pending',
    description: 'Column casting, beam framework, slab reinforcement and shuttering, concrete pouring, and curing process for ground floor structure.',
    amount: '₹38,874.91',
    startDate: '06 Feb 2026',
    endDate: '20 Feb 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 4,
    title: 'Structural Framework - First Floor',
    status: 'Pending',
    description: 'Column extension, beam and slab work for first floor, staircase construction, and structural integrity checks.',
    amount: '₹38,874.91',
    startDate: '21 Feb 2026',
    endDate: '07 Mar 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 5,
    title: 'Roof Slab & Waterproofing',
    status: 'Pending',
    description: 'Roof slab casting, parapet wall construction, waterproofing membrane application, and roof drainage system installation.',
    amount: '₹32,124.92',
    startDate: '08 Mar 2026',
    endDate: '22 Mar 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 6,
    title: 'Masonry & Partition Walls',
    status: 'Pending',
    description: 'External wall construction, internal partition walls, door and window frame installation, and lintel beam work.',
    amount: '₹28,249.93',
    startDate: '23 Mar 2026',
    endDate: '05 Apr 2026',
    duration: '13 days',
    durationDays: 13
  },
  {
    number: 7,
    title: 'Electrical Wiring & Installation',
    status: 'Pending',
    description: 'Electrical conduit laying, wiring for all rooms, switchboard installation, lighting fixture setup, and electrical testing.',
    amount: '₹24,374.94',
    startDate: '06 Apr 2026',
    endDate: '19 Apr 2026',
    duration: '13 days',
    durationDays: 13
  },
  {
    number: 8,
    title: 'Plumbing & Sanitary Work',
    status: 'Pending',
    description: 'Water supply pipe installation, drainage system setup, bathroom and kitchen plumbing, sanitary fixture installation, and water tank setup.',
    amount: '₹24,374.94',
    startDate: '20 Apr 2026',
    endDate: '03 May 2026',
    duration: '13 days',
    durationDays: 13
  },
  {
    number: 9,
    title: 'Flooring & Tiling Work',
    status: 'Pending',
    description: 'Floor leveling, tile laying for all rooms, kitchen and bathroom tiling, grouting work, and marble/granite installation where applicable.',
    amount: '₹35,624.92',
    startDate: '04 May 2026',
    endDate: '18 May 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 10,
    title: 'Plastering & Interior Finishing',
    status: 'Pending',
    description: 'Internal and external plastering, ceiling work, cornices and decorative elements, and surface preparation for painting.',
    amount: '₹32,124.92',
    startDate: '19 May 2026',
    endDate: '02 Jun 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 11,
    title: 'Painting & Final Touches',
    status: 'Pending',
    description: 'Primer application, interior and exterior painting, texture work, wood polishing, and final cosmetic finishing.',
    amount: '₹28,249.93',
    startDate: '03 Jun 2026',
    endDate: '17 Jun 2026',
    duration: '14 days',
    durationDays: 14
  },
  {
    number: 12,
    title: 'Final Inspection & Handover',
    status: 'Pending',
    description: 'Quality checks, electrical and plumbing testing, final cleaning, defect rectification, documentation completion, and official project handover.',
    amount: '₹16,749.95',
    startDate: '18 Jun 2026',
    endDate: '25 Jun 2026',
    duration: '7 days',
    durationDays: 7
  }
];

interface ProjectMilestonesProps {
  onRegenerate?: () => void;
  showRegenerateButton?: boolean;
  milestoneFormData?: MilestoneFormData | null;
}

// Default milestone titles based on construction phases
const DEFAULT_MILESTONE_TITLES = [
  'Project Initiation & Planning',
  'Foundation & Excavation Work',
  'Structural Framework - Ground Floor',
  'Structural Framework - First Floor',
  'Roof Slab & Waterproofing',
  'Masonry & Partition Walls',
  'Electrical Wiring & Installation',
  'Plumbing & Sanitary Work',
  'Flooring & Tiling Work',
  'Plastering & Interior Finishing',
  'Painting & Final Touches',
  'Final Inspection & Handover'
];

const DEFAULT_MILESTONE_DESCRIPTIONS = [
  'Initial site survey, design finalization, permits and approvals, material procurement planning, and project kick-off meeting with stakeholders.',
  'Site excavation, foundation layout marking, PCC work, reinforcement and concrete pouring for foundation, and plinth beam construction.',
  'Column casting, beam framework, slab reinforcement and shuttering, concrete pouring, and curing process for ground floor structure.',
  'Column extension, beam and slab work for first floor, staircase construction, and structural integrity checks.',
  'Roof slab casting, parapet wall construction, waterproofing membrane application, and roof drainage system installation.',
  'External wall construction, internal partition walls, door and window frame installation, and lintel beam work.',
  'Electrical conduit laying, wiring for all rooms, switchboard installation, lighting fixture setup, and electrical testing.',
  'Water supply pipe installation, drainage system setup, bathroom and kitchen plumbing, sanitary fixture installation, and water tank setup.',
  'Floor leveling, tile laying for all rooms, kitchen and bathroom tiling, grouting work, and marble/granite installation where applicable.',
  'Internal and external plastering, ceiling work, cornices and decorative elements, and surface preparation for painting.',
  'Primer application, interior and exterior painting, texture work, wood polishing, and final cosmetic finishing.',
  'Quality checks, electrical and plumbing testing, final cleaning, defect rectification, documentation completion, and official project handover.'
];

export function ProjectMilestones({ onRegenerate, showRegenerateButton = false, milestoneFormData }: ProjectMilestonesProps = {}) {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const [progressBarHoveredMilestone, setProgressBarHoveredMilestone] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [newMilestoneData, setNewMilestoneData] = useState({
    title: '',
    description: '',
    amount: '',
    duration: '',
  });
  const [customMilestones, setCustomMilestones] = useState<Milestone[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Generate milestones dynamically based on form data
  const generatedMilestones = useMemo(() => {
    if (!milestoneFormData) {
      // Return default milestones if no form data
      return milestones;
    }

    const { startDate, endDate, duration, numberOfMilestones, totalCost } = milestoneFormData;
    const count = numberOfMilestones;
    const totalCostNum = parseInt(totalCost.replace(/,/g, ''));
    const totalDays = duration;

    // Calculate cost per milestone (equal distribution)
    const costPerMilestone = Math.floor(totalCostNum / count);
    const remainingCost = totalCostNum - (costPerMilestone * (count - 1));

    // Calculate days per milestone
    const daysPerMilestone = Math.floor(totalDays / count);
    const remainingDays = totalDays - (daysPerMilestone * (count - 1));

    // Generate milestones
    const result: Milestone[] = [];
    let currentStartDate = new Date(startDate);

    for (let i = 0; i < count; i++) {
      const isLastMilestone = i === count - 1;
      const milestoneDays = isLastMilestone ? remainingDays : daysPerMilestone;
      const milestoneAmount = isLastMilestone ? remainingCost : costPerMilestone;

      // Calculate end date for this milestone
      const currentEndDate = new Date(currentStartDate);
      currentEndDate.setDate(currentStartDate.getDate() + milestoneDays);

      // Format dates
      const formatDate = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      };

      result.push({
        number: i + 1,
        title: DEFAULT_MILESTONE_TITLES[i] || `Milestone ${i + 1}`,
        status: i === 0 ? 'In Progress' : 'Pending',
        description: DEFAULT_MILESTONE_DESCRIPTIONS[i] || `Work phase ${i + 1} of the project.`,
        amount: `₹${milestoneAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        startDate: formatDate(currentStartDate),
        endDate: formatDate(currentEndDate),
        duration: `${milestoneDays} ${milestoneDays === 1 ? 'day' : 'days'}`,
        durationDays: milestoneDays
      });

      // Move to next milestone's start date
      currentStartDate = new Date(currentEndDate);
      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }

    return result;
  }, [milestoneFormData]);

  const totalMilestones = generatedMilestones.length;
  const totalDays = generatedMilestones.reduce((acc, milestone) => acc + milestone.durationDays, 0);
  const totalValue = generatedMilestones.reduce((sum, m) => {
    const amount = parseFloat(m.amount.replace('₹', '').replace(/,/g, ''));
    return sum + amount;
  }, 0);

  const firstMilestone = generatedMilestones[0];
  const lastMilestone = generatedMilestones[generatedMilestones.length - 1];

  // Calculate exact container height for 4 cards after render
  useEffect(() => {
    const calculateContainerHeight = () => {
      const firstCard = cardRefs.current.get(1);
      if (firstCard) {
        const cardHeight = firstCard.offsetHeight;
        const gap = 12;
        const exactHeight = (cardHeight * 4) + (gap * 3);
        setContainerHeight(exactHeight);
      }
    };

    // Calculate after initial render and whenever cards might change size
    calculateContainerHeight();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateContainerHeight);
    return () => window.removeEventListener('resize', calculateContainerHeight);
  }, []);

  // Handle progress bar hover - position tooltip near milestone card badge
  useEffect(() => {
    if (progressBarHoveredMilestone !== null) {
      const badgeElement = document.getElementById(`milestone-badge-${progressBarHoveredMilestone}`);
      if (badgeElement) {
        const rect = badgeElement.getBoundingClientRect();
        setTooltipPosition({
          x: rect.right + 8,
          y: rect.top + rect.height / 2
        });
      }
    } else {
      setTooltipPosition(null);
    }
  }, [progressBarHoveredMilestone]);

  const handleProgressBarHover = (milestoneNumber: number | null) => {
    setProgressBarHoveredMilestone(milestoneNumber);
    
    // Auto-scroll to the hovered milestone
    if (milestoneNumber !== null) {
      scrollToMilestone(milestoneNumber);
    }
  };

  // Auto-scroll to active milestone
  const scrollToMilestone = (milestoneNumber: number) => {
    const targetCard = cardRefs.current.get(milestoneNumber);
    const container = scrollContainerRef.current;
    
    if (!targetCard || !container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetCard.getBoundingClientRect();
    
    // Check if card is already fully visible in the 4-card window
    const isFullyVisible = 
      targetRect.top >= containerRect.top &&
      targetRect.bottom <= containerRect.bottom;
    
    if (isFullyVisible) {
      return; // Don't scroll if already visible
    }

    // Calculate scroll position to place target as 2nd card from top
    // Get first card to measure card height + gap
    const firstCard = cardRefs.current.get(1);
    if (!firstCard) return;
    
    const cardHeight = firstCard.offsetHeight;
    const gap = 12; // gap between cards
    
    // Position as 2nd card = scroll down by (1 card height + 1 gap)
    const targetIndex = milestoneNumber - 1;
    const desiredScrollTop = Math.max(0, targetIndex - 1) * (cardHeight + gap);
    
    // Smooth scroll to position
    container.scrollTo({
      top: desiredScrollTop,
      behavior: 'smooth'
    });
  };

  // Get status color for tooltip
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#22C55E';
      case 'In Progress':
        return '#6A5CFF';
      case 'Pending':
        return '#D1D5DB';
      default:
        return '#D1D5DB';
    }
  };

  return (
    <div className="w-full mt-6">
      {/* Main Container */}
      <div 
        className="bg-white overflow-hidden"
        style={{
          borderRadius: '16px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Gradient Header */}
        <div 
          className="px-6 py-5"
          style={{
            background: 'linear-gradient(90deg, #5B4BE3 0%, #7B3FE4 100%)',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <div className="flex items-center gap-3">
            {/* Left: Icon + Title */}
            <div 
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full flex-shrink-0"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="#5B4BE3" 
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">
                Edit Milestones
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                {totalMilestones} milestones • {totalDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Meta Info Row */}
        <div 
          className="px-6 py-4"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #EEF1F6',
            height: '64px'
          }}
        >
          <div className="grid grid-cols-3 gap-6 h-full items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>
                Start Date
              </div>
              <div className="text-sm font-bold text-gray-900">
                {firstMilestone.startDate.toUpperCase()}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>
                End Date
              </div>
              <div className="text-sm font-bold text-gray-900">
                {lastMilestone.endDate.toUpperCase()}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>
                Total Cost
              </div>
              <div className="text-sm font-bold text-gray-900">
                ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Project Title - Display above progress bar */}
        {milestoneFormData?.projectTitle && (
          <div className="px-4 pt-3 pb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {milestoneFormData.projectTitle}
            </h3>
          </div>
        )}

        {/* Add Milestone Button - Right-aligned above progress bar */}
        <div className="px-4 pt-2 pb-2 flex justify-end">
          <button
            onClick={() => setIsAddMilestoneModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Add Milestone
          </button>
        </div>

        {/* Milestone Progress Bar */}
        <div className="px-4 pt-4 pb-4">
          <MilestoneProgressBar 
            milestones={generatedMilestones} 
            onNodeHover={handleProgressBarHover}
          />
        </div>

        {/* Scrollable Milestones List */}
        <div 
          className="px-4" 
          style={{ 
            paddingBottom: '16px',
            maxHeight: `${containerHeight}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '12px'
          }}
          ref={scrollContainerRef}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {generatedMilestones.map(milestone => {
              const isHovered = hoveredMilestone === milestone.number;
              const isProgressBarHovered = progressBarHoveredMilestone === milestone.number;
              
              return (
                <div 
                  key={milestone.number}
                  className="bg-white relative"
                  style={{
                    border: '1px solid #E8ECF4',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.15s ease-out',
                    cursor: 'default'
                  }}
                  onMouseEnter={() => setHoveredMilestone(milestone.number)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                  ref={el => {
                    if (el) {
                      cardRefs.current.set(milestone.number, el);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Milestone Number Badge */}
                    <div 
                      id={`milestone-badge-${milestone.number}`}
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ 
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#5B4BE3',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        transition: 'all 120ms ease-out',
                        transform: isProgressBarHovered ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: isProgressBarHovered 
                          ? '0 0 0 0px rgba(91, 75, 227, 0.1), 0 0 10px 2px rgba(91, 75, 227, 0.25)'
                          : 'none'
                      }}
                    >
                      {milestone.number}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1" style={{ color: '#1F2937', fontSize: '14px' }}>
                        {milestone.title}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                        {milestone.description}
                      </p>
                    </div>

                    {/* Right: Amount Chip */}
                    <div 
                      className="flex-shrink-0"
                      style={{
                        background: '#EEF2FF',
                        border: '1px solid #C7D2FE',
                        borderRadius: '8px',
                        padding: '6px 12px'
                      }}
                    >
                      <div className="text-sm font-bold" style={{ color: '#4F46E5' }}>
                        {milestone.amount}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details on Hover */}
                  <div
                    style={{
                      maxHeight: isHovered ? '100px' : '0',
                      opacity: isHovered ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 0.2s ease-out, opacity 0.15s ease-out',
                      marginTop: isHovered ? '12px' : '0',
                    }}
                  >
                    <div 
                      style={{
                        padding: '0 4px'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Start Date Field */}
                        <div 
                          className="flex items-center gap-2 flex-1"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E8ECF4',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                          <span className="text-sm" style={{ color: '#1F2937' }}>
                            {milestone.startDate}
                          </span>
                        </div>

                        <span style={{ color: '#D1D5DB' }}>→</span>

                        {/* End Date Field */}
                        <div 
                          className="flex items-center gap-2 flex-1"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #E8ECF4',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                          <span className="text-sm" style={{ color: '#1F2937' }}>
                            {milestone.endDate}
                          </span>
                        </div>

                        {/* Duration Indicator */}
                        <div className="flex items-center gap-1.5 ml-2">
                          <Clock className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                          <span className="text-xs" style={{ color: '#6B7280' }}>
                            {milestone.durationDays} {milestone.durationDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip anchored to milestone badge */}
      {progressBarHoveredMilestone !== null && tooltipPosition && (() => {
        const hoveredMilestoneData = generatedMilestones.find(m => m.number === progressBarHoveredMilestone);
        if (!hoveredMilestoneData) return null;
        
        return (
          <div
            className="fixed z-50"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          >
            <div
              className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg"
              style={{
                fontSize: '12px',
                whiteSpace: 'nowrap',
                animation: 'fadeInTooltip 150ms ease-out'
              }}
            >
              <div className="font-semibold mb-1">{hoveredMilestoneData.title}</div>
              <div className="flex items-center gap-2 text-gray-300">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: getStatusColor(hoveredMilestoneData.status)
                  }}
                />
                <span>{hoveredMilestoneData.status}</span>
                <span>•</span>
                <span>{hoveredMilestoneData.durationDays} days</span>
              </div>
            </div>
            {/* Tooltip arrow */}
            <div
              style={{
                position: 'absolute',
                left: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderRight: '4px solid #111827'
              }}
            />
          </div>
        );
      })()}

      {/* Keyframe animation for tooltip */}
      <style>{`
        @keyframes fadeInTooltip {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-4px);\n          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        /* Custom scrollbar styling */
        .px-4::-webkit-scrollbar {
          width: 6px;
        }

        .px-4::-webkit-scrollbar-track {
          background: transparent;
        }

        .px-4::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }

        .px-4::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }

        /* Firefox scrollbar */
        .px-4 {
          scrollbar-width: thin;
          scrollbar-color: #D1D5DB transparent;
        }

        /* Modal animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes milestoneCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Add Milestone Modal */}
      {isAddMilestoneModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            animation: 'fadeIn 200ms ease-out'
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAddMilestoneModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl"
            style={{
              width: '90%',
              maxWidth: '540px',
              animation: 'slideUp 250ms ease-out'
            }}
          >
            {/* Modal Header */}
            <div 
              className="px-6 py-4 border-b border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Milestone
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Create an additional milestone for this project
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Milestone Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Milestone Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMilestoneData.title}
                  onChange={(e) => setNewMilestoneData({ ...newMilestoneData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter milestone title"
                />
              </div>

              {/* Milestone Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Milestone Description
                </label>
                <textarea
                  value={newMilestoneData.description}
                  onChange={(e) => setNewMilestoneData({ ...newMilestoneData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe the scope of this milestone"
                />
              </div>

              {/* Amount and Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Milestone Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMilestoneData.amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setNewMilestoneData({ ...newMilestoneData, amount: value });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Milestone Duration (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMilestoneData.duration}
                    onChange={(e) => setNewMilestoneData({ ...newMilestoneData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddMilestoneModalOpen(false);
                  setNewMilestoneData({ title: '', description: '', amount: '', duration: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newMilestoneData.title || !newMilestoneData.amount) {
                    return; // Validation
                  }

                  // Get the last milestone number
                  const lastMilestoneNumber = generatedMilestones[generatedMilestones.length - 1]?.number || 0;
                  const newMilestoneNumber = lastMilestoneNumber + 1;

                  // Calculate dates
                  const lastMilestoneEndDate = generatedMilestones[generatedMilestones.length - 1]?.endDate;
                  let startDate = new Date();
                  
                  if (lastMilestoneEndDate) {
                    // Parse the date format "18 Jun 2026"
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const parts = lastMilestoneEndDate.split(' ');
                    const day = parseInt(parts[0]);
                    const month = months.indexOf(parts[1]);
                    const year = parseInt(parts[2]);
                    
                    startDate = new Date(year, month, day);
                    startDate.setDate(startDate.getDate() + 1); // Next day after last milestone
                  }

                  const durationDays = newMilestoneData.duration ? parseInt(newMilestoneData.duration) : 7;
                  const endDate = new Date(startDate);
                  endDate.setDate(startDate.getDate() + durationDays);

                  // Format dates
                  const formatDate = (date: Date) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                  };

                  const newMilestone: Milestone = {
                    number: newMilestoneNumber,
                    title: newMilestoneData.title,
                    status: 'Pending',
                    description: newMilestoneData.description || 'Custom milestone added to the project.',
                    amount: `₹${parseInt(newMilestoneData.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    duration: `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`,
                    durationDays: durationDays
                  };

                  // Add the new milestone - this will trigger re-render with animation
                  setCustomMilestones([...customMilestones, newMilestone]);

                  // Close modal and reset form
                  setIsAddMilestoneModalOpen(false);
                  setNewMilestoneData({ title: '', description: '', amount: '', duration: '' });

                  // Scroll to bottom to show new milestone
                  setTimeout(() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                      });
                    }
                  }, 150);
                }}
                disabled={!newMilestoneData.title || !newMilestoneData.amount}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}