import { MapPin, IndianRupee, Calendar } from 'lucide-react';
import { useState } from 'react';
import { SummaryOverlay } from './SummaryOverlay';

export function DetailsRow() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[350px_1fr] gap-6 mb-6">
        {/* Project Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-base mb-6">Project Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">DATE OF ENQUIRY</p>
              <p className="text-sm font-medium">02 Jan 2026</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Project ID</p>
              <p className="text-sm font-medium">1000060</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">VENDOR INFO</p>
              <p className="text-sm font-medium">BRIGADE GROUP CO</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">ESTIMATED SCOPE</p>
              <p className="text-sm font-medium">Not specified | Complexity: Medium | Budget: Not provided</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">SERVICE TYPE</p>
              <p className="text-sm font-medium">Residential Construction</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">PROGRESS INFO</p>
              <p className="text-sm font-medium">—</p>
            </div>
          </div>
        </div>

        {/* Summary - Now Full Width */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-base mb-6">Summary</h3>
          <div className="space-y-4">
            {/* Project Type */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">PROJECT TYPE</p>
              <p className="text-sm font-medium">Residential Construction</p>
            </div>

            {/* Scope Snapshot */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">SCOPE SNAPSHOT</p>
              <ul className="text-sm font-medium space-y-1">
                <li>• Civil construction & interior fit-out</li>
                <li>• On-site inspection and execution</li>
                <li>• Quality checks and final handover</li>
              </ul>
            </div>

            {/* Client Expectations */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">CLIENT EXPECTATIONS</p>
              <p className="text-sm font-medium">Modern, functional design</p>
              <p className="text-sm font-medium">Client to provide access details</p>
            </div>

            {/* Technical Snapshot */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">TECHNICAL SNAPSHOT</p>
              <p className="text-sm font-medium">DTCP Plot • Hybrid Structure</p>
            </div>

            {/* View Full Summary Button */}
            <button 
              onClick={() => setIsSummaryOpen(true)}
              className="text-black text-sm font-medium underline mt-2"
            >
              View Full Summary →
            </button>
          </div>
        </div>
      </div>

      {/* Summary Overlay */}
      <SummaryOverlay 
        isOpen={isSummaryOpen} 
        onClose={() => setIsSummaryOpen(false)} 
      />
    </>
  );
}