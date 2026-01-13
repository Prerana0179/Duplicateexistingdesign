import { Check } from 'lucide-react';
import { useState } from 'react';

interface TimelineStep {
  id: string;
  label: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  statusLabel: string;
  subtext: string;
  date?: string;
}

const steps: TimelineStep[] = [
  { 
    id: '1', 
    label: 'Project Created', 
    status: 'completed', 
    statusLabel: 'Completed', 
    subtext: 'New project created by user', 
    date: '22 Jan 2024' 
  },
  { 
    id: '2', 
    label: 'Vendor Selection In Progress', 
    status: 'in-progress', 
    statusLabel: 'Pending', 
    subtext: 'Vendor yet to be assigned', 
    date: '25 Jan 2024' 
  },
  { 
    id: '3', 
    label: 'Site Inspection', 
    status: 'upcoming', 
    statusLabel: 'Pending', 
    subtext: 'Site inspection will be scheduled after vendor selection' 
  },
  { 
    id: '4', 
    label: 'Quote & Agreement', 
    status: 'upcoming', 
    statusLabel: 'Pending', 
    subtext: 'Quotation and agreement will be shared post site inspection' 
  },
  { 
    id: '5', 
    label: 'Contract Finalized', 
    status: 'upcoming', 
    statusLabel: 'Pending', 
    subtext: 'Contract to be finalized after agreement approval' 
  },
];

export function HorizontalTimeline() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl p-8 shadow-md">
      {/* Timeline Title */}
      <h3 className="font-semibold text-lg mb-6">Project Timeline</h3>
      
      {/* Timeline Wrapper - Relative container */}
      <div className="relative">
        {/* Axis Layer - Absolutely positioned connector bar */}
        <div 
          className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden z-0" 
          style={{ left: '24px', right: '24px', top: '24px' }}
        >
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: '33.33%',
              background: 'linear-gradient(90deg, #000000 0%, #000000 100%)'
            }} 
          />
        </div>

        {/* Steps Container - Horizontal distribution only */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Marker Layer - Absolutely positioned circle */}
              <div 
                className="absolute z-10"
                style={{ 
                  top: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                tabIndex={0}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                onFocus={() => setHoveredStep(step.id)}
                onBlur={() => setHoveredStep(null)}
              >
                {/* Active step heartbeat pulse ring - Visual overlay only */}
                {step.status === 'in-progress' && (
                  <div 
                    className="absolute w-12 h-12 rounded-full bg-black"
                    style={{
                      animation: 'heartbeat-pulse 1.8s ease-out infinite',
                      top: '0',
                      left: '0'
                    }}
                  />
                )}
                
                {/* Step Circle - Anchored to axis */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                    step.status === 'completed'
                      ? 'bg-green-500 shadow-lg shadow-green-200'
                      : step.status === 'in-progress'
                      ? 'bg-black shadow-lg shadow-gray-300 ring-2 ring-gray-400'
                      : 'bg-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : step.status === 'in-progress' ? (
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </div>

                {/* Tooltip - For all milestone circles */}
                {hoveredStep === step.id && (
                  <div
                    className="absolute bg-white rounded-lg text-sm z-20"
                    style={{
                      top: '60px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '8px 12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      width: '144px',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ color: '#111827', fontSize: '12px', lineHeight: '1.5', textAlign: 'center' }}>
                      <div className={step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-500'} style={{ fontSize: '12px', marginBottom: '1px' }}>
                        {step.subtext}
                      </div>
                      {step.date && (
                        <div className="text-gray-400" style={{ fontSize: '12px', marginTop: '1px' }}>
                          {step.date}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Layer - Separate flow with fixed padding to clear markers */}
              <div className="flex flex-col items-center" style={{ paddingTop: '60px' }}>
                {/* Step Label */}
                <span
                  className={`text-sm font-medium mb-1 text-center ${
                    step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {step.label}
                </span>
                
                {/* Status Label */}
                <span
                  className={`text-xs font-medium ${
                    step.status === 'completed' 
                      ? 'text-green-600' 
                      : step.status === 'in-progress'
                      ? 'text-black'
                      : 'text-gray-400'
                  }`}
                >
                  {step.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}