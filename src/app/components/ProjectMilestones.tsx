import { Calendar, CheckCircle2, Clock, Check, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableMilestone } from './DraggableMilestone';
import { MilestoneProgressBar } from './MilestoneProgressBar';

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
    description: 'Kick-off meeting, detailed requirements gathering (if not already defined), finalize device selection based on compatibility and budget, develop a comprehensive project plan, and set up project management tools. This phase...',
    amount: '₹22,499.05',
    startDate: '10 Jan 2026',
    endDate: '11 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 2,
    title: 'Network Infrastructure Setup',
    status: 'Pending',
    description: 'Installation and configuration of the core network infrastructure, including Wi-Fi access points, routers, switches, and potentially PoE injectors. Ensuring robust and secure network connectivity throughout the property. This includes...',
    amount: '₹44,999.9',
    startDate: '11 Jan 2026',
    endDate: '13 Jan 2026',
    duration: '2 days',
    durationDays: 2
  },
  {
    number: 3,
    title: 'Central Hub & Controller Installation',
    status: 'Pending',
    description: 'Installation and initial configuration of the central smart home hub or controller (e.g., Habitat, Home Assistant, or a proprietary system). This serves as the brain of the smart home, connecting all...',
    amount: '₹22,499.05',
    startDate: '13 Jan 2026',
    endDate: '14 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 4,
    title: 'Lighting Automation Installation',
    status: 'Pending',
    description: 'Installation of smart switches, dimmers, and bulbs throughout the property. Configuration of lighting scenes and automation rules.',
    amount: '₹38,874.91',
    startDate: '14 Jan 2026',
    endDate: '16 Jan 2026',
    duration: '2 days',
    durationDays: 2
  },
  {
    number: 5,
    title: 'Climate Control Integration',
    status: 'Pending',
    description: 'Installation and integration of smart thermostats, HVAC controls, and temperature sensors for automated climate management.',
    amount: '₹32,124.92',
    startDate: '16 Jan 2026',
    endDate: '18 Jan 2026',
    duration: '2 days',
    durationDays: 2
  },
  {
    number: 6,
    title: 'Security System Setup',
    status: 'Pending',
    description: 'Installation of smart locks, cameras, motion sensors, and alarm systems with proper integration to the central hub.',
    amount: '₹56,249.85',
    startDate: '18 Jan 2026',
    endDate: '20 Jan 2026',
    duration: '2 days',
    durationDays: 2
  },
  {
    number: 7,
    title: 'Entertainment System Integration',
    status: 'Pending',
    description: 'Setup of smart TVs, audio systems, and media streaming devices with voice control and automation capabilities.',
    amount: '₹28,249.93',
    startDate: '20 Jan 2026',
    endDate: '21 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 8,
    title: 'Motorization & Window Treatments',
    status: 'Pending',
    description: 'Installation of motorized blinds, curtains, and window shades with automated scheduling and light-sensitive controls.',
    amount: '₹42,749.90',
    startDate: '21 Jan 2026',
    endDate: '22 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 9,
    title: 'Voice Assistant Configuration',
    status: 'Pending',
    description: 'Setup and configuration of voice assistants (Alexa, Google Home, Siri) with custom commands and routines.',
    amount: '₹24,374.94',
    startDate: '22 Jan 2026',
    endDate: '23 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 10,
    title: 'Automation Rules & Scenes',
    status: 'Pending',
    description: 'Programming of complex automation rules, scenes, and schedules tailored to the homeowner\'s lifestyle and preferences.',
    amount: '₹35,624.92',
    startDate: '23 Jan 2026',
    endDate: '24 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 11,
    title: 'Testing & Optimization',
    status: 'Pending',
    description: 'Comprehensive testing of all systems, troubleshooting issues, and optimization of performance and user experience.',
    amount: '₹32,124.92',
    startDate: '24 Jan 2026',
    endDate: '25 Jan 2026',
    duration: '1 day',
    durationDays: 1
  },
  {
    number: 12,
    title: 'Training & Documentation',
    status: 'Pending',
    description: 'Client training sessions, creation of user manuals, system documentation, and handover of all access credentials.',
    amount: '₹28,249.93',
    startDate: '25 Jan 2026',
    endDate: '25 Jan 2026',
    duration: '1 day',
    durationDays: 1
  }
];

interface ProjectMilestonesProps {
  onRegenerate?: () => void;
  showRegenerateButton?: boolean;
}

export function ProjectMilestones({ onRegenerate, showRegenerateButton = false }: ProjectMilestonesProps = {}) {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [modifiedMilestones, setModifiedMilestones] = useState<Set<number>>(new Set());
  const [savingMilestone, setSavingMilestone] = useState<number | null>(null);
  const [savedMilestone, setSavedMilestone] = useState<number | null>(null);

  const totalMilestones = milestones.length;
  const totalDays = milestones.reduce((acc, milestone) => acc + milestone.durationDays, 0);
  const totalValue = milestones.reduce((sum, m) => {
    const amount = parseFloat(m.amount.replace('₹', '').replace(',', ''));
    return sum + amount;
  }, 0);

  const firstMilestone = milestones[0];
  const lastMilestone = milestones[milestones.length - 1];

  const handleFieldChange = (milestoneNumber: number) => {
    setModifiedMilestones(prev => new Set(prev).add(milestoneNumber));
  };

  const handleSave = async (milestoneNumber: number) => {
    setSavingMilestone(milestoneNumber);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSavingMilestone(null);
    setSavedMilestone(milestoneNumber);
    setModifiedMilestones(prev => {
      const next = new Set(prev);
      next.delete(milestoneNumber);
      return next;
    });

    // Clear saved indicator after 2 seconds
    setTimeout(() => {
      setSavedMilestone(null);
    }, 2000);
  };

  const handleReset = (milestoneNumber: number) => {
    setModifiedMilestones(prev => {
      const next = new Set(prev);
      next.delete(milestoneNumber);
      return next;
    });
    // In a real implementation, this would reset the fields to their original values
  };

  return (
    <div className="w-full mt-6">
      {/* Main Container */}
      <div 
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Gradient Header */}
        <div 
          className="px-6 py-4"
          style={{
            background: 'linear-gradient(135deg, #5B6FFF 0%, #7C5CFF 100%)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center w-9 h-9 bg-white/20 rounded-lg flex-shrink-0"
                style={{ 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                  />
                </svg>
              </div>
              
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  Edit Milestones
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  {totalMilestones} milestones • {totalDays} days
                </p>
              </div>
            </div>

            {/* Right: Total Value Pill */}
            <div 
              className="px-4 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="text-base font-bold text-white">
                ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Row */}
        <div 
          className="px-6 py-3.5"
          style={{
            background: '#FAFBFC',
            borderBottom: '1px solid #E8ECF4'
          }}
        >
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Start Date
              </div>
              <div className="text-sm font-bold text-gray-900">
                {firstMilestone.startDate}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                End Date
              </div>
              <div className="text-sm font-bold text-gray-900">
                {lastMilestone.endDate}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Estimate
              </div>
              <div className="text-sm font-bold text-gray-500">
                ₹--
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Total Cost
              </div>
              <div className="text-sm font-bold" style={{ color: '#5B6FFF' }}>
                ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Milestones List */}
        <div className="p-5 space-y-3">
          {milestones.map(milestone => {
            const isExpanded = expandedMilestone === milestone.number;
            const isModified = modifiedMilestones.has(milestone.number);
            const isSaving = savingMilestone === milestone.number;
            const isSaved = savedMilestone === milestone.number;
            const showActions = isExpanded && isModified;
            const isActive = milestone.status === 'In Progress';

            return (
              <div 
                key={milestone.number}
                className="bg-white rounded-xl transition-all duration-200"
                style={{
                  border: '1px solid #E8ECF4',
                  boxShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C7D2FE';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E8ECF4';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start gap-3">
                    {/* Milestone Number Badge */}
                    <div 
                      className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 transition-all"
                      style={{ 
                        background: isActive 
                          ? 'linear-gradient(135deg, #5B6FFF 0%, #7C5CFF 100%)' 
                          : '#FFFFFF',
                        border: isActive ? 'none' : '2px solid #E8ECF4',
                        boxShadow: isActive ? '0 2px 8px rgba(91, 111, 255, 0.3)' : 'none'
                      }}
                    >
                      <span 
                        className="font-bold text-sm"
                        style={{ color: isActive ? '#FFFFFF' : '#9CA3AF' }}
                      >
                        {milestone.number}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                          {milestone.title}
                        </h4>
                        
                        <button
                          onClick={() => setExpandedMilestone(
                            expandedMilestone === milestone.number ? null : milestone.number
                          )}
                          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <p 
                        className="text-xs text-gray-500 leading-relaxed"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: isExpanded ? 'unset' : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {milestone.description}
                      </p>
                      
                      {/* Date Controls - Show when expanded */}
                      {isExpanded && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <div 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: '#F9FAFB',
                              border: '1px solid #E8ECF4'
                            }}
                            onClick={() => handleFieldChange(milestone.number)}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C7D2FE'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8ECF4'}
                          >
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">
                              {milestone.startDate}
                            </span>
                          </div>
                          
                          <span className="text-gray-400 text-xs">→</span>
                          
                          <div 
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: '#F9FAFB',
                              border: '1px solid #E8ECF4'
                            }}
                            onClick={() => handleFieldChange(milestone.number)}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C7D2FE'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E8ECF4'}
                          >
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">
                              {milestone.endDate}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 px-2 py-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {milestone.durationDays} {milestone.durationDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Save/Reset Actions */}
                      {showActions && (
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleReset(milestone.number)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleSave(milestone.number)}
                            disabled={isSaving}
                            className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-all flex items-center gap-2"
                            style={{
                              background: isSaving ? '#9CA3AF' : 'linear-gradient(135deg, #5B6FFF 0%, #7C5CFF 100%)',
                              cursor: isSaving ? 'not-allowed' : 'pointer',
                              boxShadow: '0 2px 6px rgba(91, 111, 255, 0.3)'
                            }}
                          >
                            {isSaving ? (
                              <>
                                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                      )}

                      {/* Success Feedback */}
                      {isSaved && !isModified && (
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                            <Check className="w-4 h-4" />
                            <span>Saved successfully</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Amount Pill */}
                    <div 
                      className="px-3 py-1.5 rounded-lg flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                        border: '1px solid #C7D2FE'
                      }}
                    >
                      <div className="text-xs font-bold" style={{ color: '#5B6FFF' }}>
                        {milestone.amount}
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
  );
}