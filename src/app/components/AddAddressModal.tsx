import { X, Home, Briefcase, MapPin, Send, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAddressModal({ isOpen, onClose }: AddAddressModalProps) {
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Others'>('Home');
  const [formData, setFormData] = useState({
    buildingNo: '',
    buildingName: '',
    floor: '',
    street: '',
    locality: '',
    district: '',
    state: '',
    zipcode: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSave = () => {
    // Validate required fields
    const newErrors: Record<string, boolean> = {};
    if (!formData.buildingNo.trim()) newErrors.buildingNo = true;
    if (!formData.state.trim()) newErrors.state = true;
    if (!formData.zipcode.trim()) newErrors.zipcode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save successful - close modal
    console.log('Address saved:', { addressType, ...formData });
    onClose();
    
    // Reset form
    setFormData({
      buildingNo: '',
      buildingName: '',
      floor: '',
      street: '',
      locality: '',
      district: '',
      state: '',
      zipcode: ''
    });
    setAddressType('Home');
    setErrors({});
  };

  const handleResetAddress = () => {
    // Clear all form fields
    setFormData({
      buildingNo: '',
      buildingName: '',
      floor: '',
      street: '',
      locality: '',
      district: '',
      state: '',
      zipcode: ''
    });
    // Reset address type to default
    setAddressType('Home');
    // Clear any validation errors
    setErrors({});
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const addressTypeOptions = [
    { value: 'Home' as const, icon: Home, label: 'Home' },
    { value: 'Work' as const, icon: Briefcase, label: 'Work' },
    { value: 'Others' as const, icon: MapPin, label: 'Others' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={handleOverlayClick}
      style={{
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white w-full max-w-[600px]"
        style={{
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
          animation: 'modalScaleIn 0.22s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '18px 20px 18px 20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Title and Close Button */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[24px] font-semibold text-gray-900">Add New Address</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400" strokeWidth={2} />
          </button>
        </div>

        {/* Address Type Section */}
        <div className="mb-4">
          <label className="block text-[13px] font-normal text-gray-600 mb-2">
            Address Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {addressTypeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setAddressType(value)}
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: addressType === value ? '#4A4A4A' : '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (addressType !== value) {
                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (addressType !== value) {
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Location Bar */}
        <button 
          style={{
            width: '100%',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            marginBottom: '8px',
            transition: 'background-color 0.15s ease'
          }}
          onClick={() => console.log('Get current location')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
        >
          <Send size={16} strokeWidth={2} />
          <span>Current Location</span>
        </button>

        {/* Reset Address Text Action */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px'
          }}
        >
          <button
            onClick={handleResetAddress}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '12px',
              fontWeight: 500,
              color: '#6B7280',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6B7280';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Reset Address
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1: Building/House No & Building Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Building/House No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 123"
                value={formData.buildingNo}
                onChange={(e) => handleInputChange('buildingNo', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: errors.buildingNo ? '1px solid #EF4444' : '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.buildingNo) {
                    e.target.style.borderColor = '#000000';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.buildingNo) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.buildingNo && (
                <p className="text-[11px] text-red-500 mt-1">This field is required</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Building Name
              </label>
              <input
                type="text"
                placeholder="e.g., Sunrise Apartments"
                value={formData.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Row 2: Floor & Street */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Floor
              </label>
              <input
                type="text"
                placeholder="e.g., 3rd Floor"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Street
              </label>
              <input
                type="text"
                placeholder="Street name"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Row 3: Locality/Area (full width) */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Locality/Area
            </label>
            <input
              type="text"
              placeholder="Locality or Area"
              value={formData.locality}
              onChange={(e) => handleInputChange('locality', e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                padding: '0 12px',
                fontSize: '14px',
                color: '#1F2937',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#000000';
                e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Row 4: District, State, Zip/Pincode */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                District
              </label>
              <input
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#000000';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: errors.state ? '1px solid #EF4444' : '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.state) {
                    e.target.style.borderColor = '#000000';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.state) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.state && (
                <p className="text-[11px] text-red-500 mt-1">Required</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Zip/Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="6-digit code"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: errors.zipcode ? '1px solid #EF4444' : '1px solid #E5E7EB',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#1F2937',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.zipcode) {
                    e.target.style.borderColor = '#000000';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.zipcode) {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.zipcode && (
                <p className="text-[11px] text-red-500 mt-1">Required</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '42px',
              padding: '0 20px',
              borderRadius: '10px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            <X size={16} strokeWidth={2} />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '42px',
              padding: '0 20px',
              borderRadius: '10px',
              backgroundColor: '#BDBDBD',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0A0A0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#BDBDBD'}
          >
            <Check size={16} strokeWidth={2} />
            <span>Save Address</span>
          </button>
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

        @keyframes modalScaleIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}