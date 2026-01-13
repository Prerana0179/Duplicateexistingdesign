import { Home, Briefcase, Layers, MessageCircle } from 'lucide-react';
import tatvaOpsLogo from 'figma:asset/4e65f32928ec1c24c3d2480d067ce09ec48a2ae5.png';

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'Projects' }: SidebarProps) {
  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Services', label: 'Services', icon: Briefcase },
    { id: 'Projects', label: 'Projects', icon: Layers },
    { id: 'Inbox', label: 'Inbox', icon: MessageCircle },
  ];

  return (
    <div 
      className="fixed flex flex-col items-center z-20"
      style={{ 
        width: '88px',
        top: '84px',
        left: '16px',
        minHeight: 'calc(100vh - 156px)',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        paddingTop: '16px',
        paddingBottom: '0px',
        position: 'fixed'
      }}
    >
      {/* TatvaOps Logo at Top */}
      <div 
        className="flex items-center justify-center" 
        style={{ 
          marginBottom: '14px',
          border: 'none',
          borderTop: 'none',
          outline: 'none'
        }}
      >
        <img 
          src={tatvaOpsLogo} 
          alt="TatvaOps"
          style={{ 
            height: '60px',
            width: 'auto',
            display: 'block',
            border: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Primary Navigation Items */}
      <div className="flex flex-col items-center" style={{ gap: '14px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;
          
          return (
            <button
              key={item.id}
              className="flex flex-col items-center justify-center"
              title={item.label}
            >
              <div
                className="flex items-center justify-center transition-colors"
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: isActive ? '#1F2937' : 'transparent',
                  borderRadius: '50%',
                  color: isActive ? '#FFFFFF' : '#1F2937'
                }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#1F2937',
                  marginTop: '6px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}