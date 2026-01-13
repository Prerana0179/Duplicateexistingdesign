import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Vendor Selection Context
 * 
 * Manages vendor selection state with persistence across:
 * - Page reloads (localStorage)
 * - Role switches (Customer ↔ Vendor)
 * - Navigation
 * 
 * BUSINESS RULES:
 * 1. Once a vendor is selected, hide all other vendors
 * 2. Show only the selected vendor's profile card
 * 3. Selection persists until explicitly changed
 * 4. "Change Vendor" action clears selection and restores multi-vendor grid
 * 5. Track inspection completion status and date
 * 6. Track milestone generation status for vendor view
 */

interface VendorSelectionContextType {
  selectedVendorId: string | null;
  selectVendor: (vendorId: string, action: 'profile' | 'inspection' | 'quote') => void;
  clearVendorSelection: () => void;
  isVendorSelected: boolean;
  inspectionCompleted: boolean;
  inspectionCompletionDate: Date | null;
  markInspectionCompleted: (date?: Date) => void;
  milestonesGenerated: boolean;
  markMilestonesGenerated: () => void;
  clearMilestones: () => void;
}

const VendorSelectionContext = createContext<VendorSelectionContextType | undefined>(undefined);

const STORAGE_KEY = 'tatvaops_selected_vendor';
const INSPECTION_KEY = 'tatvaops_inspection_status';
const MILESTONES_KEY = 'tatvaops_milestones_generated';

interface InspectionStatus {
  completed: boolean;
  completionDate: string | null;
}

export function VendorSelectionProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Initialize inspection status from localStorage
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>(() => {
    try {
      const stored = localStorage.getItem(INSPECTION_KEY);
      return stored ? JSON.parse(stored) : { completed: false, completionDate: null };
    } catch {
      return { completed: false, completionDate: null };
    }
  });

  // Initialize milestones generated status from localStorage
  const [milestonesGenerated, setMilestonesGenerated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(MILESTONES_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // Persist to localStorage whenever selection changes
  useEffect(() => {
    if (selectedVendorId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedVendorId));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedVendorId]);

  // Persist inspection status to localStorage
  useEffect(() => {
    localStorage.setItem(INSPECTION_KEY, JSON.stringify(inspectionStatus));
  }, [inspectionStatus]);

  // Persist milestones generated status to localStorage
  useEffect(() => {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestonesGenerated));
  }, [milestonesGenerated]);

  const selectVendor = (vendorId: string, action: 'profile' | 'inspection' | 'quote') => {
    console.log(`Vendor selected: ${vendorId} via ${action}`);
    setSelectedVendorId(vendorId);
  };

  const clearVendorSelection = () => {
    console.log('Vendor selection cleared');
    setSelectedVendorId(null);
  };

  const markInspectionCompleted = (date?: Date) => {
    const completionDate = date || new Date();
    setInspectionStatus({
      completed: true,
      completionDate: completionDate.toISOString(),
    });
    console.log('Inspection marked as completed:', completionDate);
  };

  const markMilestonesGenerated = () => {
    setMilestonesGenerated(true);
    console.log('Milestones marked as generated');
  };

  const clearMilestones = () => {
    setMilestonesGenerated(false);
    console.log('Milestones cleared');
  };

  const isVendorSelected = selectedVendorId !== null;
  const inspectionCompletionDate = inspectionStatus.completionDate 
    ? new Date(inspectionStatus.completionDate) 
    : null;

  return (
    <VendorSelectionContext.Provider
      value={{
        selectedVendorId,
        selectVendor,
        clearVendorSelection,
        isVendorSelected,
        inspectionCompleted: inspectionStatus.completed,
        inspectionCompletionDate,
        markInspectionCompleted,
        milestonesGenerated,
        markMilestonesGenerated,
        clearMilestones,
      }}
    >
      {children}
    </VendorSelectionContext.Provider>
  );
}

export function useVendorSelection() {
  const context = useContext(VendorSelectionContext);
  if (context === undefined) {
    throw new Error('useVendorSelection must be used within a VendorSelectionProvider');
  }
  return context;
}