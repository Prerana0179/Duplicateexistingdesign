import { User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useRole } from '../contexts/RoleContext';
import { AddAddressModal } from './AddAddressModal';

/**
 * Header - Global top navigation bar
 * 
 * DESIGN REFERENCE:
 * Matches qa.tatvaops.com/my-projects header exactly
 * 
 * STRUCTURE:
 * - Fixed at top of viewport
 * - Height: 64px
 * - Full width with right-aligned content
 * - TatvaOps logo + Profile icon
 */
export function Header() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const { currentRole, toggleRole } = useRole();

  // Click outside to close
  useEffect(() => {
    if (!isPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopoverOpen]);

  const handleMenuItemClick = (action: string) => {
    setIsPopoverOpen(false);
    
    if (action === 'Switch Account / Role') {
      toggleRole();
      const newRole = currentRole === 'Vendor' ? 'Customer' : 'Vendor';
      toast(`Switched to ${newRole} profile`, { duration: 2000 });
    } else if (action === 'Add Address') {
      setIsAddAddressOpen(true);
    } else {
      console.log(`Clicked: ${action}`);
    }
    // Add navigation logic here
  };

  // Dynamic label for role switching
  const roleSwitchLabel = currentRole === 'Customer' ? 'Switch to Vendor' : 'Switch to Customer';

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b"
      style={{
        height: '64px',
        borderBottomColor: '#F0F0F0',
        zIndex: 30,
      }}
    >
      <div className="h-full flex items-center justify-end" style={{ paddingRight: '24px' }}>
        {/* Right-Aligned Content Container */}
        <div className="flex items-center" style={{ gap: '12px', position: 'relative' }}>
          {/* TatvaOps Wordmark - Text Only */}
          <div 
            className="flex items-center" 
            style={{ 
              fontSize: '18px',
              lineHeight: '22px',
              fontWeight: 600,
              letterSpacing: 0,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
          >
            <span style={{ color: '#FF2B6E' }}>tatva</span>
            <span style={{ color: '#FF8A00' }}>:</span>
            <span style={{ color: '#6A1B9A' }}>Ops</span>
          </div>

          {/* Profile Icon */}
          <button
            ref={profileButtonRef}
            className="flex items-center justify-center rounded-full transition-colors hover:bg-gray-200"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#F5F5F5',
              cursor: 'pointer',
            }}
            title="Profile"
            aria-label="User profile"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <User size={18} strokeWidth={2} style={{ color: '#6B7280' }} />
          </button>

          {/* Profile Popover */}
          {isPopoverOpen && (
            <div
              ref={popoverRef}
              className="absolute"
              style={{
                top: '48px',
                right: '0',
                width: '220px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
                padding: '12px',
                zIndex: 40,
                animation: 'fadeSlideDown 170ms ease-out',
              }}
            >
              {/* User Info Section */}
              <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={16} strokeWidth={2} style={{ color: '#6B7280' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F2937', lineHeight: '1.4' }}>
                    Arvind Kumar
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EAEAEA', margin: '8px 0' }} />

              {/* Menu Items */}
              <div>
                {['My Profile', 'Account Settings', 'Add Address', roleSwitchLabel, 'Help & Support'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleMenuItemClick(item === roleSwitchLabel ? 'Switch Account / Role' : item)}
                    className="w-full text-left transition-colors"
                    style={{
                      padding: '10px',
                      fontSize: '14px',
                      color: '#1F2937',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F6F6F6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EAEAEA', margin: '8px 0' }} />

              {/* Logout */}
              <button
                onClick={() => handleMenuItemClick('Logout')}
                className="w-full text-left transition-colors"
                style={{
                  padding: '10px',
                  fontSize: '14px',
                  color: '#DC2626',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal isOpen={isAddAddressOpen} onClose={() => setIsAddAddressOpen(false)} />

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}