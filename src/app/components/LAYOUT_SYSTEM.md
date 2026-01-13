# Project Dashboard Layout System

## Overview

This document describes the **Shared Layout System** that enforces visual parity between Customer and Vendor views in the TatvaOps project dashboard.

## Core Principle

> **"Same page, different permissions"**

When users switch between Customer and Vendor roles, the layout should feel stable and professional with **zero visual jump, reflow, or height mismatch**. Only the data and button actions change—never the visual structure.

---

## Architecture

### 1. Shared Components

#### `ProjectDashboardLayout.tsx`
- **Purpose**: Enforces two-column grid structure for both roles
- **Grid**: `350px (left) | 1fr (right)` with 24px gap
- **Height Locking**: Right column auto-matches left column height
- **Usage**: Wraps both Customer and Vendor views

#### `VendorCards.tsx` (Customer View - Right Column)
- Displays available vendors or selected vendor card
- Uses **compressed layout** when vendor is confirmed
- Hero image: 180px height
- Content padding: 12px 14px
- Button height: 42px

#### `ProjectProfileCard.tsx` (Vendor View - Right Column)
- Displays project overview for vendor
- Uses **identical compression logic** as VendorCards
- Same hero image height: 180px
- Same content padding: 12px 14px
- Same button height: 42px

### 2. Role-Based Rendering

```tsx
<ProjectDashboardLayout
  leftColumnTop={<ProjectFinancialsCard />}
  leftColumnBottom={<Milestones />}
  rightColumn={
    currentRole === 'Customer' ? (
      <VendorCards />
    ) : (
      <ProjectProfileCard {...props} />
    )
  }
/>
```

---

## Layout Rules (MANDATORY)

### Grid Structure
- **Columns**: `350px (left) | 1fr (right)`
- **Gap**: `24px (gap-6)`
- **Alignment**: `stretch` (equal height enforcement)
- **Left top margin**: `52px` (aligns with right column heading)

### Left Column
- **Card 1**: Project Financials
- **Card 2**: Milestones
- **Vertical gap**: `24px (space-y-6)`

### Right Column
- **Customer view**: VendorCards component
- **Vendor view**: ProjectProfileCard component
- **Height**: Auto-locked to match left column combined height
- **Overflow**: Hidden with compression applied

---

## Compression System

When the right column content exceeds available height, apply compression in this **exact order**:

### Priority 1: Reduce Vertical Padding (-10px)
```tsx
padding: '12px 14px 14px 14px'  // was: 16px 16px
```

### Priority 2: Tighten Text Section Spacing (-10px)
```tsx
gap: '4px'           // Details section (was: 14px)
margin: '8px 0'      // Divider (was: 14px 0)
```

### Priority 3: Compress Stats Row (-4px)
```tsx
gap: 2               // Stats grid (was: 3)
gap: '1px'           // Stat items (was: 2px)
```

### Priority 4: Reduce Button Spacing (-6px)
```tsx
height: '42px'       // Buttons (was: 44px)
gap: 2               // Button container (was: 3)
minHeight: '8px'     // Spacer (was: 12px)
```

### Priority 5: Image Height Reduction (-20px / 10%)
```tsx
height: '180px'      // Hero image (was: 200px)
```

**Total space recovered**: ~50-62px

---

## Typography Standards (MANDATORY)

Both roles MUST use identical typography:

| Element | Font Size | Line Height | Weight |
|---------|-----------|-------------|--------|
| Card Title (h3) | `text-lg` (18px) | default | semibold |
| Name/Heading | `19px` | 1.15 | semibold |
| Subtitle | `13px` | 1.2 | normal |
| Body Text | `13px` | 1.2 | medium |
| Stats Label | `text-xs` (12px) | 1.1 | medium |
| Stats Value | `text-sm` (14px) | 1.15 | semibold |
| Button Text | `text-sm` (14px) | default | medium |

**Icon Sizes**: `w-3.5 h-3.5` (14px) for all icons

---

## Component Structure

### Customer View (VendorCards)
```
┌─────────────────────────────────────┐
│  Selected Vendor                    │  ← h3: text-lg, mb-6
├─────────────────────────────────────┤
│  [Hero Image - 180px]               │  ← Full width, border-radius top
├─────────────────────────────────────┤
│  Vendor Name (19px/1.15)            │  ← padding: 12px 14px
│  Service Category (13px/1.2)        │
│  📍 Location + Badges               │
│  ⭐ Rating + Reviews + Experience   │
├─────────────────────────────────────┤
│  Response | Projects | Warranty |   │  ← 4-col grid, gap-2
│  Service Radius                     │
│                                     │
│  ↕ Flexible Spacer (min: 8px)      │
│                                     │
│  [Profile] [Quote] [Reject]         │  ← 42px height, gap-2
└─────────────────────────────────────┘
```

### Vendor View (ProjectProfileCard)
```
┌─────────────────────────────────────┐
│  Project Overview                   │  ← h3: text-lg, mb-6
├─────────────────────────────────────┤
│  [Project Site Image - 180px]       │  ← Construction site (NOT portrait)
├─────────────────────────────────────┤
│  Project Name (19px/1.15)           │  ← padding: 12px 14px
│  Project Type (13px/1.2)            │
│  📍 Location + Status               │
│  👥 Customer + 📅 Start Date        │
├─────────────────────────────────────┤
│  Project ID | Plot Size | Timeline | │  ← 4-col grid, gap-2
│  Milestones                         │
│                                     │
│  ↕ Flexible Spacer (min: 8px)      │
│                                     │
│  [View] [Contact] [Update]          │  ← 42px height, gap-2
└─────────────────────────────────────┘

IMAGE USAGE:
- Customer View: Vendor portrait (professional headshot)
- Vendor View: Project site image (construction progress, no faces)
- Both: 180px height, 16:9 landscape, object-fit: cover
- Content Safety: Vendor view avoids portraits, uses execution-focused visuals
```

---

## Visual Consistency Checklist

When switching between Customer → Vendor roles, verify:

- [ ] No height jump or reflow
- [ ] No spacing differences between cards
- [ ] No typography size changes
- [ ] Same visual hierarchy (heading → image → details → stats → buttons)
- [ ] Same button positions (always at bottom)
- [ ] Same card dimensions and shadows
- [ ] Same icon sizes
- [ ] Same padding and margins

**Expected Result**: The transition feels like updating content within the same template, not loading a different layout.

---

## Implementation Guidelines

### ✅ ALLOWED (Data Layer)
- Change button text and callbacks
- Change labels and field names
- Change data values
- Change colors within existing color system
- Change icons (keeping same size)

### ❌ FORBIDDEN (Layout Layer)
- Change spacing or padding values
- Change typography sizes or line-heights
- Change grid structure or column widths
- Change button heights or gaps
- Change component positioning
- Create role-specific layout variations

---

## Testing

### Visual Parity Test
1. Open project dashboard in Customer view
2. Note the exact position of:
   - Card edges
   - Button positions
   - Text baselines
   - Stats section
3. Switch to Vendor view using header menu
4. Verify all positions remain **pixel-perfect identical**
5. No content should shift, jump, or reflow

### Height Lock Test
1. Expand project in Customer view
2. Measure right column height
3. Measure left column combined height (Financials + Milestones)
4. Verify: `rightColumnHeight === leftColumnHeight`
5. Switch to Vendor view
6. Repeat measurements
7. Verify: Heights still match exactly

---

## Maintenance

### Adding New Fields
- Add fields to **both** VendorCards and ProjectProfileCard
- Use **identical** typography and spacing
- Test height synchronization after changes
- Run visual parity test

### Modifying Layout
1. Update `ProjectDashboardLayout.tsx` documentation first
2. Apply changes to **both** role views simultaneously
3. Test with compressed content (height lock)
4. Verify no visual regression in either role

### Future Extensions
- New roles should reuse `ProjectDashboardLayout`
- New profile cards should follow compression rules
- All role views must pass visual parity test

---

## File Structure

```
/src/app/components/
├── ProjectDashboardLayout.tsx    ← Shared grid layout
├── VendorCards.tsx               ← Customer view right column
├── ProjectProfileCard.tsx        ← Vendor view right column
├── CollapsibleProject.tsx        ← Uses ProjectDashboardLayout
├── ProjectFinancialsCard.tsx     ← Left column top (shared)
├── Milestones.tsx                ← Left column bottom (shared)
└── LAYOUT_SYSTEM.md              ← This document
```

---

## Summary

The Shared Layout System ensures:
1. **Visual parity**: Customer and Vendor views look identical
2. **Height synchronization**: Right column never overflows
3. **Consistent compression**: Same rules applied to both roles
4. **Typography standards**: Identical sizing and spacing
5. **Component reuse**: Same structure, different data
6. **Maintainability**: Single source of truth for layout rules

**Result**: A professional, stable dashboard that feels role-agnostic.