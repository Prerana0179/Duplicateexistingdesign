import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

interface PaymentSuccessModalProps {
  onClose: () => void;
  vendorId?: string | null;
}

export function PaymentSuccessModal({ onClose, vendorId }: PaymentSuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // Auto-dismiss after 2.5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-md"
        style={{ backdropFilter: 'blur(8px)' }}
      />
      
      {/* Success Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-[400px] max-w-[90vw] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-3">
          Payment Successful
        </h2>

        {/* Subtext */}
        <p className="text-sm text-gray-600 text-center mb-6">
          Site inspection has been scheduled successfully.
        </p>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-[#1A1A1A] active:bg-black transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}