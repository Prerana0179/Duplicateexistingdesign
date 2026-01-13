import { MapPin, Star, CheckCircle, Users, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

/**
 * Project Profile Card Component (Vendor View)
 * 
 * This component uses the EXACT SAME layout and compression logic as the 
 * Selected Vendor Card in Customer view to ensure visual parity.
 * 
 * IMAGE USAGE RULES:
 * - Uses project site image (NOT customer portrait) to communicate execution focus
 * - Priority: projectSiteImage > customerImage (fallback)
 * - Image type: Construction site, vendor branding, or neutral execution-themed
 * - Landscape format (16:9), 180px height, object-fit: cover
 * - Rounded corners: top-left and top-right only (12px)
 * - Content Safety: Avoid portraits, prefer project/site visuals
 * 
 * COMPRESSION RULES (Applied in same order as Customer view):
 * 1. Image height: 180px (10% reduction from original 200px)
 * 2. Content padding: 12px 14px 14px 14px
 * 3. Details section gap: 4px
 * 4. Divider margin: 8px 0
 * 5. Stats grid gap: 2
 * 6. Button height: 42px
 * 7. Typography: Tight line-heights (1.1-1.2)
 * 8. Icon sizes: 3.5 (14px)
 */

interface ProjectProfileCardProps {
  projectName: string;
  projectType: string;
  location: string;
  status: string;
  startDate: string;
  customerName: string;
  customerImage: string;
  projectId: string;
  plotSize: string;
  estimatedDays: string;
  milestonesCompleted: number;
  totalMilestones: number;
  projectSiteImage?: string; // Optional: Real project site photo
  onViewDetails?: () => void;
  onContactCustomer?: () => void;
  onUpdateProgress?: () => void;
}

export function ProjectProfileCard({
  projectName,
  projectType,
  location,
  status,
  startDate,
  customerName,
  customerImage,
  projectId,
  plotSize,
  estimatedDays,
  milestonesCompleted,
  totalMilestones,
  projectSiteImage,
  onViewDetails,
  onContactCustomer,
  onUpdateProgress,
}: ProjectProfileCardProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold text-lg mb-6" style={{ marginTop: 0 }}>
        Project Overview
      </h3>
      
      <div 
        className="bg-white rounded-xl overflow-hidden"
        style={{
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Landscape Hero Image - Fixed Height (SAME AS CUSTOMER VIEW) */}
        <div 
          className="w-full bg-gray-100 overflow-hidden flex-shrink-0"
          style={{
            height: '180px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <ImageWithFallback
            src={projectSiteImage || customerImage}
            alt={projectSiteImage ? `${projectName} construction site` : customerName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Area - Aggressive Compression (SAME AS CUSTOMER VIEW) */}
        <div 
          className="flex flex-col" 
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
            padding: '12px 14px 14px 14px'
          }}
        >
          {/* Project Details Section - Minimal Spacing */}
          <div className="flex flex-col flex-shrink-0" style={{ gap: '4px' }}>
            {/* Project Name */}
            <h4 className="font-semibold text-gray-900" style={{ fontSize: '19px', lineHeight: '1.15' }}>
              {projectName}
            </h4>
            
            {/* Project Type */}
            <p className="text-gray-500" style={{ fontSize: '13px', lineHeight: '1.2' }}>
              {projectType}
            </p>

            {/* Location + Status Badges Row */}
            <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '1px' }}>
              <div className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: '12px' }}>
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{location}</span>
              </div>
              
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: status === 'In Progress' ? '#DBEAFE' : '#D1FAE5',
                  color: status === 'In Progress' ? '#1E40AF' : '#065F46'
                }}
              >
                <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
                <span>{status}</span>
              </div>
            </div>

            {/* Customer + Start Date Row */}
            <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '13px', lineHeight: '1.2' }}>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                <span className="font-semibold text-gray-900">{customerName}</span>
              </div>
              <span className="text-gray-400">·</span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="font-medium">{startDate}</span>
              </div>
            </div>
          </div>

          {/* Divider - Minimal Margin (SAME AS CUSTOMER VIEW) */}
          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0', flexShrink: 0 }} />

          {/* Stats Section - Ultra Compressed (SAME AS CUSTOMER VIEW) */}
          <div className="grid grid-cols-4 gap-2 flex-shrink-0">
            {/* Stat 1 - Project ID */}
            <div className="flex flex-col" style={{ gap: '1px' }}>
              <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Project ID</div>
              <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>{projectId}</div>
            </div>

            {/* Stat 2 - Plot Size */}
            <div className="flex flex-col" style={{ gap: '1px' }}>
              <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Plot Size</div>
              <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>{plotSize}</div>
            </div>

            {/* Stat 3 - Timeline */}
            <div className="flex flex-col" style={{ gap: '1px' }}>
              <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Timeline</div>
              <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>{estimatedDays}</div>
            </div>

            {/* Stat 4 - Milestones */}
            <div className="flex flex-col" style={{ gap: '1px' }}>
              <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Milestones</div>
              <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>{milestonesCompleted}/{totalMilestones}</div>
            </div>
          </div>

          {/* Flexible Spacer - Minimal Constraint (SAME AS CUSTOMER VIEW) */}
          <div style={{ flex: 1, minHeight: '8px' }} />

          {/* Action Buttons - Bottom Anchored (SAME AS CUSTOMER VIEW) */}
          <div className="flex gap-2 flex-shrink-0">
            <button 
              onClick={onViewDetails}
              className="flex-1 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors"
              style={{ height: '42px' }}
            >
              View Details
            </button>
            
            <button 
              onClick={onContactCustomer}
              className="flex-1 bg-white text-black rounded-lg text-sm font-medium border border-black hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-colors"
              style={{ height: '42px' }}
            >
              Contact Customer
            </button>
            
            <button 
              onClick={onUpdateProgress}
              className="flex-1 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] active:bg-[#2563EB] transition-colors"
              style={{ height: '42px' }}
            >
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}