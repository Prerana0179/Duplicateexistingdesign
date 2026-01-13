import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'Vendor' | 'Customer';

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('Customer');

  const toggleRole = () => {
    setCurrentRole(prev => prev === 'Vendor' ? 'Customer' : 'Vendor');
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}