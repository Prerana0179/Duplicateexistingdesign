import { Lock, Wallet } from 'lucide-react';

export function Milestones() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-base mb-6">Milestones</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">$10,000</p>
          <p className="text-xs text-gray-500">Funds Available in Holding</p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-sm font-medium">$130,000</p>
          <p className="text-xs text-gray-500">Remaining Balance</p>
        </div>
      </div>
    </div>
  );
}