import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import tatvaLogo from 'figma:asset/b1d943d8149d597dba9db6f941a9ce677dc51b05.png';

/**
 * InspectionReportModal - Vendor inspection report details
 * 
 * ICON STANDARDS (MUST MATCH FloatingActionButtons):
 * - All icons from lucide-react
 * - Icon sizing: 20-22px (w-5 h-5 for small, w-8 h-8 for large)
 * - Stroke width: 2 (strokeWidth={2})
 * - Consistent color scheme with side-nav action buttons
 * 
 * This ensures a unified icon language across the entire TatvaOps platform.
 */

export interface ProjectData {
  projectId: string;
  enquiryId: string;
  projectName: string;
  location: string;
  plotSize: string;
  constructionType: string;
}

export interface Milestone {
  number: number;
  details: string;
  timeline: string;
  amount: string;
}

export interface VendorInspectionData {
  vendorId: string;
  vendorName: string;
  inspector: string;
  inspectionDate: string;
  reportStatus: string;
  milestones: Milestone[];
  totalAmount: string;
  agreementPdfUrlPreview: string;
  notes: string[];
}

interface InspectionReportModalProps {
  vendorId: string;
  vendorName: string;
  agreementPdfUrlPreview?: string;
  onClose: () => void;
  onProceedToAgreement?: () => void;
  projectData: ProjectData;
  vendorInspectionData: VendorInspectionData;
  allVendorsReviewed: boolean;
}

export function InspectionReportModal({ 
  vendorId, 
  vendorName, 
  agreementPdfUrlPreview,
  onClose, 
  onProceedToAgreement,
  projectData,
  vendorInspectionData,
  allVendorsReviewed
}: InspectionReportModalProps) {
  
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  
  // Use vendor-specific PDF URL from vendorInspectionData
  const pdfViewUrl = vendorInspectionData.agreementPdfUrlPreview;
  
  const handleOpenPdf = () => {
    window.open(pdfViewUrl, '_blank');
  };
  
  const handleLeftButtonClick = () => {
    if (allVendorsReviewed) {
      setShowRejectConfirmation(true);
    } else {
      onClose();
    }
  };
  
  const handleConfirmReject = () => {
    setShowRejectConfirmation(false);
    // TODO: Implement rejection logic
    console.log('Vendor quotes rejected');
    onClose();
  };
  
  const handleProceedToAgreement = () => {
    onProceedToAgreement?.();
  };
  
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showRejectConfirmation) {
          setShowRejectConfirmation(false);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showRejectConfirmation]);

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Blurred Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-md"
        style={{ backdropFilter: 'blur(8px)' }}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-[20px] shadow-2xl w-[820px] max-w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-5 border-b border-gray-200">
          <div>
            {/* Exact Tatva Logo Brand Lockup from Reference Image - Increased Size for Prominence */}
            <div className="mb-4">
              <img 
                src={tatvaLogo} 
                alt="Tatva Ops - Inspection Report" 
                style={{ height: '44px' }}
                className="h-auto"
              />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Inspection Report
            </h2>
            <p className="text-sm text-gray-600">
              Tatva Ops – Inspection & Contract Summary
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Enquiry Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enquiry Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project Name:</span>
                <p className="font-medium text-gray-900 mt-1">{projectData.projectName}</p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium text-gray-900 mt-1">{projectData.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Plot Size:</span>
                <p className="font-medium text-gray-900 mt-1">{projectData.plotSize}</p>
              </div>
              <div>
                <span className="text-gray-600">Construction Type:</span>
                <p className="font-medium text-gray-900 mt-1">{projectData.constructionType}</p>
              </div>
            </div>
          </div>

          {/* Inspection Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspection Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vendor Name:</span>
                <p className="font-medium text-gray-900 mt-1">{vendorName}</p>
              </div>
              <div>
                <span className="text-gray-600">Inspection Date:</span>
                <p className="font-medium text-gray-900 mt-1">{vendorInspectionData.inspectionDate}</p>
              </div>
              <div>
                <span className="text-gray-600">Inspector:</span>
                <p className="font-medium text-gray-900 mt-1">{vendorInspectionData.inspector}</p>
              </div>
              <div>
                <span className="text-gray-600">Report Status:</span>
                <p className="font-medium text-green-600 mt-1">{vendorInspectionData.reportStatus}</p>
              </div>
            </div>
          </div>

          {/* Milestones Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Milestones & Payment Schedule</h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-1">No.</div>
                <div className="col-span-6">Milestone Details</div>
                <div className="col-span-2">Timeline</div>
                <div className="col-span-3 text-right">Amount</div>
              </div>

              {/* Table Rows */}
              {vendorInspectionData.milestones.map((milestone, index) => (
                <div 
                  key={milestone.number}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 text-sm ${
                    index !== vendorInspectionData.milestones.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="col-span-1 text-gray-600">{milestone.number}</div>
                  <div className="col-span-6 text-gray-900">{milestone.details}</div>
                  <div className="col-span-2 text-gray-600">{milestone.timeline}</div>
                  <div className="col-span-3 text-right font-medium text-gray-900">{milestone.amount}</div>
                </div>
              ))}

              {/* Total Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
                <div className="col-span-7"></div>
                <div className="col-span-2 font-semibold text-gray-900">Total Amount:</div>
                <div className="col-span-3 text-right font-bold text-lg text-gray-900">{vendorInspectionData.totalAmount}</div>
              </div>
            </div>
          </div>

          {/* PDF Viewer - SLA Contract Template */}
          <div className="mb-6">
            <button
              onClick={handleOpenPdf}
              className="w-full flex items-center justify-between bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
              style={{ height: '64px' }}
            >
              {/* Left Side - Icon & Text */}
              <div className="flex items-center gap-3">
                {/* Red PDF Icon - Using consistent icon sizing */}
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-red-600" strokeWidth={2} />
                </div>
                
                {/* Text Stack */}
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">
                    TriParty Service Agreement Template
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    PDF • 16 MB
                  </p>
                </div>
              </div>

              {/* Right Side - External Link Icon - Using consistent icon sizing */}
              <div className="flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Additional Notes */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              {vendorInspectionData.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleLeftButtonClick}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {allVendorsReviewed ? 'Reject' : 'Close'}
          </button>
          <button
            onClick={handleProceedToAgreement}
            className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors"
          >
            Proceed to Agreement
          </button>
        </div>
      </div>
      
      {/* Reject Confirmation Modal */}
      {showRejectConfirmation && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
          onClick={() => setShowRejectConfirmation(false)}
        >
          <div 
            className="bg-white rounded-[16px] shadow-2xl w-[480px] max-w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confirmation Header */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Reject Vendor Quotes?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to reject these vendor quotations? You can request new options anytime.
            </p>
            
            {/* Confirmation Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRejectConfirmation(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}