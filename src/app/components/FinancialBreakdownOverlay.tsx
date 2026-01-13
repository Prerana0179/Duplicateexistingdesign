import { useEffect } from 'react';
import { X } from 'lucide-react';

interface FinancialBreakdownOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancialBreakdownOverlay({ isOpen, onClose }: FinancialBreakdownOverlayProps) {
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/15 z-40"
        style={{ transition: 'opacity 220ms ease-out' }}
      />

      {/* Overlay Panel */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-50 shadow-2xl overflow-y-auto"
        style={{
          width: '42%',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
          animation: 'slideInFromRight 220ms ease-out',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Project Financial Breakdown</h2>
              <p className="text-sm text-gray-500 mt-1">Detailed payment & milestone information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-8">
          {/* Financial Overview */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-4 font-semibold">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Project Value</span>
                <span className="text-lg font-bold text-gray-900">₹0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Funds Paid</span>
                <span className="text-lg font-bold text-green-600">₹0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Successful Payments</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="text-lg font-bold text-orange-600">0</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-4 font-semibold">Milestones</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Milestones Planned</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Completed Milestones</span>
                <span className="text-lg font-bold text-blue-600">0</span>
              </div>
            </div>
          </div>

          {/* Latest Payment */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-4 font-semibold">Latest Payment</h3>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹1,000</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                    PENDING
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900">N/A</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm text-gray-900">02/01/2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}