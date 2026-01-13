# Calendar Date Picker Implementation

## Overview

The Vendor "Create Milestone" form now features an interactive calendar date picker for Start Date and End Date fields, providing a professional and intuitive date selection experience.

---

## Components

### 1. DatePickerInput Component (`DatePickerInput.tsx`)

A reusable date picker input with calendar popup functionality.

**Features**:
- ✅ Click-to-open calendar popup
- ✅ Display format: DD/MM/YYYY
- ✅ Storage format: YYYY-MM-DD (ISO)
- ✅ Auto-close on date selection
- ✅ Auto-close on outside click
- ✅ Read-only input (no manual typing)
- ✅ Calendar icon indicator
- ✅ Disable past dates (optional)
- ✅ Disable dates before min date (optional)
- ✅ Responsive positioning
- ✅ High z-index overlay

**Props**:
```typescript
interface DatePickerInputProps {
  value: string;           // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  placeholder?: string;    // Default: 'Select a date'
  label: string;           // Field label
  required?: boolean;      // Show asterisk if true
  minDate?: Date;          // Disable dates before this
  disabled?: boolean;      // Disable the input
}
```

---

## Implementation in CreateMilestone

### Start Date Field

```tsx
<DatePickerInput
  value={startDate}
  onChange={setStartDate}
  label="Start Date"
  placeholder="Select start date"
  required
  minDate={new Date()} // Disable past dates
/>
```

**Behavior**:
- Disables all dates before today
- Prevents vendors from selecting past start dates
- Calendar opens on click/focus
- Displays selected date in DD/MM/YYYY format

### End Date Field

```tsx
<DatePickerInput
  value={endDate}
  onChange={setEndDate}
  label="End Date"
  placeholder="Select end date"
  required
  minDate={startDate ? new Date(startDate) : new Date()}
/>
```

**Behavior**:
- Disables all dates before selected Start Date
- If Start Date is not selected, disables past dates
- Enforces Start Date < End Date logic
- Calendar opens on click/focus
- Displays selected date in DD/MM/YYYY format

---

## Calendar UI Styling

### Visual Design

```
┌─────────────────────────────────────┐
│        ← January 2026 →             │ ← Month navigation
├─────────────────────────────────────┤
│ SUN MON TUE WED THU FRI SAT         │ ← Week headers
│                  1   2   3   4      │
│  5   6   7   8   9  10  11          │
│ 12  13  14 [15] 16  17  18          │ ← [15] = selected
│ 19  20  21  22  23  24  25          │
│ 26  27  28  29  30  31              │
└─────────────────────────────────────┘
```

### Color System

| Element | Color | Description |
|---------|-------|-------------|
| **Selected Date** | Orange Gradient (#FF6B35 → #F7931E) | Primary selection |
| **Today** | Orange Text (#FF6B35) | Current date indicator |
| **Hover** | Gray (#F3F4F6) | Non-selected date hover |
| **Disabled** | Light Gray (#D1D5DB) | Past dates / invalid dates |
| **Text** | Dark Gray (#111827) | Regular date text |
| **Headers** | Medium Gray (#6B7280) | Month/week labels |

### Typography

- **Month/Year**: 14px, font-weight 600
- **Week Headers**: 12px, font-weight 600, uppercase
- **Dates**: 13px, font-weight 500
- **Selected Date**: 13px, font-weight 600

### Spacing

- **Cell Size**: 36px × 36px
- **Border Radius**: 8px (date cells), 6px (nav buttons)
- **Padding**: 12px (calendar container)
- **Gap**: 2px (between cells)

### Shadows

```css
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
```

---

## User Interaction Flow

### Flow 1: Start Date Selection

```
1. Vendor clicks "Start Date" input
   ↓
2. Calendar popup opens below input
   ↓
3. Vendor sees:
   - Current month (January 2026)
   - Past dates are grayed out (disabled)
   - Today is highlighted in orange text
   ↓
4. Vendor clicks a date (e.g., Jan 22, 2026)
   ↓
5. Calendar closes automatically
   ↓
6. Input displays: "22/01/2026"
   ↓
7. Internal value stores: "2026-01-22"
```

### Flow 2: End Date Selection (After Start Date)

```
1. Vendor clicks "End Date" input
   ↓
2. Calendar popup opens below input
   ↓
3. Vendor sees:
   - Current month
   - Dates before Start Date are grayed out (disabled)
   - Start Date: Jan 22, 2026 → all dates before Jan 22 disabled
   ↓
4. Vendor clicks a date (e.g., Apr 22, 2026)
   ↓
5. Calendar closes automatically
   ↓
6. Input displays: "22/04/2026"
   ↓
7. Duration auto-calculates: "90 days"
```

### Flow 3: Outside Click

```
1. Calendar is open
   ↓
2. Vendor clicks anywhere outside calendar
   ↓
3. Calendar closes (no date selected)
   ↓
4. Previous value (if any) remains
```

---

## Auto-Calculation Logic

### Duration Calculation

```typescript
useEffect(() => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDuration(diffDays);
  } else {
    setDuration(null);
  }
}, [startDate, endDate]);
```

**Example**:
- Start Date: 22/01/2026 (Jan 22, 2026)
- End Date: 22/04/2026 (Apr 22, 2026)
- Duration: 90 days (auto-calculated)

---

## Date Format Conversion

### Display Format (DD/MM/YYYY)

Used for user-facing display in the input field.

```typescript
const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';
```

**Example**: `22/01/2026`

### Storage Format (YYYY-MM-DD)

Used for internal state and data submission (ISO 8601).

```typescript
const isoString = format(date, 'yyyy-MM-dd');
```

**Example**: `2026-01-22`

---

## Positioning & Overlay

### CSS Rules

```css
.calendar-popup {
  position: absolute;      /* Overlay positioning */
  left: 0;                 /* Aligned left with input */
  margin-top: 8px;         /* 8px gap below input */
  z-index: 50;             /* Above other elements */
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}
```

### Z-Index Hierarchy

| Layer | Z-Index | Element |
|-------|---------|---------|
| Background | 0 | Form content |
| Inputs | 1 | Text fields, buttons |
| **Calendar Popup** | **50** | Date picker overlay |
| Modals | 100+ | Dialogs, alerts |

---

## Accessibility Features

### Keyboard Support

- ✅ **Tab**: Focus input to open calendar
- ✅ **Escape**: Close calendar (built-in DayPicker)
- ✅ **Arrow Keys**: Navigate dates (built-in DayPicker)
- ✅ **Enter**: Select date (built-in DayPicker)

### Screen Reader Support

- ✅ Semantic HTML (`<label>`, `<input>`)
- ✅ Required field indicator (`*`)
- ✅ DayPicker ARIA labels (built-in)

### Visual Indicators

- ✅ Red asterisk for required fields
- ✅ Orange focus ring on input
- ✅ Calendar icon in input
- ✅ Cursor pointer on clickable elements
- ✅ Disabled cursor for past dates

---

## Validation Logic

### Start Date Validation

```typescript
minDate={new Date()} // Today or later only
```

**Rules**:
- ❌ Cannot select dates before today
- ✅ Can select today or future dates

### End Date Validation

```typescript
minDate={startDate ? new Date(startDate) : new Date()}
```

**Rules**:
- ❌ Cannot select dates before Start Date
- ✅ Can select Start Date or later
- ⚠️ If Start Date is empty, falls back to today

### Form Validation

```typescript
const isFormValid = startDate && endDate && numberOfMilestones && totalCost;
```

**Generate Button**:
- Disabled if Start Date OR End Date is missing
- Enabled only when both dates are selected

---

## Calendar Popup Behavior

### Open Triggers

1. **Click** on input field
2. **Focus** on input field (keyboard tab)

### Close Triggers

1. **Date Selected** → Auto-close
2. **Click Outside** → Cancel and close
3. **Escape Key** → Cancel and close

### Popup Positioning

```
┌─────────────────────────────┐
│ Start Date *                │ ← Input field
│ [22/01/2026]          📅    │
└─────────────────────────────┘
        ↓ 8px gap
┌─────────────────────────────┐
│   ← January 2026 →          │
│ ─────────────────────────── │
│ SUN MON TUE WED THU FRI SAT │
│  ...calendar grid...        │
└─────────────────────────────┘
        ↑ Aligned left
```

---

## Browser Compatibility

### Supported Browsers

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Support

- ✅ Touch-friendly 36px tap targets
- ✅ Responsive calendar sizing
- ✅ Touch scroll for month navigation

---

## Technical Dependencies

### Packages Used

1. **react-day-picker** (v8.10.1)
   - Calendar UI component
   - Built-in accessibility
   - Date range support
   - Disabled dates logic

2. **date-fns** (v3.6.0)
   - Date formatting
   - Date manipulation
   - Duration calculations

### Import Statements

```typescript
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
```

---

## Custom Styling Override

The DatePickerInput component includes scoped CSS to override default DayPicker styles:

```tsx
<style>{`
  .date-picker-calendar .rdp {
    --rdp-cell-size: 36px;
    --rdp-accent-color: #FF6B35;
    --rdp-background-color: #FFF5F0;
  }
  
  .date-picker-calendar .rdp-day_selected {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%) !important;
    color: white !important;
    font-weight: 600;
  }
  
  /* ... more custom styles ... */
`}</style>
```

**Scoping Strategy**:
- All custom styles use `.date-picker-calendar` prefix
- Prevents conflicts with other calendars in the app
- Maintains TatvaOps orange branding

---

## Role Isolation (CRITICAL)

### Customer View ✅

- **Component**: ProjectMilestonesWrapper
- **Date Inputs**: NOT affected by this change
- **Status**: Unchanged, no calendar pickers added

### Vendor View ✅

- **Component**: CreateMilestone
- **Date Inputs**: Calendar date pickers enabled
- **Status**: Modified with DatePickerInput

**Result**: Calendar date pickers are ONLY in Vendor view.

---

## Testing Checklist

### Functional Tests

- [ ] Start Date calendar opens on click
- [ ] End Date calendar opens on click
- [ ] Calendar closes after date selection
- [ ] Calendar closes on outside click
- [ ] Past dates are disabled in Start Date
- [ ] Dates before Start Date are disabled in End Date
- [ ] Duration auto-calculates when both dates selected
- [ ] Date displays in DD/MM/YYYY format
- [ ] Date stores in YYYY-MM-DD format

### Visual Tests

- [ ] Calendar popup appears below input
- [ ] Calendar is aligned left with input
- [ ] Selected date has orange gradient background
- [ ] Today is highlighted in orange text
- [ ] Disabled dates are grayed out
- [ ] Month navigation arrows work
- [ ] Calendar has proper shadow and border radius
- [ ] No layout jump when calendar opens

### UX Tests

- [ ] Calendar feels responsive (no lag)
- [ ] Smooth open/close transitions
- [ ] Clear visual feedback on hover
- [ ] Intuitive month navigation
- [ ] Easy date selection
- [ ] No accidental date changes

---

## Example Usage

### Basic Usage

```tsx
<DatePickerInput
  value={startDate}
  onChange={setStartDate}
  label="Start Date"
  placeholder="Select start date"
  required
/>
```

### With Min Date

```tsx
<DatePickerInput
  value={endDate}
  onChange={setEndDate}
  label="End Date"
  required
  minDate={new Date('2026-01-22')} // Disable before Jan 22
/>
```

### Disabled State

```tsx
<DatePickerInput
  value={completionDate}
  onChange={setCompletionDate}
  label="Completion Date"
  disabled={true} // Read-only
/>
```

---

## API Reference

### DatePickerInput Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | ISO date string (YYYY-MM-DD) |
| `onChange` | `(value: string) => void` | Yes | - | Callback when date changes |
| `label` | `string` | Yes | - | Field label text |
| `placeholder` | `string` | No | `'Select a date'` | Placeholder text |
| `required` | `boolean` | No | `false` | Show asterisk if true |
| `minDate` | `Date` | No | `undefined` | Disable dates before this |
| `disabled` | `boolean` | No | `false` | Disable the input |

### Return Value

The `onChange` callback receives an ISO date string:

```typescript
onChange('2026-01-22') // YYYY-MM-DD format
```

---

## Performance Optimization

### Lazy Loading

Calendar component only renders when popup is open:

```tsx
{isOpen && (
  <div className="calendar-popup">
    <DayPicker ... />
  </div>
)}
```

### Event Cleanup

Outside click listener is cleaned up on unmount:

```typescript
return () => {
  document.removeEventListener('mousedown', handleClickOutside);
};
```

---

## Troubleshooting

### Calendar Not Opening

**Issue**: Calendar doesn't open on click  
**Solution**: Check if `disabled` prop is set to `true`

### Wrong Date Format

**Issue**: Date shows as YYYY-MM-DD instead of DD/MM/YYYY  
**Solution**: Check `format()` function usage

### Past Dates Not Disabled

**Issue**: Can select past dates in Start Date  
**Solution**: Ensure `minDate={new Date()}` is set

### Calendar Cuts Off

**Issue**: Calendar popup is cut off by parent overflow  
**Solution**: Check parent `overflow: hidden` styles

---

## Future Enhancements

### Potential Improvements

1. **Time Selection**
   - Add time picker for Start/End times
   - Format: DD/MM/YYYY HH:MM

2. **Date Presets**
   - "Today", "Tomorrow", "Next Week" buttons
   - Quick selection shortcuts

3. **Range Highlight**
   - Highlight all dates between Start and End
   - Visual duration preview

4. **Custom Themes**
   - Allow theme customization per project
   - Dark mode support

5. **Multi-Language**
   - Support for Indian regional languages
   - Localized month/day names

---

## Summary

The calendar date picker provides a professional, intuitive date selection experience for vendors:

✅ **DD/MM/YYYY** display format  
✅ **YYYY-MM-DD** storage format  
✅ **Click-to-open** calendar popup  
✅ **Auto-close** on selection  
✅ **Auto-calculate** duration  
✅ **Disable past dates**  
✅ **Enforce Start < End**  
✅ **Orange gradient** selected state  
✅ **Professional UI** with shadows and rounded corners  
✅ **Vendor-only** (Customer view unchanged)  

**Result**: A smooth, predictable, zero-confusion date selection experience! 🗓️✨
