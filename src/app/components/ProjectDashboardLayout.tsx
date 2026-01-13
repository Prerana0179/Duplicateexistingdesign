import { ReactNode } from 'react';

/**
 * Shared Project Dashboard Layout Component
 * 
 * CRITICAL: This component enforces visual parity between Customer and Vendor views.
 * DO NOT create role-specific layout variations outside this component.
 * 
 * LAYOUT CONTRACT (MANDATORY):
 * =================================
 * 
 * 1. GRID STRUCTURE:
 *    - Two-column grid: 350px (left) | 1fr (right)
 *    - Gap between columns: 24px (gap-6)
 *    - Vertical alignment: stretch (both columns match height)
 * 
 * 2. LEFT COLUMN:
 *    - Stacked cards with 24px vertical gap (space-y-6)
 *    - Top card: Project Financials
 *    - Bottom card: Milestones
 *    - Top margin: 52px (aligns with right column heading)
 * 
 * 3. RIGHT COLUMN:
 *    - Single profile card that stretches to match left column height
 *    - Customer view: VendorCards component
 *    - Vendor view: ProjectProfileCard component
 *    - Height is AUTO-LOCKED to combined left column height
 * 
 * 4. HEIGHT SYNCHRONIZATION:
 *    - Right card MUST NEVER exceed left column combined height
 *    - If content overflows, apply compression (see compression rules below)
 *    - Flex container ensures automatic height matching
 * 
 * COMPRESSION RULES (Apply in this exact order):
 * ================================================
 * 
 * Priority 1: Reduce vertical padding (6-10px)
 *   - Content area: 16px → 12px
 * 
 * Priority 2: Tighten text section spacing
 *   - Details gap: 14px → 4px
 *   - Divider margin: 14px → 8px
 * 
 * Priority 3: Compress stats row
 *   - Stats gap: 12px → 8px
 *   - Internal spacing: 2px → 1px
 * 
 * Priority 4: Reduce button spacing
 *   - Button height: 44px → 42px
 *   - Button gap: 12px → 8px
 * 
 * Priority 5: Image height reduction (max 10-15%)
 *   - Hero image: 200px → 180px
 *   - Maintain aspect ratio with object-fit: cover
 * 
 * TYPOGRAPHY RULES (MANDATORY):
 * ===============================
 * 
 * - Font sizes MUST be identical across roles:
 *   - Card title (h3): text-lg (18px)
 *   - Name/heading: 19px, line-height 1.15
 *   - Subtitle: 13px, line-height 1.2
 *   - Body text: 13px, line-height 1.2
 *   - Stats label: text-xs (12px), line-height 1.1
 *   - Stats value: text-sm (14px), line-height 1.15
 * 
 * - Line heights: 1.1-1.2 (tight for vertical compression)
 * - Icon sizes: w-3.5 h-3.5 (14px)
 * - Font weights: Use same weights in both views
 * 
 * COMPONENT REUSE (MANDATORY):
 * =============================
 * 
 * Both Customer and Vendor profile cards MUST share:
 * - Same hero image structure (180px height, border-radius top only)
 * - Same content padding (12px 14px)
 * - Same stats grid (4-column, gap-2)
 * - Same button layout (3 buttons, 42px height, gap-2)
 * - Same compression logic (see above)
 * 
 * DATA vs LAYOUT:
 * ================
 * 
 * ✅ ALLOWED: Change data, labels, button text, callbacks
 * ❌ FORBIDDEN: Change spacing, sizing, layout structure, typography
 * 
 * VISUAL CONSISTENCY TEST:
 * =========================
 * 
 * When switching between Customer → Vendor roles:
 * - No height jump or reflow
 * - No spacing differences
 * - No typography size changes
 * - Same visual hierarchy
 * - Same button positions
 * - Same card dimensions
 * 
 * Result: "Same page, different permissions"
 */

interface ProjectDashboardLayoutProps {
  leftColumnTop: ReactNode;    // Project Financials card
  leftColumnBottom: ReactNode; // Milestones card
  rightColumn: ReactNode;       // Vendor Cards (Customer view) or Project Profile (Vendor view)
}

export function ProjectDashboardLayout({
  leftColumnTop,
  leftColumnBottom,
  rightColumn,
}: ProjectDashboardLayoutProps) {
  return (
    <div 
      className="grid gap-6 mb-8" 
      style={{ 
        gridTemplateColumns: '350px 1fr',
        alignItems: 'stretch'
      }}
    >
      {/* Left Column - Stacked Cards with Fixed Gap */}
      <div style={{ marginTop: '52px' }}>
        <div className="space-y-6">
          {leftColumnTop}
          {leftColumnBottom}
        </div>
      </div>

      {/* Right Column - Height-Locked Profile Card */}
      <div className="flex flex-col">
        {rightColumn}
      </div>
    </div>
  );
}