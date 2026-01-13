import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, CheckCircle, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { SiteInspectionModal } from './SiteInspectionModal';
import { PaymentSuccessModal } from './PaymentSuccessModal';
import { InspectionReportModal, ProjectData, VendorInspectionData } from './InspectionReportModal';
import { useVendorSelection } from '@/app/contexts/VendorSelectionContext';

interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  experience: string;
  image: string;
  verified: boolean;
  recommended?: boolean;
  badges: string[];
  inspectionCompleted?: boolean;
  agreementPdfUrlPreview?: string;
  inspectionReportId?: string;
  inspectionPaid?: boolean;
  inspectionStatus?: 'pending' | 'in_progress' | 'completed';
}

const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Apex Construction Ltd.',
    location: 'Hyderabad',
    rating: 4.5,
    experience: '12+ Years Experience',
    image: 'https://images.unsplash.com/photo-1765648580890-732fa6d769c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzYyOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    badges: ['GST Verified', 'Approved'],
    inspectionCompleted: false,
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    inspectionReportId: 'insp_vendor_1',
  },
  {
    id: '2',
    name: 'BuildRight Solutions',
    location: 'Bangalore',
    rating: 4.8,
    experience: '10+ Years Experience',
    image: 'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYW5hZ2VyfGVufDF8fHx8MTc2NzY4ODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    recommended: true,
    badges: ['GST Verified', 'CZ Approved'],
    inspectionCompleted: false,
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    inspectionReportId: 'insp_vendor_2',
  },
  {
    id: '3',
    name: 'Urban Infra Group',
    location: 'Hyderabad',
    rating: 4.5,
    experience: '8+ Years Experience',
    image: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2NzcxODk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    badges: ['GST Verified', 'CZ Approved'],
    inspectionCompleted: false,
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    inspectionReportId: 'insp_vendor_3',
  },
];

// Shared project data (same for all vendors)
const projectData: ProjectData = {
  projectId: 'PROJ-2026-001',
  enquiryId: 'ENQ-2026-001',
  projectName: 'Residential Villa Construction',
  location: 'Gachibowli, Hyderabad',
  plotSize: '2400 sq.ft',
  constructionType: 'G+1 Floor',
};

// Vendor-specific inspection/quote data (different per vendor)
const vendorInspections: Record<string, VendorInspectionData> = {
  '1': {
    vendorId: '1',
    vendorName: 'Apex Construction Ltd.',
    inspector: 'Rajesh Kumar (Tatva Ops)',
    inspectionDate: 'Jan 12, 2026',
    reportStatus: 'Approved',
    milestones: [
      {
        number: 1,
        details: 'Foundation & Plinth work completion',
        timeline: '15 Days',
        amount: '₹2,50,000'
      },
      {
        number: 2,
        details: 'First floor slab completion',
        timeline: '30 Days',
        amount: '₹3,00,000'
      },
      {
        number: 3,
        details: 'Roof slab & waterproofing',
        timeline: '45 Days',
        amount: '₹2,50,000'
      },
      {
        number: 4,
        details: 'Electrical & Plumbing installation',
        timeline: '60 Days',
        amount: '₹1,50,000'
      },
      {
        number: 5,
        details: 'Flooring, Painting & Finishing work',
        timeline: '75 Days',
        amount: '₹2,00,000'
      }
    ],
    totalAmount: '₹11,50,000',
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    notes: [
      'Payment terms: Milestone-based as per schedule above',
      'All materials will be provided by the contractor',
      'Work warranty: 1 year from completion date',
      'GST (18%) will be applicable on all payments'
    ]
  },
  '2': {
    vendorId: '2',
    vendorName: 'BuildRight Solutions',
    inspector: 'Suresh Reddy (Tatva Ops)',
    inspectionDate: 'Jan 13, 2026',
    reportStatus: 'Approved',
    milestones: [
      {
        number: 1,
        details: 'Site preparation & Foundation work',
        timeline: '12 Days',
        amount: '₹2,80,000'
      },
      {
        number: 2,
        details: 'Ground floor & First floor structure',
        timeline: '28 Days',
        amount: '₹3,50,000'
      },
      {
        number: 3,
        details: 'Roof construction & waterproofing',
        timeline: '42 Days',
        amount: '₹2,75,000'
      },
      {
        number: 4,
        details: 'MEP (Mechanical, Electrical, Plumbing)',
        timeline: '56 Days',
        amount: '₹1,80,000'
      },
      {
        number: 5,
        details: 'Interior finishing & final touches',
        timeline: '70 Days',
        amount: '₹2,40,000'
      }
    ],
    totalAmount: '₹13,25,000',
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    notes: [
      'Payment terms: Advance + 4 milestone-based payments',
      'Premium quality materials included',
      'Work warranty: 2 years from completion date',
      'GST (18%) will be applicable on all payments'
    ]
  },
  '3': {
    vendorId: '3',
    vendorName: 'Urban Infra Group',
    inspector: 'Anil Varma (Tatva Ops)',
    inspectionDate: 'Jan 14, 2026',
    reportStatus: 'Approved',
    milestones: [
      {
        number: 1,
        details: 'Foundation & base slab work',
        timeline: '18 Days',
        amount: '₹2,20,000'
      },
      {
        number: 2,
        details: 'Column & beam construction',
        timeline: '32 Days',
        amount: '₹2,80,000'
      },
      {
        number: 3,
        details: 'Roofing & terrace waterproofing',
        timeline: '48 Days',
        amount: '₹2,30,000'
      },
      {
        number: 4,
        details: 'Electrical, Plumbing & sanitary work',
        timeline: '64 Days',
        amount: '₹1,40,000'
      },
      {
        number: 5,
        details: 'Flooring, tiling & painting',
        timeline: '80 Days',
        amount: '₹1,90,000'
      }
    ],
    totalAmount: '₹10,60,000',
    agreementPdfUrlPreview: 'https://drive.google.com/file/d/1BHzqVE501hlGYBQ8gOWBk06n5uKqYOgr/preview',
    notes: [
      'Payment terms: Milestone-based as per schedule above',
      'Standard materials as per customer specification',
      'Work warranty: 1 year from completion date',
      'GST (18%) will be applicable on all payments'
    ]
  }
};

export function VendorCards() {
  const navigate = useNavigate();
  const { 
    selectedVendorId: persistedVendorId, 
    selectVendor, 
    clearVendorSelection, 
    isVendorSelected,
    markInspectionCompleted 
  } = useVendorSelection();
  
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedVendors, setCompletedVendors] = useState<Set<string>>(new Set());
  const [reportVendorId, setReportVendorId] = useState<string | null>(null);
  const [reviewedVendors, setReviewedVendors] = useState<Set<string>>(new Set());
  const [inProgressVendors, setInProgressVendors] = useState<Set<string>>(new Set());
  const [showAgreementSuccess, setShowAgreementSuccess] = useState(false);
  const [selectedVendorName, setSelectedVendorName] = useState<string>('');
  const [agreementConfirmed, setAgreementConfirmed] = useState(false);
  const [confirmedVendorId, setConfirmedVendorId] = useState<string | null>(null);

  const handleProfileVisit = (vendorId: string) => {
    // Mark vendor as selected via "Profile Visit" action
    selectVendor(vendorId, 'profile');
    navigate(`/vendor/${vendorId}`);
  };

  const handleSiteInspection = (vendorId: string) => {
    // Check if vendor has completed inspection
    if (completedVendors.has(vendorId)) {
      // Mark vendor as reviewed when opening report
      setReviewedVendors(prev => new Set(prev).add(vendorId));
      // Show inspection report modal
      setReportVendorId(vendorId);
    } else {
      // Show site inspection scheduling modal
      setSelectedVendorId(vendorId);
    }
  };

  const handlePaymentSuccess = (vendorId: string) => {
    // Add vendor to in-progress state immediately after payment
    setInProgressVendors(prev => new Set(prev).add(vendorId));
    setPaymentSuccess(true);
    
    // Simulate inspection completion after a delay (in real app, this would come from backend)
    // For demo purposes: automatically move to completed after 10 seconds
    setTimeout(() => {
      setInProgressVendors(prev => {
        const newSet = new Set(prev);
        newSet.delete(vendorId);
        return newSet;
      });
      setCompletedVendors(prev => new Set(prev).add(vendorId));
      
      // Mark inspection as completed globally with current date
      markInspectionCompleted();
    }, 10000);
  };

  const handleCloseSuccessModal = () => {
    setPaymentSuccess(false);
    setSelectedVendorId(null);
  };

  const handleProceedToAgreement = () => {
    // Mark vendor as selected via "Quote & Contract" action
    if (reportVendorId) {
      selectVendor(reportVendorId, 'quote');
    }
    
    // Store the vendor ID for confirmation
    const vendor = vendors.find(v => v.id === reportVendorId);
    if (vendor) {
      setSelectedVendorName(vendor.name);
    }
    setReportVendorId(null);
    setShowAgreementSuccess(true);
  };

  const handleAgreementConfirm = () => {
    setShowAgreementSuccess(false);
  };

  // Determine which vendor to show in single-vendor mode
  const displayVendorId = persistedVendorId;

  return (
    <div className="flex flex-col h-full">
      {/* Header with optional Change Vendor button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg" style={{ marginTop: 0 }}>
          {isVendorSelected ? 'Selected Vendor' : 'Available Verified Vendors'}
        </h3>
        
        {/* Change Vendor Button - only show if vendor is selected */}
        {isVendorSelected && (
          <button
            onClick={clearVendorSelection}
            className="text-sm text-gray-600 hover:text-black font-medium transition-colors"
          >
            Change Vendor
          </button>
        )}
      </div>
      
      {/* SINGLE VENDOR MODE: Show only selected vendor's landscape card */}
      {isVendorSelected && displayVendorId && (() => {
        const selectedVendor = vendors.find(v => v.id === displayVendorId);
        if (!selectedVendor) return null;

        return (
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
            {/* Landscape Hero Image - Fixed Height */}
            <div 
              className="w-full bg-gray-100 overflow-hidden flex-shrink-0"
              style={{
                height: '180px',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}
            >
              <ImageWithFallback
                src={selectedVendor.image}
                alt={selectedVendor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Area - Aggressive Compression */}
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
              {/* Vendor Details Section - Minimal Spacing */}
              <div className="flex flex-col flex-shrink-0" style={{ gap: '4px' }}>
                {/* Vendor Name */}
                <h4 className="font-semibold text-gray-900" style={{ fontSize: '19px', lineHeight: '1.15' }}>
                  {selectedVendor.name}
                </h4>
                
                {/* Service Category */}
                <p className="text-gray-500" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                  Premium Construction Services
                </p>

                {/* Location + Badges Row */}
                <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '1px' }}>
                  <div className="flex items-center gap-1.5 text-gray-600" style={{ fontSize: '12px' }}>
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>{selectedVendor.location}</span>
                  </div>
                  
                  {selectedVendor.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: badge === 'GST Verified' ? '#D1FAE5' : '#DBEAFE',
                        color: badge === 'GST Verified' ? '#065F46' : '#1E40AF'
                      }}
                    >
                      <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>

                {/* Rating + Reviews + Experience Row */}
                <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" strokeWidth={2} />
                    <span className="font-semibold text-gray-900">{selectedVendor.rating}</span>
                    <span className="text-gray-500 text-xs">(240 reviews)</span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600 font-medium">{selectedVendor.experience}</span>
                </div>
              </div>

              {/* Divider - Minimal Margin */}
              <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 0', flexShrink: 0 }} />

              {/* Stats Section - Ultra Compressed */}
              <div className="grid grid-cols-4 gap-2 flex-shrink-0">
                {/* Stat 1 - Response Time */}
                <div className="flex flex-col" style={{ gap: '1px' }}>
                  <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Response Time</div>
                  <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>&lt; 30 mins</div>
                </div>

                {/* Stat 2 - Projects Completed */}
                <div className="flex flex-col" style={{ gap: '1px' }}>
                  <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Projects Done</div>
                  <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>120+</div>
                </div>

                {/* Stat 3 - Warranty */}
                <div className="flex flex-col" style={{ gap: '1px' }}>
                  <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Warranty</div>
                  <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>5 Years</div>
                </div>

                {/* Stat 4 - Service Radius */}
                <div className="flex flex-col" style={{ gap: '1px' }}>
                  <div className="text-xs text-gray-500 font-medium" style={{ lineHeight: '1.1' }}>Service Radius</div>
                  <div className="text-sm font-semibold text-gray-900" style={{ lineHeight: '1.15' }}>25 km</div>
                </div>
              </div>

              {/* Flexible Spacer - Minimal Constraint */}
              <div style={{ flex: 1, minHeight: '8px' }} />

              {/* Action Buttons - Bottom Anchored */}
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleProfileVisit(selectedVendor.id)}
                  className="flex-1 bg-black text-white rounded-lg text-sm font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors"
                  style={{ height: '42px' }}
                >
                  Profile Visit
                </button>
                
                <button 
                  onClick={() => handleSiteInspection(selectedVendor.id)}
                  className="flex-1 bg-white text-black rounded-lg text-sm font-medium border border-black hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-colors"
                  style={{ height: '42px' }}
                >
                  Quote & Contract
                </button>
                
                <button 
                  className="flex-1 bg-[#EF4444] text-white rounded-lg text-sm font-medium hover:bg-[#DC2626] active:bg-[#EF4444] transition-colors"
                  style={{ height: '42px' }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MULTI VENDOR MODE: Show vendor grid (only when NO vendor is selected) */}
      {!isVendorSelected && (
        <div className="grid grid-cols-3 gap-4">{vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            style={
              agreementConfirmed && vendor.id !== confirmedVendorId
                ? { animation: 'fadeOut 0.2s ease-out forwards' }
                : undefined
            }
          >
            {/* Vendor Image */}
            <div className="relative h-40 bg-gray-100 overflow-hidden rounded-t-xl">
              <ImageWithFallback
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Star Badge - Outside Image Container */}
            {vendor.recommended && (
              <div 
                className="absolute group z-10"
                style={{ top: '12px', left: '12px' }}
                tabIndex={0}
              >
                {/* Star Icon Container */}
                <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md">
                  <Star 
                    className="w-5 h-5 text-amber-500 fill-amber-500" 
                    strokeWidth={2}
                  />
                </div>
                
                {/* Tooltip */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 px-[10px] py-[6px] bg-[#111111] text-white text-[11px] font-medium rounded-md shadow-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 ease-out"
                  style={{ bottom: 'calc(100% + 8px)' }}
                >
                  Recommended by TatvaOps
                  
                  {/* Caret */}
                  <span
                    className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#111111]"
                    style={{ bottom: '-5px' }}
                  />
                </div>
              </div>
            )}
            
            {/* Vendor Info */}
            <div className="p-4">
              <h4 className="font-semibold text-sm mb-1">{vendor.name}</h4>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                <MapPin className="w-3 h-3" />
                <span>{vendor.location}</span>
              </div>

              <div className="flex items-center gap-3 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span className="font-medium">{vendor.rating}</span>
                </div>
                <span className="text-gray-600">{vendor.experience}</span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {vendor.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-xs text-gray-600"
                  >
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleProfileVisit(vendor.id)}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors cursor-pointer"
                >
                  Profile Visit
                </button>
                
                {/* CTA Button - Three States */}
                {completedVendors.has(vendor.id) ? (
                  // STATE 3: Inspection Completed - Quote & Contract (enabled)
                  <button 
                    onClick={() => handleSiteInspection(vendor.id)}
                    className="w-full bg-white text-black py-2 rounded-lg text-sm font-medium border border-black hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-colors"
                  >
                    Quote & Contract
                  </button>
                ) : inProgressVendors.has(vendor.id) ? (
                  // STATE 2: In Progress (disabled, non-clickable with animated sweep)
                  <button 
                    disabled
                    className="in-progress-sweep w-full bg-white text-black py-2 rounded-lg text-sm font-medium border border-black cursor-not-allowed opacity-60"
                  >
                    <span className="relative z-10">In Progress</span>
                  </button>
                ) : (
                  // STATE 1: Site Inspection (enabled)
                  <button 
                    onClick={() => handleSiteInspection(vendor.id)}
                    className="w-full bg-white text-black py-2 rounded-lg text-sm font-medium border border-black hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-colors"
                  >
                    Site Inspection
                  </button>
                )}
                
                {/* Secondary Button - Conditional Styling */}
                <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  completedVendors.has(vendor.id)
                    ? 'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#EF4444]'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] active:bg-[#F3F4F6]'
                }`}>
                  {completedVendors.has(vendor.id) ? 'Reject' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Site Inspection Modal */}
      {selectedVendorId && (
        <SiteInspectionModal
          vendorId={selectedVendorId}
          onClose={() => setSelectedVendorId(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <PaymentSuccessModal
          onClose={handleCloseSuccessModal}
          vendorId={selectedVendorId}
        />
      )}

      {/* Inspection Report Modal */}
      {reportVendorId && (() => {
        const vendor = vendors.find(v => v.id === reportVendorId);
        return vendor ? (
          <InspectionReportModal
            vendorId={reportVendorId}
            vendorName={vendor.name}
            agreementPdfUrlPreview={vendor.agreementPdfUrlPreview}
            onClose={() => setReportVendorId(null)}
            onProceedToAgreement={handleProceedToAgreement}
            projectData={projectData}
            vendorInspectionData={vendorInspections[reportVendorId]}
            allVendorsReviewed={reviewedVendors.size >= 3}
          />
        ) : null;
      })()}

      {/* Agreement Success Modal */}
      {showAgreementSuccess && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          style={{
            animation: 'fadeIn 0.15s ease-out'
          }}
          onClick={() => setShowAgreementSuccess(false)}
        >
          {/* Blurred Glass Backdrop */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />
          
          {/* Success Card */}
          <div 
            className="relative bg-white rounded-[24px] shadow-2xl w-[420px] max-w-full p-10 flex flex-col items-center"
            style={{
              animation: 'scaleIn 0.25s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Green Success Icon */}
            <div className="mb-6">
              <CheckCircle2 
                className="w-20 h-20 text-green-500" 
                strokeWidth={2}
              />
            </div>
            
            {/* Title with emoji */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Agreement Initiated 🎉
            </h3>
            
            {/* Message */}
            <p className="text-sm text-gray-600 mb-2 text-center leading-relaxed">
              Congratulations! You have successfully selected <strong>{selectedVendorName}</strong> for your project.
            </p>
            
            {/* Subtext */}
            <p className="text-xs text-gray-500 mb-8 text-center">
              We'll now proceed with the agreement and next steps.
            </p>
            
            {/* Continue Button */}
            <button
              onClick={handleAgreementConfirm}
              className="px-10 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors w-full"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}