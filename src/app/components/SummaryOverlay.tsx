import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SummaryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SummaryOverlay({ isOpen, onClose }: SummaryOverlayProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Click to close */}
      <div 
        className="fixed inset-0 bg-black/25 z-40 flex items-center justify-center"
        style={{ 
          transition: 'opacity 200ms ease-out',
          animation: 'fadeIn 200ms ease-out'
        }}
        onClick={onClose}
      >
        {/* Modal - Click inside doesn't close */}
        <div
          className="bg-white shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: '720px',
            maxHeight: '80vh',
            borderRadius: '16px',
            animation: 'scaleIn 200ms ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between flex-shrink-0">
            <h2 className="text-2xl font-semibold">Project Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="px-8 py-6 space-y-8 overflow-y-auto">
            {/* Project Overview */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Project Overview</h3>
              <p className="text-sm text-gray-900">
                Residential Construction request: General service request. Standard service request.
              </p>
            </div>

            {/* Scope of Work */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Scope of Work</h3>
              <div className="text-sm text-gray-900 space-y-2">
                <p>On-site inspection and assessment for Residential Construction.</p>
                <p>Address general service request.</p>
                <p>Implementation of recommended solutions.</p>
                <p>Testing and quality verification upon completion.</p>
              </div>
            </div>

            {/* Client Requirements */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Client Requirements</h3>
              <div className="text-sm text-gray-900 space-y-2">
                <p>Service completion as per agreed timeline.</p>
                <p>Client to provide access details.</p>
              </div>
            </div>

            {/* Technical Specs */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Technical Specs</h3>
              <div className="text-sm text-gray-900 space-y-1">
                <p><span className="font-medium">plotType:</span> DTCP</p>
                <p><span className="font-medium">structureType:</span> Hybrid</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Timeline</h3>
              <div className="text-sm text-gray-900 space-y-2">
                <p>Timeline to be confirmed based on assessment.</p>
                <p>Scheduling to be coordinated with client.</p>
              </div>
            </div>

            {/* Special Considerations */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Special Considerations</h3>
              <p className="text-sm text-gray-900">No special considerations noted.</p>
            </div>

            {/* Estimated Scope */}
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Estimated Scope</h3>
              <p className="text-sm text-gray-900">
                Not specified | Complexity: Medium | Budget: Not provided
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}