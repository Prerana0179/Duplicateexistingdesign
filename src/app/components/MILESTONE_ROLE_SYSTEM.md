# Role-Based Milestone Component System

## Overview

The TatvaOps dashboard implements **strict role-based separation** for milestone management components. Customer and Vendor roles have completely different capabilities and UI components.

---

## Role Isolation Rules (CRITICAL)

### Customer View
- **Component**: `ProjectMilestonesWrapper.tsx` → `ProjectMilestones.tsx`
- **Capability**: Edit existing project milestones
- **Features**:
  - Drag & drop reordering
  - Edit milestone details
  - Update status
  - Delete milestones
  - Manage milestone payments
- **UI Style**: Black primary buttons, table/list view

### Vendor View
- **Component**: `CreateMilestone.tsx`
- **Capability**: Create new project milestones after inspection
- **Features**:
  - Set project timeline (start/end dates)
  - Auto-calculate duration
  - Define number of milestones
  - Enter cost estimates
  - Add project notes
  - AI-powered milestone generation
- **UI Style**: Orange gradient header/buttons, form view

---

## Component Architecture

```
CollapsibleProject.tsx
│
├─ Role Check: currentRole === 'Customer'
│  └─ TRUE → ProjectMilestonesWrapper
│             └─ ProjectMilestones (Edit Interface)
│
└─ Role Check: currentRole === 'Vendor'
   └─ TRUE → CreateMilestone (Form Interface)
```

---

## Implementation Details

### CollapsibleProject.tsx (Role Switch)

```tsx
{/* 4. Role-Based Milestone Section */}
<div className="mb-8">
  {currentRole === 'Customer' ? (
    // Customer View: Edit Milestones (unchanged)
    <ProjectMilestonesWrapper />
  ) : (
    // Vendor View: Create Milestone (NEW)
    <CreateMilestone 
      onGenerateMilestones={(data) => {
        console.log('Generate Milestones:', data);
      }}
    />
  )}
</div>
```

### CreateMilestone.tsx (Vendor Component)

**Form Fields** (in exact order):
1. **Start Date** (required) - Date picker
2. **End Date** (required) - Date picker
3. **Duration (in Days)** - Auto-calculated from dates
4. **Number of Milestones** (required) - Number input
5. **Total Cost (₹)** (required) - Currency input (full width)
6. **Notes / Description** - Multiline textarea

**Cost in Words Section**:
- Yellow background (#FFFBEB)
- Auto-converts numerical cost to Indian words format
- Shows "Enter total cost to see in words" if empty
- Displays only "TOTAL COST IN WORDS" (no estimated cost)

**Generate Button**:
- Orange gradient background
- Disabled state if required fields are missing
- Helper text: "AI will generate detailed milestones based on your inputs"

### ProjectMilestonesWrapper.tsx (Customer Component)

**Features**:
- Wraps `ProjectMilestones` with DndProvider for drag & drop
- Provides editing interface for existing milestones
- No form fields for creation

---

## Visual Consistency Rules

### Layout Preservation
- Both components maintain **same card width**
- Both components maintain **same card border/shadow**
- Both components maintain **same vertical spacing** in layout
- No layout jump when switching Customer ↔ Vendor

### Card Styling (Shared)
```tsx
style={{
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}}
```

### Spacing (Shared)
- Content padding: `p-6` (24px)
- Field spacing: `gap-5` (20px)
- Section margin: `mb-8` (32px)

---

## Color System

### Customer View
- **Primary CTA**: Black (`#000000`)
- **Accent**: Blue/Gray tones
- **Style**: Professional, neutral, editing-focused

### Vendor View
- **Primary CTA**: Orange Gradient (`#FF6B35` → `#F7931E`)
- **Accent**: Orange/Yellow tones
- **Style**: Action-oriented, creation-focused

---

## Data Flow

### Customer View (Edit)
```
ProjectMilestonesWrapper
  ↓
Load existing milestones from project data
  ↓
User edits/reorders/updates milestones
  ↓
Save changes to backend
```

### Vendor View (Create)
```
CreateMilestone
  ↓
User fills form (dates, costs, notes)
  ↓
Auto-calculate duration
  ↓
Convert costs to words
  ↓
Click "Generate Milestones"
  ↓
AI generates milestone breakdown
  ↓
Save to backend, assign to project
```

---

## Testing Checklist

### Role Isolation Test
- [ ] Customer view shows ProjectMilestonesWrapper
- [ ] Customer view does NOT show CreateMilestone
- [ ] Vendor view shows CreateMilestone
- [ ] Vendor view does NOT show ProjectMilestonesWrapper
- [ ] Switching roles updates component instantly
- [ ] No console errors when switching roles

### Layout Consistency Test
- [ ] Both components have same card width
- [ ] Both components have same card styling
- [ ] No height jump when switching roles
- [ ] No horizontal shift when switching roles
- [ ] Section spacing remains consistent

### Functionality Test
- [ ] Customer can edit milestones
- [ ] Vendor can fill create form
- [ ] Date auto-calculation works
- [ ] Cost-to-words conversion works
- [ ] Form validation works (required fields)
- [ ] Generate button enables/disables correctly

---

## Maintenance Guidelines

### Adding Features to Customer View
1. Update `ProjectMilestones.tsx` or `ProjectMilestonesWrapper.tsx`
2. Do NOT touch `CreateMilestone.tsx`
3. Test in Customer role only
4. Verify no impact on Vendor view

### Adding Features to Vendor View
1. Update `CreateMilestone.tsx`
2. Do NOT touch `ProjectMilestones.tsx` or `ProjectMilestonesWrapper.tsx`
3. Test in Vendor role only
4. Verify no impact on Customer view

### Modifying Role Switch Logic
1. Update `CollapsibleProject.tsx` only
2. Test both role transitions (Customer → Vendor, Vendor → Customer)
3. Verify no component leakage between roles
4. Check console for prop/state warnings

---

## Critical Rules (DO NOT VIOLATE)

### ❌ FORBIDDEN
- Sharing components between Customer and Vendor views
- Reusing ProjectMilestones in Vendor view
- Reusing CreateMilestone in Customer view
- Creating hybrid components that handle both roles
- Modifying one component to affect the other role

### ✅ ALLOWED
- Creating shared utility functions (date formatters, validators)
- Sharing design system tokens (colors, spacing)
- Using same backend API endpoints with different payloads
- Adding role-specific features independently

---

## File Structure

```
/src/app/components/
├── CollapsibleProject.tsx           ← Role switch logic
├── ProjectMilestonesWrapper.tsx     ← Customer wrapper (DnD)
├── ProjectMilestones.tsx            ← Customer edit interface
├── CreateMilestone.tsx              ← Vendor create form
└── MILESTONE_ROLE_SYSTEM.md         ← This document
```

---

## Future Extensions

### Adding New Roles (e.g., Admin, Inspector)
1. Add new role check in `CollapsibleProject.tsx`
2. Create dedicated component for new role
3. Do NOT reuse Customer or Vendor components
4. Follow same isolation principles

### Adding Milestone Templates
- Customer: Add template selector to edit view
- Vendor: Add template dropdown to create form
- Keep implementations separate per role

---

## Summary

The milestone system enforces **strict role-based separation**:

| Role | Component | Capability | UI Color |
|------|-----------|------------|----------|
| **Customer** | ProjectMilestonesWrapper | Edit existing | Black |
| **Vendor** | CreateMilestone | Create new | Orange |

**Key Principle**: Same layout, same spacing, different components, zero overlap.

**Result**: A professional, role-specific interface that maintains visual consistency while providing appropriate capabilities per user type.