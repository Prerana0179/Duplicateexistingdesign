import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface Milestone {
  number: number;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  durationDays: number;
}

interface MilestoneProgressBarProps {
  milestones: Milestone[];
  onNodeClick?: (milestoneNumber: number) => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
}

export function MilestoneProgressBar({ milestones, onNodeClick }: MilestoneProgressBarProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Animation states
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const [pulsePosition, setPulsePosition] = useState<number | null>(null);
  const [completingNodeNumber, setCompletingNodeNumber] = useState<number | null>(null);
  const [startingNodeNumber, setStartingNodeNumber] = useState<number | null>(null);
  const [counterHighlight, setCounterHighlight] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  
  // Track previous milestones for change detection
  const prevMilestonesRef = useRef<Milestone[]>(milestones);

  const totalMilestones = milestones.length;
  const completedCount = milestones.filter(m => m.status === 'Completed').length;
  
  // Calculate actual progress percentage
  const targetProgress = (completedCount / totalMilestones) * 100;

  // Detect status changes and trigger animations
  useEffect(() => {
    const prevMilestones = prevMilestonesRef.current;
    
    // Find milestone that changed to "In Progress"
    const newInProgress = milestones.find((m, idx) => 
      m.status === 'In Progress' && prevMilestones[idx]?.status !== 'In Progress'
    );
    
    // Find milestone that changed to "Completed"
    const newCompleted = milestones.find((m, idx) => 
      m.status === 'Completed' && prevMilestones[idx]?.status !== 'Completed'
    );

    if (newInProgress || newCompleted) {
      triggerStepAnimation(newCompleted?.number || null, newInProgress?.number || null);
    }

    prevMilestonesRef.current = milestones;
  }, [milestones]);

  // Initialize animated progress on mount
  useEffect(() => {
    setAnimatedProgress(targetProgress);
  }, []);

  // Trigger step-to-step animation
  const triggerStepAnimation = (completedNode: number | null, inProgressNode: number | null) => {
    const prevInProgressIndex = prevMilestonesRef.current.findIndex(m => m.status === 'In Progress');
    const prevInProgressNode = prevInProgressIndex >= 0 ? prevMilestonesRef.current[prevInProgressIndex].number : null;

    // Step 1: Mark previous "In Progress" as completing (250ms)
    if (prevInProgressNode !== null && prevInProgressNode !== inProgressNode) {
      setCompletingNodeNumber(prevInProgressNode);
      
      setTimeout(() => {
        setCompletingNodeNumber(null);
      }, 250);
    }

    // Step 2: Animate progress line with pulse (500-650ms)
    const oldProgressIndex = prevMilestonesRef.current.filter(m => m.status === 'Completed').length;
    const newProgressIndex = milestones.filter(m => m.status === 'Completed').length;
    
    if (newProgressIndex > oldProgressIndex) {
      const fromProgress = (oldProgressIndex / totalMilestones) * 100;
      const toProgress = (newProgressIndex / totalMilestones) * 100;
      
      animateProgressLine(fromProgress, toProgress);
    }

    // Step 3: Activate new "In Progress" node (after 300ms delay)
    if (inProgressNode !== null) {
      setTimeout(() => {
        setStartingNodeNumber(inProgressNode);
        
        setTimeout(() => {
          setStartingNodeNumber(null);
        }, 500);
        
        // Counter highlight
        setCounterHighlight(true);
        setTimeout(() => setCounterHighlight(false), 350);
        
        // Spawn confetti at completed node
        if (completedNode !== null) {
          spawnConfetti(completedNode);
        }
        
        // Auto-scroll to new milestone after animation
        setTimeout(() => {
          scrollToMilestone(inProgressNode);
        }, 650);
        
      }, 300);
    }
  };

  // Animate progress line from old to new position
  const animateProgressLine = (from: number, to: number) => {
    const duration = 600;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentProgress = from + (to - from) * easeOut;
      setAnimatedProgress(currentProgress);
      
      // Update pulse position
      setPulsePosition(currentProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPulsePosition(null);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Spawn confetti particles
  const spawnConfetti = (nodeNumber: number) => {
    const nodeIndex = milestones.findIndex(m => m.number === nodeNumber);
    const position = (nodeIndex / (totalMilestones - 1)) * 100;
    
    const particles: ConfettiParticle[] = [];
    const colors = ['#22C55E', '#10B981', '#34D399', '#6EE7B7'];
    
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 4) + (Math.random() * Math.PI / 2); // 45-135 degrees
      const speed = 2 + Math.random() * 2;
      
      particles.push({
        id: i,
        x: position,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1
      });
    }
    
    setConfettiParticles(particles);
    
    // Animate confetti
    const startTime = performance.now();
    const duration = 800;
    
    const animateConfetti = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress < 1) {
        setConfettiParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            opacity: 1 - progress
          }))
        );
        requestAnimationFrame(animateConfetti);
      } else {
        setConfettiParticles([]);
      }
    };
    
    requestAnimationFrame(animateConfetti);
  };

  // Scroll to milestone card
  const scrollToMilestone = (milestoneNumber: number) => {
    const milestoneElement = document.getElementById(`milestone-${milestoneNumber}`);
    if (!milestoneElement) return;
    
    const rect = milestoneElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if at least 60% visible
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityPercent = (visibleHeight / rect.height) * 100;
    
    if (visibilityPercent < 60) {
      milestoneElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Handle node hover
  const handleNodeHover = (milestoneNumber: number | null, event?: React.MouseEvent<HTMLDivElement>) => {
    setHoveredNode(milestoneNumber);
    
    if (milestoneNumber !== null && event && trackRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    } else {
      setTooltipPosition(null);
    }
  };

  // Handle node click
  const handleNodeClick = (milestoneNumber: number) => {
    if (onNodeClick) {
      onNodeClick(milestoneNumber);
    }
  };

  // Get node style based on status and animation state
  const getNodeStyle = (milestone: Milestone, index: number) => {
    const isCompleting = completingNodeNumber === milestone.number;
    const isStarting = startingNodeNumber === milestone.number;
    
    // If completing, transition to completed style
    if (isCompleting) {
      return {
        background: '#22C55E',
        size: 14,
        showCheck: true,
        glow: false,
        scale: 1,
        checkOpacity: 1
      };
    }
    
    // If starting, show starting animation
    if (isStarting) {
      return {
        background: '#6A5CFF',
        size: 18,
        showCheck: false,
        glow: true,
        scale: 1.12,
        checkOpacity: 0
      };
    }
    
    // Normal states
    switch (milestone.status) {
      case 'Completed':
        return {
          background: '#22C55E',
          size: 14,
          showCheck: true,
          glow: false,
          scale: 1,
          checkOpacity: 1
        };
      case 'In Progress':
        return {
          background: '#6A5CFF',
          size: 18,
          showCheck: false,
          glow: true,
          scale: 1,
          checkOpacity: 0
        };
      case 'Pending':
        return {
          background: '#D1D5DB',
          size: 14,
          showCheck: false,
          glow: false,
          scale: 1,
          checkOpacity: 0
        };
      default:
        return {
          background: '#D1D5DB',
          size: 14,
          showCheck: false,
          glow: false,
          scale: 1,
          checkOpacity: 0
        };
    }
  };

  return (
    <div
      className="bg-white relative"
      style={{
        borderRadius: '14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        padding: '20px 24px',
        marginBottom: '20px'
      }}
    >
      {/* Confetti particles */}
      {confettiParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: '50%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: particle.color,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) translate(${particle.vx * 10}px, ${particle.y * 10}px)`,
            transition: 'none'
          }}
        />
      ))}

      {/* Header Labels */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">
          Milestone Progress
        </h4>
        <p 
          className="text-xs font-medium text-gray-600 px-2 py-1 rounded transition-all duration-300"
          style={{
            backgroundColor: counterHighlight ? 'rgba(34, 197, 94, 0.10)' : 'transparent'
          }}
        >
          {completedCount} of {totalMilestones} milestones completed
        </p>
      </div>

      {/* Progress Track Container */}
      <div className="relative" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
        {/* Background Track */}
        <div
          ref={trackRef}
          className="relative w-full"
          style={{
            height: '4px',
            background: '#E6E8F0',
            borderRadius: '4px'
          }}
        >
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${animatedProgress}%`,
              background: 'linear-gradient(90deg, #6A5CFF 0%, #8A5BFF 100%)',
              borderRadius: '4px',
              transition: 'none'
            }}
          />

          {/* Moving Pulse Dot */}
          {pulsePosition !== null && (
            <div
              className="absolute top-1/2"
              style={{
                left: `${pulsePosition}%`,
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6A5CFF',
                boxShadow: '0 0 12px rgba(106, 92, 255, 0.5)',
                animation: 'pulseDot 600ms ease-out',
                pointerEvents: 'none'
              }}
            />
          )}

          {/* Milestone Nodes */}
          {milestones.map((milestone, index) => {
            const nodeStyle = getNodeStyle(milestone, index);
            const position = (index / (totalMilestones - 1)) * 100;
            const isStarting = startingNodeNumber === milestone.number;
            const isCompleting = completingNodeNumber === milestone.number;
            
            return (
              <div
                key={milestone.number}
                className="absolute"
                style={{
                  left: `${position}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease-out'
                }}
                onMouseEnter={(e) => handleNodeHover(milestone.number, e)}
                onMouseLeave={() => handleNodeHover(null)}
                onClick={() => handleNodeClick(milestone.number)}
              >
                {/* Glow effect for In Progress */}
                {nodeStyle.glow && (
                  <div
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: nodeStyle.size + 12,
                      height: nodeStyle.size + 12,
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(106, 92, 255, 0.15)',
                      borderRadius: '50%',
                      animation: isStarting ? 'glowAppear 220ms ease-out forwards' : 'pulse 2s ease-in-out infinite',
                      opacity: isStarting ? 0 : 1
                    }}
                  />
                )}

                {/* Node Circle */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: nodeStyle.size,
                    height: nodeStyle.size,
                    background: nodeStyle.background,
                    borderRadius: '50%',
                    transition: isCompleting 
                      ? 'background 250ms ease-out, width 250ms ease-out, height 250ms ease-out' 
                      : isStarting
                        ? 'all 240ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : 'all 200ms ease-out',
                    transform: `scale(${hoveredNode === milestone.number ? 1.2 : nodeStyle.scale})`
                  }}
                >
                  {/* Check icon for completed */}
                  {nodeStyle.showCheck && (
                    <Check 
                      className="text-white" 
                      size={9} 
                      strokeWidth={3}
                      style={{
                        opacity: nodeStyle.checkOpacity,
                        transition: isCompleting ? 'opacity 180ms ease-in 70ms' : 'opacity 200ms ease-out'
                      }}
                    />
                  )}
                  
                  {/* Inner dot for In Progress */}
                  {milestone.status === 'In Progress' && !isStarting && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        background: '#FFFFFF',
                        borderRadius: '50%'
                      }}
                    />
                  )}
                  
                  {/* Inner dot for Pending */}
                  {milestone.status === 'Pending' && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        background: '#9CA3AF',
                        borderRadius: '50%'
                      }}
                    />
                  )}
                </div>

                {/* Status label - fades up when starting */}
                {isStarting && (
                  <div
                    className="absolute top-full left-1/2 mt-2 text-xs font-medium text-indigo-600 whitespace-nowrap"
                    style={{
                      transform: 'translateX(-50%)',
                      animation: 'fadeUp 220ms ease-out forwards',
                      opacity: 0
                    }}
                  >
                    In Progress
                  </div>
                )}

                {/* Tooltip */}
                {hoveredNode === milestone.number && tooltipPosition && (
                  <div
                    className="fixed z-50"
                    style={{
                      left: tooltipPosition.x,
                      top: tooltipPosition.y,
                      transform: 'translate(-50%, -100%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <div
                      className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg"
                      style={{
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        animation: 'fadeIn 150ms ease-out'
                      }}
                    >
                      <div className="font-semibold mb-1">{milestone.title}</div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{
                            background: nodeStyle.background
                          }}
                        />
                        <span>{milestone.status}</span>
                        <span>•</span>
                        <span>{milestone.durationDays} days</span>
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #111827'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(0);
          }
        }
        
        @keyframes pulseDot {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
        
        @keyframes glowAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
