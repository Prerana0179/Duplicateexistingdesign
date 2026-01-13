import { useState } from 'react';
import { FinancialBreakdownOverlay } from './FinancialBreakdownOverlay';

export function ProjectFinancialsCard() {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-base mb-6">Project Financials</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold">$150k</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold">$100k</p>
            <p className="text-xs text-gray-500">Paid</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">$140k</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div>
            <p className="text-2xl font-bold">10</p>
            <p className="text-xs text-gray-500">Active Milestones</p>
          </div>
        </div>
        <button 
          onClick={() => setIsBreakdownOpen(true)}
          className="text-black text-sm font-medium underline mt-4 w-full text-left"
        >
          View detailed breakdown →
        </button>
      </div>

      {/* Financial Breakdown Overlay */}
      <FinancialBreakdownOverlay 
        isOpen={isBreakdownOpen} 
        onClose={() => setIsBreakdownOpen(false)} 
      />
    </>
  );
}