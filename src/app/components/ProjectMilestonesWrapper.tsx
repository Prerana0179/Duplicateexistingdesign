import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectMilestones } from './ProjectMilestones';
import { MilestoneFormData } from './CreateMilestone';

/**
 * Project Milestones Wrapper (Customer & Vendor View)
 * 
 * CRITICAL ROLE ISOLATION:
 * - Customer view: Shows Edit Milestones (no regenerate button)
 * - Vendor view: Shows Edit Milestones after generation (with optional regenerate button)
 * - Role separation is enforced in CollapsibleProject.tsx
 * 
 * USAGE:
 * Customer → Edit existing milestones (static)
 * Vendor → View/edit generated milestones (with regenerate option)
 */

interface ProjectMilestonesWrapperProps {
  onRegenerate?: () => void;
  showRegenerateButton?: boolean;
  milestoneFormData?: MilestoneFormData | null;
}

export function ProjectMilestonesWrapper({ onRegenerate, showRegenerateButton = false, milestoneFormData }: ProjectMilestonesWrapperProps = {}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ProjectMilestones 
        onRegenerate={onRegenerate}
        showRegenerateButton={showRegenerateButton}
        milestoneFormData={milestoneFormData}
      />
    </DndProvider>
  );
}