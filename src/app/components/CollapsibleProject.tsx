import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { HorizontalTimeline } from './HorizontalTimeline';
import { DetailsRow } from './DetailsRow';
import { ProjectFinancialsCard } from './ProjectFinancialsCard';
import { Milestones } from './Milestones';
import { VendorCards } from './VendorCards';
import { QuestionsAnswers } from './QuestionsAnswers';
import { ProjectMilestonesWrapper } from './ProjectMilestonesWrapper';
import { CreateMilestone, MilestoneFormData } from './CreateMilestone';
import { ProjectDashboardLayout } from './ProjectDashboardLayout';
import { ProjectProfileCard } from './ProjectProfileCard';
import { InspectionCompletedBanner } from './InspectionCompletedBanner';
import { useRole } from '@/app/contexts/RoleContext';
import { useVendorSelection } from '@/app/contexts/VendorSelectionContext';

export function CollapsibleProject() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInspectionBanner, setShowInspectionBanner] = useState(false);
  const [milestoneFormData, setMilestoneFormData] = useState<MilestoneFormData | null>(null);
  const { currentRole } = useRole();
  const { 
    inspectionCompleted, 
    inspectionCompletionDate,
    milestonesGenerated,
    markMilestonesGenerated,
    clearMilestones 
  } = useVendorSelection();

  const handleRegenerateMilestones = () => {
    console.log('Regenerating milestones...');
    // Clear milestones to show Create Milestone form again
    clearMilestones();
    setMilestoneFormData(null);
  };

  const handleSiteInspectionClick = () => {
    // Step 1: Instant feedback - Show scheduling toast
    toast.info('Site inspection scheduled', {
      duration: 2000,
      icon: '📅',
    });

    // Step 2: Delayed confirmation - Show completion banner after 3 seconds
    setTimeout(() => {
      setShowInspectionBanner(true);
    }, 3000);
  };

  return (
    <div>
      {/* Dropdown Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
        style={{
          height: '64px',
          padding: '0 20px',
          backgroundColor: '#F2F2F2',
          borderRadius: '14px',
          marginBottom: isExpanded ? '24px' : '0',
        }}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Residential Construction</h2>
          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
            In Progress
          </span>
          <span className="text-sm text-gray-500">22 Jan 2024</span>
        </div>
        
        <ChevronDown
          className="text-gray-600 transition-transform"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transitionDuration: '220ms',
            transitionTimingFunction: 'ease-out',
          }}
          size={24}
        />
      </button>

      {/* Expandable Content */}
      <div
        style={{
          maxHeight: isExpanded ? '10000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 220ms ease-out',
        }}
      >
        <div
          className="bg-white"
          style={{
            borderRadius: '14px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
            padding: '32px',
          }}
        >
          {/* 1. Horizontal Timeline */}
          <div className="mb-8">
            <HorizontalTimeline />
          </div>

          {/* 2. Details Row - Project Details + Summary (expanded) */}
          <DetailsRow />

          {/* 3. Two Column Layout - Role-Based with Shared Layout System */}
          <ProjectDashboardLayout
            leftColumnTop={<ProjectFinancialsCard />}
            leftColumnBottom={<Milestones />}
            rightColumn={
              currentRole === 'Customer' ? (
                <VendorCards onSiteInspectionClick={handleSiteInspectionClick} />
              ) : (
                <ProjectProfileCard
                  projectName="Residential Villa Construction"
                  projectType="G+1 Floor Construction"
                  location="Gachibowli, Hyderabad"
                  status="In Progress"
                  startDate="Jan 22, 2024"
                  customerName="Rajesh Kumar"
                  customerImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  projectSiteImage="https://images.unsplash.com/photo-1580063665421-4c9cbe9ec11b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGNvbnN0cnVjdGlvbiUyMHByb2dyZXNzfGVufDF8fHx8MTc2ODI5OTgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  projectId="PRJ-001"
                  plotSize="2400 sq.ft"
                  estimatedDays="75 Days"
                  milestonesCompleted={2}
                  totalMilestones={5}
                  onViewDetails={() => console.log('View Details')}
                  onContactCustomer={() => console.log('Contact Customer')}
                  onUpdateProgress={() => console.log('Update Progress')}
                />
              )
            }
          />

          {/* 4. Role-Based Milestone Section - Full Width (matches Q&A) */}
          <div className="mb-8">
            {/* Inspection Completed Banner (shown ABOVE milestone section after Site Inspection click) */}
            {showInspectionBanner && (
              <div
                style={{
                  animation: 'inspectionBannerAppear 200ms ease-out',
                  transformOrigin: 'top'
                }}
              >
                <InspectionCompletedBanner
                  completionDate="14 Jan 2026"
                  className="mb-4"
                />
              </div>
            )}

            {currentRole === 'Customer' ? (
              // Customer View: NO milestone editing - customers only view project progress elsewhere
              null
            ) : (
              // Vendor View: SWAP between Create Milestone and Edit Milestones
              <>
                {!milestonesGenerated ? (
                  // Before Generation: Show Create Milestone form
                  <CreateMilestone 
                    onGenerateMilestones={(data) => {
                      console.log('Generate Milestones:', data);
                      // Store milestone form data
                      setMilestoneFormData(data);
                      // Mark milestones as generated (triggers swap to Edit Milestones)
                      markMilestonesGenerated();
                    }}
                    milestonesGenerated={milestonesGenerated}
                  />
                ) : (
                  // After Generation: Show Edit Milestones with fade-in animation
                  <div
                    style={{
                      animation: 'fadeSlideUp 150ms ease-out',
                      transformOrigin: 'top'
                    }}
                  >
                    <ProjectMilestonesWrapper 
                      onRegenerate={handleRegenerateMilestones}
                      showRegenerateButton={true}
                      milestoneFormData={milestoneFormData}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* 5. Questions & Answers */}
          <QuestionsAnswers />
        </div>
      </div>
    </div>
  );
}