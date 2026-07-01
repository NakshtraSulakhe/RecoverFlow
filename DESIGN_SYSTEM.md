# RecoverFlow Design System
## Premium Enterprise Recovery Management SaaS UI/UX Specification

Version: 2.0.0
Last Updated: June 30, 2026
Accessibility Standard: WCAG 2.1 AA
Design Inspiration: Linear, Stripe Dashboard, HubSpot CRM, Salesforce Lightning, Vercel Dashboard, Notion, Jira, Azure Portal

---

## 1. Design Philosophy

### Vision Statement

RecoveryFlow provides a modern, premium, enterprise-grade user experience comparable to the best SaaS platforms. The interface is clean, intuitive, fast, and optimized for users who spend 8–10 hours daily managing hundreds of recovery cases.

### Overall Design Goals

The UI is:
- **Modern** - Contemporary design patterns, not outdated admin templates
- **Professional** - Enterprise-grade aesthetics and polish
- **Premium** - High-quality interactions and attention to detail
- **Minimal** - Uncluttered interface with purposeful elements
- **Clean** - Clear visual hierarchy and organized information
- **Responsive** - Seamless experience across all devices
- **Fast** - Optimized performance and instant feedback
- **Accessible** - WCAG 2.1 AA compliant for all users
- **Data-focused** - Information density optimized for enterprise workflows
- **Productivity-oriented** - Designed for efficiency and speed
- **Enterprise-ready** - Scalable and robust for large organizations
- **Consistent** - Unified design language across all modules

### Core Principles

**1. Minimal Interface**
- Keep the interface uncluttered
- Avoid unnecessary borders, excessive colors, and decorative elements
- Prioritize whitespace and visual breathing room
- Use subtle shadows and elevation instead of heavy borders
- Let content breathe with generous spacing

**2. Information Hierarchy**
Users should immediately understand:
- What is important (primary actions, critical data)
- What needs attention (warnings, errors, deadlines)
- What actions are available (CTAs, context menus)
- What status a record is in (color-coded status chips)
- Clear visual path from most to least important

**3. Productivity First**
Design for users managing hundreds of records daily:
- Keyboard shortcuts for all major actions
- Quick search with instant results
- Global search (Ctrl/Cmd + K) command palette
- Bulk actions and multi-select operations
- Context menus and right-click interactions
- Command palette for power users
- Inline editing where appropriate
- Saved views and filters
- Customizable dashboards

**4. Visual Consistency**
Use the same patterns across the entire application:
- Buttons (primary, secondary, text, destructive)
- Cards (elevated, outlined, interactive)
- Forms (validation, layout, states)
- Tables (sorting, filtering, selection)
- Colors (semantic, neutral, accent)
- Icons (consistent style and sizing)
- Dialogs (modals, drawers, panels)
- Inputs (text, select, date, search)
- Spacing (4px grid system)
- Typography (hierarchy and scale)

**5. Motion & Micro-interactions**
Use subtle animations to enhance usability:
- Smooth page transitions (200-300ms)
- Drawer slide animations (300ms)
- Skeleton loading states
- Button hover and active states
- Card elevation changes on hover
- Success animations for completed actions
- Progress indicators for long operations
- Animated charts and data visualizations
Animations should enhance usability, not distract from tasks

**6. Enterprise Data Visualization**
Dashboards should include:
- KPI cards with trend indicators
- Interactive charts with drill-down capability
- Comprehensive reports with filters
- Trend indicators (up/down arrows, percentages)
- Heat maps for data density
- Timelines for case progression
- Progress bars for completion status
- Status chips with color coding
- Real-time data updates where appropriate

**7. AI-Native Design**
AI should be integrated naturally:
- AI assistant panel for contextual help
- Suggested next actions based on context
- AI-generated summaries of complex data
- Risk scores and predictions
- Smart recommendations and insights
- Intelligent alerts and notifications
- AI should assist, not interrupt workflows

---

## 2. Color Palette

### Color Strategy

The interface primarily uses neutral colors, with accent colors reserved for actions and status. This approach maintains a clean, professional appearance while drawing attention to important elements.

### Primary Color - Deep Blue

**Brand Primary (Deep Blue)**
- Primary 50: #E8EEF7
- Primary 100: #C5D6ED
- Primary 200: #9EBCE2
- Primary 300: #76A1D7
- Primary 400: #5288CC
- Primary 500: #2E6FC1 (Main Brand Color)
- Primary 600: #1F5FAF
- Primary 700: #134F9D
- Primary 800: #0A418C
- Primary 900: #043677

**Usage Guidelines**
- Primary 500: Primary buttons, active states, key CTAs, navigation
- Primary 600: Hover states for primary elements
- Primary 700: Pressed states, active navigation items
- Primary 50-200: Subtle backgrounds, highlights, hover states
- Primary 800-900: Text emphasis, links, important information

### Semantic Status Colors

**Success (Green)**
- Success 50: #E8F5E9
- Success 100: #C8E6C9
- Success 200: #A5D6A7
- Success 300: #81C784
- Success 400: #66BB6A
- Success 500: #4CAF50 (Main Success Color)
- Success 600: #43A047
- Success 700: #388E3C
- Success 800: #2E7D32
- Success 900: #1B5E20

**Usage**: Successful operations, completed states, paid status, positive indicators

**Warning (Amber)**
- Warning 50: #FFF8E1
- Warning 100: #FFECB3
- Warning 200: #FFE082
- Warning 300: #FFD54F
- Warning 400: #FFCA28
- Warning 500: #FFC107 (Main Warning Color)
- Warning 600: #FFB300
- Warning 700: #FFA000
- Warning 800: #FF8F00
- Warning 900: #FF6F00

**Usage**: Pending states, caution messages, promise to pay, attention required

**Error (Red)**
- Error 50: #FFEBEE
- Error 100: #FFCDD2
- Error 200: #EF9A9A
- Error 300: #E57373
- Error 400: #EF5350
- Error 500: #F44336 (Main Error Color)
- Error 600: #E53935
- Error 700: #D32F2F
- Error 800: #C62828
- Error 900: #B71C1C

**Usage**: Error states, destructive actions, legal status, critical alerts

**Info (Cyan)**
- Info 50: #E0F7FA
- Info 100: #B2EBF2
- Info 200: #80DEEA
- Info 300: #4DD0E1
- Info 400: #26C6DA
- Info 500: #00BCD4 (Main Info Color)
- Info 600: #00ACC1
- Info 700: #0097A7
- Info 800: #00838F
- Info 900: #006064

**Usage**: Informational messages, new status, neutral states, help text

**Purple (In Progress)**
- Purple 50: #F3E5F5
- Purple 100: #E1BEE7
- Purple 200: #CE93D8
- Purple 300: #BA68C8
- Purple 400: #AB47BC
- Purple 500: #9C27B0 (Main Purple Color)
- Purple 600: #8E24AA
- Purple 700: #7B1FA2
- Purple 800: #6A1B9A
- Purple 900: #4A148C

**Usage**: In progress status, processing states, workflow steps

### Status Color Mapping

**Case Status Colors**
- New → Info 500 (Cyan)
- In Progress → Purple 500 (Purple)
- Promise to Pay → Warning 500 (Amber)
- Paid → Success 500 (Green)
- Legal → Error 500 (Red)
- Closed → Gray 500 (Gray)

### Neutral Colors

**Gray Scale**
- Gray 50: #FAFAFA (Backgrounds, cards)
- Gray 100: #F5F5F5 (Secondary backgrounds)
- Gray 200: #EEEEEE (Dividers, borders)
- Gray 300: #E0E0E0 (Disabled states)
- Gray 400: #BDBDBD (Placeholder text)
- Gray 500: #9E9E9E (Secondary text)
- Gray 600: #757575 (Body text)
- Gray 700: #616161 (Headings)
- Gray 800: #424242 (Primary text)
- Gray 900: #212121 (Emphasis text)

**Usage Guidelines**
- Gray 50: Page backgrounds, card backgrounds
- Gray 100: Section backgrounds, hover states
- Gray 200: Borders, dividers, separators
- Gray 300: Disabled elements
- Gray 400-500: Secondary text, labels
- Gray 600-700: Body text, descriptions
- Gray 800-900: Headings, emphasis text

### Dark Theme Colors

**Backgrounds**
- Dark Background: #121212
- Dark Surface: #1E1E1E
- Dark Surface Variant: #2D2D2D

**Text**
- Dark Primary: #FFFFFF
- Dark Secondary: #B0B0B0
- Dark Disabled: #6B6B6B

**Semantic Adjustments**
- Dark Success: #81C784
- Dark Warning: #FFD54F
- Dark Error: #E57373
- Dark Info: #64B5F6

---

## 3. Typography Hierarchy

### Font Family

**Primary Font: Inter**
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

**Alternative Fonts**
- Geist (for modern, tech-focused feel)
- Manrope (for geometric, professional look)

**Monospace Font: JetBrains Mono**
- Used for code, numbers, data displays
- Alternative: SF Mono, Fira Code

**Fallback Stack**
```
font-family: 'Inter', 'Geist', 'Manrope', 'Helvetica', 'Arial', sans-serif
```

**Font Loading**
- Use Google Fonts or self-hosted Inter
- Load font-display: swap for performance
- Include font weights: 400, 500, 600, 700

---

## 4. Productivity-First Design Patterns

### Keyboard Shortcuts

**Global Shortcuts**
- `Ctrl/Cmd + K`: Open command palette
- `Ctrl/Cmd + /`: Show keyboard shortcuts
- `Ctrl/Cmd + N`: New item (context-specific)
- `Ctrl/Cmd + F`: Focus search
- `Ctrl/Cmd + S`: Save
- `Escape`: Close modal/drawer/panel
- `Ctrl/Cmd + ,`: Open settings

**Navigation Shortcuts**
- `Ctrl/Cmd + 1-9`: Navigate to sidebar items 1-9
- `Alt + Arrow Left/Right`: Browser back/forward
- `Alt + Arrow Up/Down`: Navigate hierarchy

**Table Shortcuts**
- `Space`: Select/deselect row
- `Shift + Space`: Select range
- `Ctrl/Cmd + A`: Select all
- `Arrow Keys`: Navigate rows
- `Enter`: Open selected item
- `Delete`: Delete selected item (with confirmation)

**Form Shortcuts**
- `Tab`: Next field
- `Shift + Tab`: Previous field
- `Enter`: Submit form
- `Ctrl/Cmd + Enter`: Submit and stay

### Command Palette

**Purpose**
Centralized command interface for power users to quickly access any feature, action, or navigation without using the mouse.

**Features**
- Fuzzy search across all commands
- Keyboard navigation
- Context-aware suggestions
- Recent commands
- Custom shortcuts
- Multi-command execution

**Command Categories**
- Navigation: Go to pages, sections
- Actions: Create, edit, delete items
- Views: Switch views, filters
- Settings: Open specific settings
- Help: Documentation, support

**UI Structure**
```
┌─────────────────────────────────────────┐
│ 🔍 Search commands...            [×]    │
├─────────────────────────────────────────┤
│ Recent                                   │
│ • Create Case              Ctrl+N       │
│ • Search Customers         Ctrl+F       │
├─────────────────────────────────────────┤
│ Navigation                               │
│ • Go to Dashboard                       │
│ • Go to Cases                           │
│ • Go to Customers                       │
├─────────────────────────────────────────┤
│ Actions                                 │
│ • Add Customer                          │
│ • Record Payment                        │
│ • Generate Report                       │
└─────────────────────────────────────────┘
```

### Bulk Actions

**Selection Methods**
- Checkbox selection
- Shift-click for range selection
- Ctrl/Cmd-click for multi-selection
- Select all checkbox
- Keyboard shortcuts

**Bulk Action Menu**
- Position: Fixed bottom bar or floating panel
- Actions: Context-aware based on selection
- Confirmation: For destructive actions
- Progress: Show operation progress

**Common Bulk Actions**
- Change status
- Assign to user
- Delete
- Export
- Send notification
- Schedule recovery action

### Context Menus

**Right-Click Menu**
- Position: At cursor
- Items: Context-aware actions
- Keyboard: Menu key or Shift+F10
- Accessibility: Full keyboard navigation

**Menu Items**
- Primary actions (top)
- Secondary actions (middle)
- Destructive actions (bottom, separated)

**Table Row Context Menu**
- View details
- Edit
- Duplicate
- Delete
- Assign
- Add note
- Schedule action

### Saved Views & Filters

**View Management**
- Save current view configuration
- Name and describe views
- Set default view
- Share views with team
- Personal vs. shared views

**Filter Components**
- Quick filters (chips)
- Advanced filter panel
- Saved filter presets
- Filter combinations (AND/OR)
- Date range presets

**View Configuration**
- Column selection
- Column order
- Column width
- Sort order
- Group by
- Pagination size

### Inline Editing

**Editable Fields**
- Click to edit
- Auto-save on blur
- Validation feedback
- Cancel with Escape
- Save with Enter

**Inline Actions**
- Status dropdowns
- Date pickers
- Number inputs
- Text fields
- Select dropdowns

**Visual Feedback**
- Edit icon on hover
- Highlight on focus
- Success indicator on save
- Error indicator on failure

### Multi-Select Operations

**Selection UI**
- Checkbox column
- Selection counter
- Select all checkbox
- Clear selection button
- Selection summary

**Selection States**
- None selected
- Some selected
- All selected
- Page selected
- All records selected

**Bulk Actions Bar**
- Position: Sticky bottom or top
- Actions: Based on selection type
- Count: Show number selected
- Clear: Deselect all

### Quick Actions

**Floating Action Button**
- Position: Bottom-right
- Actions: Primary create actions
- Menu: Multiple quick actions
- Context-aware: Based on current page

**Quick Action Menu**
- Add Customer
- Create Case
- Record Payment
- Schedule Recovery
- Generate Report

**Keyboard Trigger**
- `Ctrl/Cmd + N`: Open quick actions
- Context-specific based on page

### Search Experience

**Instant Search**
- Real-time results as you type
- Debounce: 300ms
- Minimum characters: 2
- Highlight matches

**Advanced Search**
- Boolean operators (AND, OR, NOT)
- Field-specific search
- Date ranges
- Number ranges
- Wildcards

**Search Results**
- Grouped by type
- Show relevance score
- Display preview
- Keyboard navigation
- Recent searches

**Saved Searches**
- Save search queries
- Name searches
- Set as default
- Share with team

---

## 5. Typography Scale

**Display Typography**
- Display 1: 96px / 1.167 (87.5px) - Hero headlines
- Display 2: 60px / 1.2 (72px) - Large page titles
- Display 3: 48px / 1.2 (57.6px) - Section headers

**Headline Typography**
- Headline 1: 36px / 1.333 (48px) - Page titles
- Headline 2: 30px / 1.333 (40px) - Section titles
- Headline 3: 24px / 1.333 (32px) - Subsection titles
- Headline 4: 20px / 1.4 (28px) - Card titles
- Headline 5: 16px / 1.5 (24px) - List headers
- Headline 6: 14px / 1.4 (19.6px) - Overline labels

**Body Typography**
- Body 1: 16px / 1.5 (24px) - Primary body text
- Body 2: 14px / 1.428 (20px) - Secondary body text
- Caption: 12px / 1.333 (16px) - Helper text, captions
- Overline: 10px / 1.6 (16px) - Labels, tags

**Button Typography**
- Button Large: 16px / 1.75 (28px)
- Button Medium: 14px / 1.75 (24.5px)
- Button Small: 12px / 1.5 (18px)

### Font Weights

**Weight 300 (Light)**
- Usage: Large display text, decorative elements
- Avoid: Body text, UI elements

**Weight 400 (Regular)**
- Usage: Body text, descriptions, labels
- Most common weight for readability

**Weight 500 (Medium)**
- Usage: Headings, emphasis, buttons
- Good balance for UI elements

**Weight 700 (Bold)**
- Usage: Page titles, important CTAs
- Strong emphasis only

### Line Height Guidelines

**Tight: 1.0-1.2**
- Display text, headlines
- Large sizes only

**Normal: 1.3-1.5**
- Body text, paragraphs
- Optimal for readability

**Relaxed: 1.6-2.0**
- Long-form content
- Legal text, descriptions

---

## 4. Font Sizes and Weights

### Size Mapping

| Size | Usage | Weight | Line Height |
|------|-------|--------|-------------|
| 96px | Hero Display | 300 | 1.167 |
| 60px | Large Display | 300 | 1.2 |
| 48px | Medium Display | 400 | 1.2 |
| 36px | H1 Page Title | 400 | 1.333 |
| 30px | H2 Section | 400 | 1.333 |
| 24px | H3 Subsection | 500 | 1.333 |
| 20px | H4 Card Title | 500 | 1.4 |
| 18px | H5 List Title | 500 | 1.4 |
| 16px | Body Large | 400 | 1.5 |
| 16px | Button Large | 500 | 1.75 |
| 14px | Body Regular | 400 | 1.428 |
| 14px | Button Medium | 500 | 1.75 |
| 12px | Caption | 400 | 1.333 |
| 12px | Button Small | 500 | 1.5 |
| 10px | Overline | 500 | 1.6 |

### Responsive Typography

**Mobile (< 768px)**
- Scale down by 10-15%
- Maintain relative hierarchy
- Ensure touch readability

**Tablet (768px - 1024px)**
- Use standard scale
- Optimize for scanning

**Desktop (> 1024px)**
- Full scale implementation
- Optimize for extended reading

---

## 5. Spacing System

### Base Unit: 4px

All spacing follows a 4px grid system for consistency.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| space-0 | 0px | No spacing |
| space-1 | 4px | Tight spacing, icon padding |
| space-2 | 8px | Small gaps, button padding |
| space-3 | 12px | Compact spacing |
| space-4 | 16px | Standard spacing, card padding |
| space-5 | 20px | Medium spacing |
| space-6 | 24px | Section spacing |
| space-8 | 32px | Large spacing |
| space-10 | 40px | Extra large spacing |
| space-12 | 48px | Section breaks |
| space-16 | 64px | Page sections |
| space-20 | 80px | Major divisions |
| space-24 | 96px | Page margins |

### Component Spacing

**Cards**
- Internal padding: 16px-24px
- Card gap: 16px
- Section gap: 24px

**Buttons**
- Horizontal padding: 16px-24px
- Vertical padding: 8px-12px
- Gap between buttons: 8px

**Forms**
- Field spacing: 16px
- Label to input: 8px
- Form section gap: 24px

**Tables**
- Cell padding: 12px-16px
- Row height: 48px-56px
- Header padding: 16px

**Navigation**
- Menu item padding: 12px-16px
- Section gap: 8px
- Logo margin: 16px-24px

---

## 6. Border Radius Standards

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| radius-none | 0px | Tables, dividers |
| radius-sm | 2px | Small elements, tags |
| radius-md | 4px | Buttons, inputs |
| radius-lg | 8px | Cards, dialogs |
| radius-xl | 12px | Large cards, panels |
| radius-2xl | 16px | Hero elements |
| radius-full | 9999px | Pills, badges, avatars |

### Component Guidelines

**Buttons**
- Primary/Secondary: 4px
- Icon buttons: 50% (circular)
- FAB: 50% (circular)

**Inputs**
- Text fields: 4px
- Select dropdowns: 4px
- Search bars: 8px

**Cards**
- Standard cards: 8px
- Dashboard cards: 12px
- Modal cards: 12px

**Chips/Badges**
- Standard: 16px
- Small: 12px

**Dialogs/Modals**
- Standard: 12px
- Full-screen: 0px

**Avatars**
- Circular: 50%
- Rounded: 8px

---

## 7. Shadows and Elevation

### Elevation Scale

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Flat elements |
| 1 | 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) | Cards, raised buttons |
| 2 | 0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12) | Hover states, dropdowns |
| 3 | 0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10) | Modals, drawers |
| 4 | 0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05) | Popovers, tooltips |
| 5 | 0 20px 40px rgba(0,0,0,0.2) | Dialogs, overlays |

### Component Elevation

**Navigation**
- Sidebar: elevation 1
- Top bar: elevation 2
- Dropdowns: elevation 3

**Cards**
- Standard: elevation 1
- Hover: elevation 2
- Active: elevation 1 with border

**Buttons**
- Flat: elevation 0
- Raised: elevation 1
- Hover: elevation 2
- Active: elevation 0

**Modals/Dialogs**
- Standard: elevation 3
- Full-screen: elevation 0

**Drawers**
- Standard: elevation 3
- Temporary: elevation 4

### Dark Theme Shadows

Dark theme shadows use lighter, more subtle shadows:
- Reduce opacity by 30%
- Use white shadows for depth
- Add subtle border for definition

---

## 8. Icon Usage Guidelines

### Icon Library

**Primary: Material Design Icons**
- Comprehensive set
- Consistent style
- Accessible by default

**Icon Categories**
- Navigation: Menu, Home, Dashboard
- Actions: Add, Edit, Delete, Save
- Social: User, Group, Business
- File: File, Folder, Download
- Communication: Email, Phone, Chat
- Status: Check, Warning, Error, Info

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| icon-xs | 16px | Dense lists, buttons |
| icon-sm | 18px | Small buttons, labels |
| icon-md | 20px | Standard buttons, menu |
| icon-lg | 24px | Navigation, cards |
| icon-xl | 32px | Hero elements |
| icon-2xl | 48px | Large displays |

### Icon Guidelines

**Color Usage**
- Primary actions: Primary color
- Secondary actions: Gray 600
- Success states: Success 500
- Warning states: Warning 500
- Error states: Error 500
- Disabled: Gray 300

**Spacing**
- Icon + Text: 8px gap
- Icon only: 16px padding minimum
- Button icons: Centered with 4px margin

**Accessibility**
- Always include aria-label
- Use semantic icons where possible
- Provide text alternatives
- Ensure 3:1 contrast ratio

**Do's**
- Use consistent icon style
- Maintain proper spacing
- Choose meaningful icons
- Test at small sizes

**Don'ts**
- Mix icon styles
- Overuse decorative icons
- Use icons without labels
- Stretch or distort icons

---

## 9. Card Styles

### Card Variants

**Standard Card**
- Background: White (Gray 50 in dark)
- Border: 1px solid Gray 200
- Border radius: 8px
- Shadow: elevation 1
- Padding: 16px-24px

**Elevated Card**
- Background: White
- Border: none
- Border radius: 12px
- Shadow: elevation 2
- Padding: 24px

**Outlined Card**
- Background: Transparent
- Border: 2px solid Gray 200
- Border radius: 8px
- Shadow: none
- Padding: 16px

**Interactive Card**
- Hover: elevation 2, border Primary 200
- Active: elevation 1, border Primary 300
- Focus: 2px solid Primary 500, outline offset 2px

### Card Structure

**Header Card**
```
[Icon/Avatar] [Title] [Menu/Actions]
────────────────────────────────────
[Content]
```

**Body Card**
```
[Title]
────────────────────────────────────
[Content]
────────────────────────────────────
[Actions]
```

**Media Card**
```
[Image/Media]
────────────────────────────────────
[Title]
[Description]
[Actions]
```

### Card Content Guidelines

**Title**
- Headline 5 or 6
- Weight 500
- Color: Gray 800
- Margin bottom: 8px

**Description**
- Body 2
- Weight 400
- Color: Gray 600
- Margin bottom: 16px

**Actions**
- Right-aligned or full-width
- 8px gap between buttons
- Primary action emphasized

---

## 10. Table Styles

### Table Structure

**Header**
- Background: Gray 50
- Border bottom: 2px solid Gray 200
- Text: Headline 6, weight 500, Gray 700
- Padding: 12px-16px
- Height: 48px

**Row**
- Background: White
- Border bottom: 1px solid Gray 200
- Text: Body 2, weight 400, Gray 800
- Padding: 12px-16px
- Height: 48px-56px
- Hover: Gray 50 background

**Alternating Row**
- Background: Gray 50
- Same borders and text

**Selected Row**
- Background: Primary 50
- Border left: 3px solid Primary 500

### Table States

**Empty State**
- Centered content
- Icon: 48px, Gray 300
- Text: Body 1, Gray 500
- Height: 200px minimum

**Loading State**
- Skeleton rows
- 6-8 rows displayed
- Pulse animation

**Error State**
- Error message centered
- Retry action
- Icon: Error 500

### Table Features

**Sortable Headers**
- Sort icon on hover
- Active sort: Primary 500
- Sort indicator: 16px

**Row Actions**
- Three-dot menu
- Hover reveal
- 8px from right edge

**Selection**
- Checkbox column
- Header checkbox for select all
- Selected row highlight

**Pagination**
- Bottom of table
- Left-aligned info
- Right-aligned controls

---

## 11. Button Variants

### Button Hierarchy

**Primary Button**
- Background: Primary 500
- Text: White
- Border: none
- Border radius: 4px
- Padding: 8px 16px (medium), 12px 24px (large)
- Shadow: elevation 1
- Hover: Primary 600, elevation 2
- Active: Primary 700, elevation 0
- Disabled: Gray 300, Gray 500 text

**Secondary Button**
- Background: transparent
- Text: Primary 500
- Border: 1px solid Primary 500
- Border radius: 4px
- Padding: 8px 16px (medium), 12px 24px (large)
- Hover: Primary 50 background
- Active: Primary 100 background
- Disabled: Gray 300, Gray 400 text

**Text Button**
- Background: transparent
- Text: Primary 500
- Border: none
- Padding: 8px 12px
- Hover: Primary 50 background
- Active: Primary 100 background
- Disabled: Gray 400

**Destructive Button**
- Background: Error 500
- Text: White
- Border: none
- Hover: Error 600
- Active: Error 700

**Icon Button**
- Background: transparent
- Icon: Gray 600
- Border: none
- Padding: 8px
- Size: 40px
- Border radius: 50%
- Hover: Gray 100 background

### Button Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|----------|------------|-----------|
| Small | 32px | 6px 12px | 12px | 16px |
| Medium | 36px | 8px 16px | 14px | 18px |
| Large | 44px | 12px 24px | 16px | 20px |

### Button Groups

**Horizontal Group**
- 8px gap between buttons
- First button: left radius 4px, right 0
- Middle buttons: radius 0
- Last button: left radius 0, right 4px

**Vertical Group**
- 8px gap between buttons
- First button: top radius 4px, bottom 0
- Middle buttons: radius 0
- Last button: top radius 0, bottom 4px

---

## 12. Form Field Styles

### Text Fields

**Standard Text Field**
- Border: 1px solid Gray 300
- Border radius: 4px
- Padding: 10px 12px
- Height: 40px
- Background: White
- Text: Body 1, Gray 800

**Focused State**
- Border: 2px solid Primary 500
- Outline: none
- Box shadow: 0 0 0 3px Primary 100

**Error State**
- Border: 2px solid Error 500
- Error text: Error 500, Caption
- Helper text: Error 500

**Disabled State**
- Background: Gray 100
- Border: 1px solid Gray 200
- Text: Gray 400
- Cursor: not-allowed

### Labels

**Floating Label**
- Position: Inside field initially
- Move to: Above field on focus
- Color: Gray 500 → Primary 500 (focus)
- Font: Caption → Overline
- Transition: 0.2s ease

**Static Label**
- Position: Above field
- Color: Gray 700
- Font: Body 2, weight 500
- Margin: 0 0 8px 0

### Helper Text

**Position**: Below field
**Color**: Gray 500
**Font**: Caption
**Margin**: 4px 0 0 0

### Character Count

**Position**: Right-aligned below field
**Color**: Gray 400
**Font**: Caption
**Margin**: 4px 0 0 0

---

## 13. Search Bars

### Standard Search Bar

**Structure**
- Search icon: Left, 16px, Gray 400
- Input: 12px left padding (after icon)
- Clear button: Right, appears on input
- Border: 1px solid Gray 300
- Border radius: 8px
- Height: 40px
- Background: White

**States**
- Default: Gray 300 border
- Focus: Primary 500 border, Primary 100 background
- With value: Clear button visible
- Loading: Spinner in place of clear button

### Compact Search

**Size**: 32px height
**Icon**: 14px
**Padding**: 8px

### Full-width Search

**Width**: 100%
**Max-width**: 600px
**Margin**: 0 auto (centered)

---

## 14. Filters

### Filter Panel

**Container**
- Background: White
- Border: 1px solid Gray 200
- Border radius: 8px
- Padding: 16px
- Shadow: elevation 1

**Filter Groups**
- Section title: Headline 6, Gray 700
- Group spacing: 16px
- Filter spacing: 12px

### Filter Types

**Checkbox Filter**
- Checkbox: 18px
- Label: Body 2, Gray 800
- Gap: 8px
- Hover: Gray 50 background

**Select Filter**
- Standard select styling
- Clear button on right
- Multi-select with chips

**Date Range Filter**
- Two date inputs
- "to" label between
- Quick select options

**Text Filter**
- Standard text field
- Optional operator dropdown

### Active Filters

**Display**
- Chip format
- Remove icon on right
- Primary 50 background
- Primary 700 text
- 8px gap between chips

**Clear All**
- Text button
- Right-aligned
- "Clear all filters"

---

## 15. Chips and Tags

### Chip Variants

**Default Chip**
- Background: Gray 100
- Text: Gray 800
- Border: none
- Border radius: 16px
- Padding: 4px 12px
- Height: 28px
- Font: Caption, weight 500

**Primary Chip**
- Background: Primary 100
- Text: Primary 800
- Border: none

**Success Chip**
- Background: Success 100
- Text: Success 800
- Border: none

**Warning Chip**
- Background: Warning 100
- Text: Warning 800
- Border: none

**Error Chip**
- Background: Error 100
- Text: Error 800
- Border: none

**Outlined Chip**
- Background: transparent
- Text: Gray 700
- Border: 1px solid Gray 300

### Chip Elements

**With Icon**
- Icon: 16px
- Icon-text gap: 6px
- Remove icon: 16px

**Deletable**
- Remove icon: 16px
- Hover: Error 500
- Click: Remove chip

**Clickable**
- Hover: elevation 1
- Cursor: pointer
- Active: elevation 0

---

## 16. Badges

### Badge Variants

**Dot Badge**
- Size: 8px diameter
- Border radius: 50%
- Position: Top-right corner
- Offset: 4px from edge

**Count Badge**
- Background: Error 500
- Text: White
- Font: Overline
- Padding: 2px 6px
- Border radius: 10px
- Min-width: 18px

**Status Badge**
- Background: Gray 100
- Text: Gray 800
- Font: Caption, weight 500
- Padding: 2px 8px
- Border radius: 4px

### Badge Colors

**Status Colors**
- Active: Success 500
- Inactive: Gray 400
- Pending: Warning 500
- Error: Error 500
- Info: Primary 500

---

## 17. Alerts

### Alert Variants

**Success Alert**
- Background: Success 50
- Border: 1px solid Success 200
- Icon: Success 500, 24px
- Title: Success 800, Headline 6
- Text: Success 700, Body 2

**Warning Alert**
- Background: Warning 50
- Border: 1px solid Warning 200
- Icon: Warning 500, 24px
- Title: Warning 800, Headline 6
- Text: Warning 700, Body 2

**Error Alert**
- Background: Error 50
- Border: 1px solid Error 200
- Icon: Error 500, 24px
- Title: Error 800, Headline 6
- Text: Error 700, Body 2

**Info Alert**
- Background: Info 50
- Border: 1px solid Info 200
- Icon: Info 500, 24px
- Title: Info 800, Headline 6
- Text: Info 700, Body 2

### Alert Structure

**Layout**
- Icon: Left, 24px
- Content: Middle, flex-1
- Close: Right, 20px
- Padding: 12px 16px
- Border radius: 4px

**Content**
- Title: Headline 6, weight 500
- Message: Body 2, weight 400
- Title-message gap: 4px

---

## 18. Toast Notifications

### Toast Variants

**Success Toast**
- Background: Gray 800
- Icon: Success 400, 20px
- Text: White
- Border radius: 4px
- Shadow: elevation 3

**Error Toast**
- Background: Gray 800
- Icon: Error 400, 20px
- Text: White
- Border radius: 4px

**Info Toast**
- Background: Gray 800
- Icon: Info 400, 20px
- Text: White
- Border radius: 4px

### Toast Structure

**Layout**
- Icon: Left, 20px
- Message: Middle, Body 2
- Close: Right, 20px
- Padding: 12px 16px
- Min-width: 280px
- Max-width: 400px

**Positioning**
- Top-right: Default
- Top-left: Alternative
- Bottom-right: Alternative
- Bottom-left: Alternative

**Animation**
- Slide in: 0.3s ease
- Slide out: 0.3s ease
- Auto-dismiss: 4-6 seconds

---

## 19. Dialogs and Modals

### Dialog Structure

**Container**
- Background: White
- Border radius: 12px
- Shadow: elevation 3
- Max-width: 600px
- Max-height: 90vh
- Padding: 24px

**Backdrop**
- Background: rgba(0, 0, 0, 0.5)
- Click to close: Optional

**Header**
- Title: Headline 4, Gray 900
- Subtitle: Body 1, Gray 600
- Close button: Top-right, 24px
- Padding: 0 0 16px 0

**Body**
- Content: Body 1, Gray 800
- Padding: 0 0 24px 0
- Scrollable if needed

**Footer**
- Actions: Right-aligned
- Primary action: Rightmost
- Gap: 8px
- Padding: 16px 0 0 0

### Dialog Sizes

| Size | Max-width | Usage |
|------|-----------|-------|
| Small | 400px | Confirmations, simple forms |
| Medium | 600px | Standard dialogs |
| Large | 800px | Complex forms, tables |
| Full-screen | 95vw | Mobile, complex content |

---

## 20. Drawers

### Drawer Variants

**Temporary Drawer**
- Width: 280px (mobile), 320px (desktop)
- Background: White
- Shadow: elevation 3
- Overlay: rgba(0, 0, 0, 0.5)
- Slide from: Left or right

**Persistent Drawer**
- Width: 240px
- Background: White
- Shadow: elevation 1
- No overlay
- Pushes content

**Mini Drawer**
- Width: 72px
- Icons only
- Expand on hover
- Tooltip labels

### Drawer Structure

**Header**
- Logo/Title: 16px padding
- Height: 64px
- Border bottom: 1px solid Gray 200

**Content**
- Navigation items
- 8px gap between sections
- 4px gap between items

**Footer**
- User info or actions
- 16px padding
- Border top: 1px solid Gray 200

---

## 21. Tabs

### Tab Variants

**Standard Tabs**
- Background: transparent
- Active: Primary 500 text, 2px bottom border
- Inactive: Gray 600 text
- Hover: Gray 800 text
- Padding: 12px 16px
- Height: 48px

**Contained Tabs**
- Background: Gray 100
- Active: White background, shadow
- Inactive: Transparent
- Border radius: 4px
- Padding: 8px 16px

**Scrollable Tabs**
- Horizontal scroll
- Scroll indicators
- Fixed width container

### Tab Content

**Panel**
- Padding: 24px
- Background: White
- Border: 1px solid Gray 200
- Border radius: 0 0 8px 8px

**Animation**
- Fade in: 0.2s ease
- Slide: Optional

---

## 22. Accordions

### Accordion Structure

**Summary**
- Background: White
- Border: 1px solid Gray 200
- Border radius: 4px
- Padding: 12px 16px
- Height: 48px
- Display: flex, align center
- Cursor: pointer

**Expanded State**
- Background: Gray 50
- Border: 1px solid Primary 200
- Icon rotation: 180deg

**Content**
- Padding: 16px
- Background: White
- Border: 1px solid Gray 200
- Border-top: none
- Border-radius: 0 0 4px 4px

### Accordion Variants

**Default**
- Standard styling
- One expanded at a time

**Multiple**
- Multiple sections expanded
- Independent control

**No Elevation**
- Flat design
- No shadow on expand

---

## 23. Pagination

### Pagination Structure

**Container**
- Display: flex
- Align: center
- Gap: 8px
- Padding: 16px 0

**Page Info**
- Text: Body 2, Gray 600
- Format: "1-10 of 100"

**Page Buttons**
- Size: 32px
- Border radius: 4px
- Border: 1px solid Gray 200
- Background: White
- Text: Body 2

**States**
- Current: Primary 500 background, White text
- Hover: Gray 100 background
- Disabled: Gray 300 background, Gray 500 text

**Navigation**
- Previous/Next: Icon buttons
- First/Last: Optional
- Ellipsis for gaps

---

## 24. Empty States

### Empty State Structure

**Container**
- Min-height: 200px
- Display: flex
- Flex-direction: column
- Align: center
- Justify: center
- Padding: 32px

**Icon**
- Size: 64px
- Color: Gray 300
- Margin: 0 0 16px 0

**Title**
- Headline 5, Gray 700
- Weight: 500
- Margin: 0 0 8px 0

**Description**
- Body 1, Gray 500
- Max-width: 400px
- Text-align: center
- Margin: 0 0 24px 0

**Action**
- Primary button
- Optional secondary button

### Empty State Types

**No Data**
- Generic "no data" message
- Suggest next action

**No Results**
- Search-specific message
- Clear filters option

**No Connection**
- Network error
- Retry action

**No Access**
- Permission denied
- Contact admin

---

## 25. Loading Skeletons

### Skeleton Structure

**Base**
- Background: Gray 200
- Animation: Pulse
- Border radius: 4px

**Animation**
- Keyframes: 0% → 50% → 100%
- Opacity: 0.6 → 1 → 0.6
- Duration: 1.5s
- Timing: ease-in-out

### Skeleton Patterns

**Text Skeleton**
- Height: 16px
- Width: 60-100%
- Multiple lines with 8px gap

**Avatar Skeleton**
- Size: 40px
- Border radius: 50%

**Card Skeleton**
- Header: 24px height
- Body: 3-4 lines of 16px
- Gap: 12px

**Table Skeleton**
- Row height: 48px
- 6-8 rows
- Cell width: varied

---

## 26. Error States

### Error State Structure

**Container**
- Min-height: 200px
- Display: flex
- Flex-direction: column
- Align: center
- Padding: 32px

**Icon**
- Size: 64px
- Color: Error 300
- Margin: 0 0 16px 0

**Title**
- Headline 5, Error 700
- Weight: 500
- Margin: 0 0 8px 0

**Message**
- Body 1, Gray 600
- Max-width: 400px
- Text-align: center
- Margin: 0 0 24px 0

**Actions**
- Retry button: Primary
- Secondary action: Optional

### Error Types

**Network Error**
- "Connection failed"
- Retry action

**Server Error**
- "Something went wrong"
- Contact support

**Not Found**
- "Page not found"
- Go home

**Permission Error**
- "Access denied"
- Contact admin

---

## 27. Enterprise Dashboard Specifications

### Dashboard Philosophy

Dashboards should emphasize clarity and provide actionable insights at a glance. Avoid excessive widgets on a single screen. Focus on the most important KPIs and data visualizations that drive decision-making.

### Dashboard Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Title              [Date Range] [Export] [Customize]      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   KPI 1  │  │   KPI 2  │  │   KPI 3  │  │   KPI 4  │      │
│  │  Value   │  │  Value   │  │  Value   │  │  Value   │      │
│  │  Trend   │  │  Trend   │  │  Trend   │  │  Trend   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │   Main Chart         │  │   Secondary Chart    │          │
│  │   (Large)            │  │   (Medium)           │          │
│  └──────────────────────┘  └──────────────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │   Activity Timeline  │  │   Recent Activity    │          │
│  └──────────────────────┘  └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### KPI Cards

**Card Structure**
- Value: Large, prominent number
- Label: Descriptive text below value
- Trend: Up/down arrow with percentage
- Sparkline: Mini chart showing trend
- Comparison: Previous period comparison

**KPI Card Types**
- Total Customers: Number with trend
- Active Cases: Number with status breakdown
- Total Recovered: Currency with trend
- Recovery Rate: Percentage with trend
- Average Collection Time: Days with trend
- Promise to Pay Rate: Percentage with trend

**Visual Guidelines**
- Height: 120px
- Padding: 16px
- Border radius: 8px
- Shadow: elevation 1
- Hover: elevation 2

**Trend Indicators**
- Positive trend: Green arrow up
- Negative trend: Red arrow down
- Neutral: Gray dash
- Percentage change: Small text next to arrow

### Charts & Data Visualization

**Chart Types**

**Line Charts**
- Usage: Trends over time
- Features: Multiple lines, tooltips, zoom
- Colors: Primary, secondary, semantic
- Grid: Subtle horizontal lines
- Legend: Top or right

**Bar Charts**
- Usage: Comparisons between categories
- Features: Grouped bars, stacked bars
- Colors: Semantic or categorical
- Labels: Bottom axis
- Values: On hover or always visible

**Pie/Donut Charts**
- Usage: Part-to-whole relationships
- Features: Donut style, legend
- Colors: Semantic palette
- Labels: Legend with percentages
- Max segments: 6-8

**Area Charts**
- Usage: Volume over time
- Features: Fill with gradient
- Colors: Primary with opacity
- Grid: Subtle horizontal lines

**Heat Maps**
- Usage: Data density, patterns
- Features: Color gradient scale
- Colors: Sequential or diverging
- Labels: Both axes
- Tooltip: Detailed values

**Interactive Features**
- Hover: Show detailed tooltip
- Click: Drill down to details
- Zoom: Time range selection
- Filter: Click to filter data
- Export: Download chart data

### Activity Timeline

**Timeline Structure**
- Vertical timeline with nodes
- Date/time on left
- Activity details on right
- Icon indicating activity type
- Color-coded by activity type

**Activity Types**
- Case created: Blue
- Payment received: Green
- Recovery action: Purple
- Status change: Orange
- Note added: Gray
- Legal action: Red

**Timeline Features**
- Expandable items
- Filter by activity type
- Date range selector
- Load more on scroll
- Real-time updates

### Recent Activity Feed

**Feed Structure**
- Compact list of recent actions
- User avatar and name
- Action description
- Time ago
- Related item link

**Feed Features**
- Auto-refresh every 30 seconds
- Pull to refresh
- Mark as read
- Filter by type
- Infinite scroll

### Dashboard Customization

**Customization Options**
- Add/remove widgets
- Rearrange widgets (drag & drop)
- Resize widgets
- Create custom views
- Set default view
- Share views with team

**Widget Library**
- KPI cards
- Charts (line, bar, pie, area)
- Tables
- Timelines
- Activity feeds
- Calendars
- Lists

**Saved Views**
- Personal views
- Team views
- Default view per user role
- View templates
- View sharing permissions

### Dashboard Performance

**Optimization**
- Lazy load charts
- Virtual scroll long lists
- Cache dashboard data
- Incremental loading
- Debounce resize events
- Optimize chart rendering

**Real-time Updates**
- WebSocket for live data
- Optimistic UI updates
- Conflict resolution
- Reconnection handling
- Offline indicator

---

## 28. AI Experience Integration

### AI Design Philosophy

AI should be integrated naturally into the workflow, assisting users without interrupting their tasks. AI features should be contextual, helpful, and unobtrusive.

### AI Assistant Panel

**Panel Structure**
```
┌─────────────────────────────────────────┐
│ 🤖 AI Assistant                    [×]  │
├─────────────────────────────────────────┤
│ How can I help you today?              │
│                                         │
│ [Ask me anything...]                    │
│                                         │
│ Suggested Actions:                      │
│ • Analyze case #12345                   │
│ • Summarize recent payments             │
│ • Predict recovery likelihood            │
│                                         │
│ Recent Insights:                        │
│ • 3 cases need attention                │
│ • Payment rate increased 12%            │
│ • 5 customers at high risk              │
└─────────────────────────────────────────┘
```

**Panel Features**
- Collapsible side panel
- Context-aware suggestions
- Chat interface for questions
- Proactive insights
- Quick action suggestions

**AI Interactions**
- Natural language queries
- Context-aware responses
- Actionable suggestions
- Explainable AI decisions
- Feedback mechanism

### Suggested Next Actions

**Context-Aware Suggestions**
- Based on current page
- Based on user behavior
- Based on data patterns
- Based on time of day

**Suggestion Types**
- "Schedule follow-up for case #12345"
- "Send payment reminder to John Doe"
- "Review high-risk cases"
- "Generate weekly report"

**UI Implementation**
- Floating suggestion card
- Dismissible with one click
- Learn from dismissals
- Priority-based display
- Maximum 3 suggestions at once

### AI-Generated Summaries

**Summary Types**
- Case summary: Key details, timeline, next steps
- Customer summary: Debt history, payment patterns, risk score
- Daily digest: Important events, metrics, recommendations
- Meeting prep: Relevant cases, upcoming deadlines

**Summary Features**
- One-click generation
- Editable summaries
- Share with team
- Export to document
- Voice reading option

### Risk Scores & Predictions

**Risk Scoring**
- Customer risk: Payment likelihood
- Case risk: Recovery probability
- Portfolio risk: Overall exposure

**Visual Presentation**
- Risk gauge (0-100)
- Color-coded (green/yellow/red)
- Confidence interval
- Contributing factors
- Historical trend

**Predictive Features**
- Payment prediction: Next payment date, amount
- Recovery prediction: Likelihood, timeline
- Churn prediction: Customer at-risk indicators

### Smart Recommendations

**Recommendation Engine**
- Based on historical data
- Based on similar cases
- Based on best practices
- Based on user preferences

**Recommendation Types**
- Recovery strategy: Best approach for case
- Contact timing: Optimal time to reach customer
- Payment terms: Suggested payment plan
- Resource allocation: Agent assignment

**UI Implementation**
- Recommendation card with explanation
- Accept/Reject actions
- Learn from decisions
- A/B testing of suggestions

### Intelligent Alerts

**Smart Alerting**
- Anomaly detection: Unusual patterns
- Threshold alerts: KPI breaches
- Predictive alerts: Future issues
- Opportunity alerts: Positive trends

**Alert Prioritization**
- Critical: Immediate attention required
- High: Address within 24 hours
- Medium: Address within week
- Low: Informational

**Alert Actions**
- One-click response
- Suggested actions
- Escalation path
- Snooze options

### AI Accessibility

**Explainable AI**
- Clear reasoning for suggestions
- Data sources transparency
- Confidence levels displayed
- Alternative options provided

**User Control**
- Enable/disable AI features
- Adjust AI sensitivity
- Provide feedback on suggestions
- Custom AI preferences

---

## 29. Mobile Experience Specifications

### Mobile Design Philosophy

The mobile interface focuses on field agents who need to access critical information, perform actions on-the-go, and work in potentially offline environments.

### Mobile Layout Structure

```
┌─────────────────────────────────────┐
│ [☰] RecoverFlow  [🔔] [👤]        │ ← Top Bar (56px)
├─────────────────────────────────────┤
│                                     │
│  [Mobile Dashboard Content]         │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Stat 1   │  │ Stat 2   │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  [Action Buttons]                   │
│                                     │
│  [Recent Activity List]             │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [🏠] [📋] [💰] [⚙️] [➕]          │ ← Bottom Nav (56px)
└─────────────────────────────────────┘
```

### Mobile Navigation

**Bottom Navigation Bar**
- 5 primary destinations
- Active state indicator
- Badge for notifications
- 56px height
- Fixed position bottom

**Navigation Items**
- Home: Dashboard
- Cases: Assigned cases
- Payments: Recent payments
- Settings: App settings
- Quick actions: FAB

**Hamburger Menu**
- Secondary navigation
- Full-screen drawer
- Slide from left
- Close on selection

### Mobile Dashboard

**KPI Cards**
- 2-column grid
- Simplified information
- Tap for details
- Swipe to refresh

**Quick Actions**
- Large touch targets (48px minimum)
- One-tap actions
- Context-aware based on user role
- Most common actions prioritized

**Recent Activity**
- Compact list view
- Swipe actions (left-right)
- Pull to refresh
- Infinite scroll

### Field Agent Features

**Customer Details**
- Quick view card
- Contact information
- Debt summary
- Payment history
- Action buttons

**Click-to-Call**
- One-tap calling
- Call logging
- Call notes
- Follow-up reminder

**GPS Navigation**
- Customer location
- Route optimization
- Travel time
- Check-in/out

**Follow-up Updates**
- Quick status update
- Voice notes
- Photo upload
- Location stamp

**Payment Collection**
- Record payment
- Photo receipt
- Digital signature
- Instant confirmation

### Offline Mode

**Offline Capabilities**
- View assigned cases
- Access customer details
- Record actions
- Take photos
- Voice notes

**Sync Strategy**
- Auto-sync when online
- Manual sync option
- Conflict resolution
- Sync progress indicator
- Offline data indicator

**Data Caching**
- Critical data cached
- Recent cases cached
- Customer data cached
- Forms cached
- Sync queue management

### Mobile Forms

**Form Design**
- Single column layout
- Large touch targets (48px minimum)
- Auto-advance fields
- Voice input support
- Camera integration

**Form Features**
- Auto-save drafts
- Offline support
- Validation feedback
- Progress indicator
- Submit with confirmation

**Input Types**
- Date picker: Native mobile picker
- Time picker: Native mobile picker
- Number pad: Numeric keyboard
- Phone: Phone keyboard with formatting
- Email: Email keyboard with validation

### Mobile Performance

**Optimization**
- Lazy loading
- Image optimization
- Code splitting
- Service worker
- Cache strategies

**Loading States**
- Skeleton screens
- Progress indicators
- Optimistic UI
- Error boundaries
- Retry mechanisms

### Mobile Accessibility

**Touch Targets**
- Minimum 44x44px
- Recommended 48x48px
- 8px spacing between targets
- Gesture alternatives

**Screen Reader**
- Proper labels on all controls
- Semantic HTML
- ARIA attributes
- Focus management
- Announcement of changes

**Contrast**
- 4.5:1 minimum for text
- 3:1 for large text
- 3:1 for UI components
- Outdoor visibility consideration

---

## 30. Responsive Breakpoints

### Breakpoint Scale

| Breakpoint | Min-width | Max-width | Usage |
|------------|-----------|-----------|-------|
| xs | 0px | 599px | Mobile portrait |
| sm | 600px | 959px | Mobile landscape |
| md | 960px | 1279px | Tablet |
| lg | 1280px | 1919px | Desktop |
| xl | 1920px | ∞ | Large desktop |

### Layout Adaptations

**Mobile (< 600px)**
- Single column layouts
- Stacked navigation
- Full-width cards
- Simplified tables (card view)
- Bottom navigation bar

**Tablet (600px - 960px)**
- 2-column grids
- Collapsible sidebar
- Standard tables
- Touch-optimized controls

**Desktop (960px - 1280px)**
- 3-column grids
- Fixed sidebar
- Full feature set
- Hover interactions

**Large Desktop (> 1280px)**
- 4-column grids
- Expanded content
- Maximum information density
- Advanced features

---

## 28. Light and Dark Themes

### Theme Switching

**Toggle**
- Position: Top bar or settings
- Icon: Sun/Moon
- Animation: Fade 0.3s

**Persistence**
- Local storage
- System preference fallback
- Per-user setting

### Light Theme

**Backgrounds**
- Primary: #FFFFFF
- Secondary: #F5F5F5
- Tertiary: #EEEEEE

**Text**
- Primary: #212121
- Secondary: #616161
- Disabled: #9E9E9E

### Dark Theme

**Backgrounds**
- Primary: #121212
- Secondary: #1E1E1E
- Tertiary: #2D2D2D

**Text**
- Primary: #FFFFFF
- Secondary: #B0B0B0
- Disabled: #6B6B6B

**Semantic Adjustments**
- Reduce saturation by 20%
- Increase lightness for accessibility
- Add subtle borders for definition

---

## 29. Accessibility Guidelines

### Color Contrast

**Text Contrast**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Interactive Elements**
- Focus indicators: 3:1 minimum
- Hover states: 3:1 contrast change
- Active states: Clear visual feedback

### Keyboard Navigation

**Tab Order**
- Logical left-to-right, top-to-bottom
- Skip navigation link
- Focus trap in modals

**Focus Styles**
- 2px solid Primary 500
- 3px offset outline
- Always visible on keyboard focus

**Shortcuts**
- Common shortcuts documented
- Escape to close modals
- Enter to submit forms

### Screen Readers

**Semantic HTML**
- Proper heading hierarchy
- ARIA labels where needed
- Live regions for dynamic content

**Alternative Text**
- All images have alt text
- Icons have aria-label
- Decorative elements hidden

### Touch Targets

**Minimum Size**
- 44x44px minimum
- 48x48px recommended
- 8px spacing between targets

**Gesture Support**
- Alternative to complex gestures
- Clear visual feedback
- Timeout for gestures

---

## 30. Component Naming Conventions

### Naming Pattern

**Format**: `[Purpose][Variant][Size][State]`

**Examples**
- `ButtonPrimaryMedium`
- `ButtonSecondaryLargeDisabled`
- `TextFieldStandardError`
- `CardElevatedHover`
- `TableStandardSelectable`

### File Naming

**Components**
- PascalCase: `Button.tsx`
- Groups: `Button/`, `Card/`
- Index: `Button/index.tsx`

**Styles**
- camelCase: `buttonStyles.ts`
- Themes: `theme.ts`
- Tokens: `tokens.ts`

### CSS Class Naming

**BEM Methodology**
- Block: `.card`
- Element: `.card__header`
- Modifier: `.card--elevated`

**Utility Classes**
- Purpose-based: `.text-center`, `.flex-row`
- Size-based: `.p-4`, `.m-2`
- State-based: `.is-active`, `.is-disabled`

### Token Naming

**Colors**
- Semantic: `color-primary-500`
- Functional: `color-text-primary`
- State: `color-success-500`

**Spacing**
- Scale: `spacing-4`, `spacing-8`
- Component: `spacing-card-padding`

**Typography**
- Role: `font-heading-1`
- Size: `font-size-16`
- Weight: `font-weight-500`

---

## Implementation Notes

### Design Tokens

All values should be stored as design tokens for:
- Consistency across components
- Easy theme switching
- Scalable maintenance
- Design system documentation

### Component Library

Build components following:
- Atomic design principles
- Reusable patterns
- Documented props
- Storybook integration

### Design Handoff

Use tools like:
- Figma for design
- Zeplin for handoff
- Design tokens export
- Component documentation

---

## Version History

**v2.0.0** - June 30, 2026
- Premium enterprise vision implementation
- Updated color palette to Deep Blue primary with semantic status mapping
- Changed typography to Inter/Geist/Manrope fonts
- Added comprehensive productivity-first design patterns
- Added command palette specification
- Added enterprise dashboard specifications with KPI cards and data visualization
- Added AI experience integration patterns
- Added mobile experience specifications for field agents
- Updated design inspiration references
- Enhanced accessibility guidelines

**v1.0.0** - June 30, 2026
- Initial design system
- Complete specification
- Accessibility compliance
- Dark theme support
