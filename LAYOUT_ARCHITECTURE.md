# RecoverFlow Layout Architecture
## Application Layout System Specification

Version: 1.0.0
Last Updated: June 30, 2026

---

## Table of Contents

1. [Layout Overview](#layout-overview)
2. [Login Layout](#login-layout)
3. [Dashboard Layout](#dashboard-layout)
4. [Sidebar Navigation](#sidebar-navigation)
5. [Top Navigation](#top-navigation)
6. [Footer](#footer)
7. [Breadcrumbs](#breadcrumbs)
8. [Global Search](#global-search)
9. [Notification Panel](#notification-panel)
10. [Profile Menu](#profile-menu)
11. [Quick Action Menu](#quick-action-menu)
12. [Floating Action Button](#floating-action-button)
13. [Navigation Hierarchy](#navigation-hierarchy)
14. [Layout Diagrams](#layout-diagrams)

---

## Layout Overview

### Layout Strategy

**Primary Layouts**
- **Auth Layout**: For login, registration, password reset
- **Main Layout**: For authenticated application views
- **Full-Screen Layout**: For specialized views (reports, analytics)

**Layout Principles**
- Consistent navigation patterns
- Progressive disclosure of information
- Responsive-first design
- Keyboard-accessible navigation
- Screen reader compatible

**Layout Switching**
- Auth → Main: After successful authentication
- Main → Auth: After logout
- Main → Full-Screen: For specific features
- Full-Screen → Main: Via back/close button

---

## Login Layout

### Purpose

Provide a secure, focused authentication experience for users to access the RecoverFlow platform. Supports login, registration, and password recovery flows.

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   [Logo/Brand]                           │
│                  RecoverFlow                             │
│            Debt Recovery Management                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                 │  │
│  │              [Authentication Form]               │  │
│  │                                                 │  │
│  │  Email: [____________________]                  │  │
│  │  Password: [____________________]               │  │
│  │                                                 │  │
│  │  [        Login Button        ]                 │  │
│  │                                                 │  │
│  │  Forgot password? | Create account              │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│              © 2026 RecoverFlow                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

**Container**
- `Box` (MUI)
  - `Container` (maxWidth="sm")
    - `Paper` (elevation=3)
      - `Typography` (brand logo)
      - `Typography` (tagline)
      - `Divider`
      - `Form` component
        - `TextField` (email)
        - `TextField` (password)
        - `Button` (primary, login)
        - `Button` (text, forgot password)
        - `Button` (text, register)
      - `Divider`
      - `Typography` (copyright)

### User Interactions

**Form Interactions**
- Email field: Auto-focus on load, validation on blur
- Password field: Show/hide toggle, validation on blur
- Login button: Disabled until valid, loading state on submit
- Forgot password: Navigate to recovery flow
- Register: Navigate to registration flow

**Keyboard Navigation**
- Tab: Navigate between form fields
- Enter: Submit form when on login button
- Escape: Clear form or cancel
- Focus management: Return focus after error

### Responsive Behavior

**Desktop (> 960px)**
- Centered card: 400px width
- Max-height: 90vh
- Vertical centering

**Tablet (600px - 960px)**
- Centered card: 350px width
- Full-width on small tablets

**Mobile (< 600px)**
- Full-width card
- 16px side margins
- Adjusted padding

### Accessibility

**ARIA Attributes**
- `role="form"` on form container
- `aria-label="Login form"`
- `aria-required` on required fields
- `aria-invalid` on validation errors
- `aria-describedby` for error messages

**Focus Management**
- Initial focus: Email field
- Error focus: First invalid field
- Success focus: Confirmation message

**Screen Reader Support**
- Form labels associated with inputs
- Error messages announced
- Loading states communicated

### Recommended Material UI Components

- `Container` - Centered layout
- `Paper` - Card container
- `TextField` - Input fields
- `Button` - Actions
- `Typography` - Text elements
- `Divider` - Visual separation
- `Link` - Navigation links

---

## Dashboard Layout

### Purpose

Provide the primary application interface with navigation, content area, and supporting elements for authenticated users to access all features.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  RecoverFlow    [Search]  [Notifications]  [Profile]     │ ← Top Navigation
├──────────┬──────────────────────────────────────────────────────┤
│          │  Breadcrumb: Home > Dashboard > Cases                 │ ← Breadcrumbs
│  Sidebar │  ┌────────────────────────────────────────────────┐  │
│          │  │                                                │  │
│  [Menu]  │  │              [Main Content Area]              │  │
│          │  │                                                │  │
│  • Dash  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  board   │  │  │ Stat 1   │  │ Stat 2   │  │ Stat 3   │    │  │
│  • Cases │  │  └──────────┘  └──────────┘  └──────────┘    │  │
│  • Recov │  │                                                │  │
│  ery     │  │  [Data Table / Charts / Forms]                │  │
│  • Paym  │  │                                                │  │
│  ents    │  │                                                │  │
│  • Repor │  │                                                │  │
│  ts      │  │                                                │  │
│  • Setti │  │                                                │  │
│  ngs     │  │                                                │  │
│          │  └────────────────────────────────────────────────┘  │
├──────────┴──────────────────────────────────────────────────────┤
│  © 2026 RecoverFlow | Privacy | Terms | Help                    │ ← Footer
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

**Main Container**
- `Box` (display="flex", height="100vh")
  - `AppBar` (Top Navigation)
  - `Box` (display="flex", flex=1)
    - `Drawer` (Sidebar)
    - `Box` (Main Content)
      - `Breadcrumbs`
      - `Container` (Content)
        - Page-specific content
  - `Box` (Footer)

### User Interactions

**Sidebar Interactions**
- Menu item click: Navigate to page
- Menu item hover: Show tooltip (collapsed mode)
- Collapse/expand: Toggle sidebar width
- Active state: Visual indicator

**Top Bar Interactions**
- Search: Open search modal/panel
- Notifications: Open notification panel
- Profile: Open profile menu dropdown
- Logo: Navigate to dashboard

**Content Interactions**
- Breadcrumb: Navigate to parent pages
- Page actions: Context-specific buttons
- Data interactions: Sort, filter, pagination

### Responsive Behavior

**Desktop (> 1280px)**
- Sidebar: 240px width, permanent
- Top bar: Full width
- Content: Max-width 1400px
- Footer: Full width

**Desktop (960px - 1280px)**
- Sidebar: 240px width, permanent
- Top bar: Full width
- Content: Full width
- Footer: Full width

**Tablet (600px - 960px)**
- Sidebar: 240px width, collapsible
- Top bar: Full width
- Content: Full width
- Footer: Hidden or minimal

**Mobile (< 600px)**
- Sidebar: Hidden, bottom navigation
- Top bar: Simplified
- Content: Full width
- Footer: Hidden

### Keyboard Navigation

**Tab Order**
1. Skip navigation link
2. Logo
3. Search input
4. Notifications button
5. Profile menu
6. Sidebar menu items
7. Breadcrumb links
8. Page content
9. Footer links

**Shortcuts**
- `Ctrl/Cmd + K`: Open global search
- `Ctrl/Cmd + /`: Open keyboard shortcuts
- `Escape`: Close modals/panels
- `Alt + M`: Focus sidebar
- `Alt + S`: Focus search

### Accessibility

**Landmarks**
- `role="banner"`: Top navigation
- `role="navigation"`: Sidebar
- `role="main"`: Content area
- `role="contentinfo"`: Footer

**ARIA Labels**
- `aria-label="Main navigation"`: Sidebar
- `aria-label="User menu"`: Profile menu
- `aria-current="page"`: Current page in sidebar

**Focus Management**
- Skip link for keyboard users
- Focus trap in modals
- Visible focus indicators

### Recommended Material UI Components

- `AppBar` - Top navigation bar
- `Drawer` - Sidebar navigation
- `Breadcrumbs` - Navigation breadcrumbs
- `Container` - Content container
- `Toolbar` - Toolbar layout
- `IconButton` - Icon buttons
- `Menu` - Dropdown menus
- `Divider` - Visual separation

---

## Sidebar Navigation

### Purpose

Provide primary navigation to all main application sections, allowing users to quickly access different features and understand their current location.

### Layout Structure

```
┌─────────────────┐
│  [Logo]         │ ← Logo area (64px height)
│  RecoverFlow    │
├─────────────────┤
│                 │
│  • Dashboard    │ ← Menu items (48px each)
│  • Tenants      │
│  • Users        │
│  • Customers    │
│  • Cases        │
│  • Recovery     │
│  • Payments     │
│  • Reports      │
│  • AI Assistant │
│  • Settings     │
│                 │
├─────────────────┤
│  [User Info]    │ ← User info (optional, 64px height)
│  John Doe       │
└─────────────────┘
```

### Component Hierarchy

**Sidebar Container**
- `Drawer` (variant="permanent", anchor="left")
  - `Toolbar` (Logo area)
    - `Typography` (Logo)
  - `Divider`
  - `List` (Menu items)
    - `ListItem` (each menu item)
      - `ListItemIcon` (Icon)
      - `ListItemText` (Label)
  - `Divider`
  - `Box` (User info - optional)
    - `Avatar`
    - `Typography` (User name)

### Menu Structure

**Primary Navigation**
```
Dashboard (icon: Dashboard)
├── Overview
├── Statistics
└── Activity

Tenants (icon: Business)
├── All Tenants
├── Add Tenant
└── Tenant Settings

Users (icon: People)
├── All Users
├── Roles
└── Permissions

Customers (icon: AccountBalance)
├── All Customers
├── Add Customer
└── Customer Details

Cases (icon: Gavel)
├── All Cases
├── My Cases
├── Add Case
└── Case Workflow

Recovery (icon: Payment)
├── Recovery Actions
├── Schedule
└── Templates

Payments (icon: Payment)
├── All Payments
├── Record Payment
└── Payment History

Reports (icon: Assessment)
├── Dashboard Reports
├── Recovery Reports
├── Payment Reports
└── Custom Reports

AI Assistant (icon: SmartToy)
├── Chat
├── Insights
└── Automation

Settings (icon: Settings)
├── Profile
├── Organization
├── Security
└── Preferences
```

### User Interactions

**Menu Item States**
- Default: Gray text, no background
- Hover: Gray 100 background
- Active: Primary 50 background, Primary 700 text
- Focus: 2px Primary 500 outline

**Collapse/Expand**
- Expanded: Full labels visible (240px width)
- Collapsed: Icons only (72px width)
- Tooltip: Show on hover when collapsed
- Transition: 0.3s ease

**Nested Menus**
- Click: Expand/collapse submenu
- Chevron: Rotate 180deg on expand
- Indentation: 16px per level
- Max depth: 2 levels

### Responsive Behavior

**Desktop (> 960px)**
- Width: 240px (expanded), 72px (collapsed)
- Position: Fixed left
- Always visible

**Tablet (600px - 960px)**
- Width: 240px
- Position: Fixed left
- Collapsible via hamburger menu

**Mobile (< 600px)**
- Hidden by default
- Slide-in drawer
- Full-height overlay
- Close on selection

### Keyboard Navigation

**Navigation**
- `Tab`: Enter sidebar
- `Arrow Down/Up`: Navigate menu items
- `Enter/Space`: Activate menu item
- `Arrow Right`: Expand submenu
- `Arrow Left`: Collapse submenu
- `Escape`: Exit sidebar

**Focus Management**
- First item focused on entry
- Visual focus indicator
- Skip to content link

### Accessibility

**ARIA Attributes**
- `role="navigation"`
- `aria-label="Main navigation"`
- `aria-expanded` for submenus
- `aria-current="page"` for active item

**Screen Reader**
- Menu structure announced
- Current page indicated
- Submenu state communicated

### Recommended Material UI Components

- `Drawer` - Sidebar container
- `List` - Menu container
- `ListItem` - Menu items
- `ListItemIcon` - Menu icons
- `ListItemText` - Menu labels
- `Collapse` - Submenu expansion
- `Tooltip` - Collapsed tooltips

---

## Top Navigation

### Purpose

Provide quick access to global actions, search, notifications, and user profile while maintaining consistent branding and navigation across all pages.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]  RecoverFlow    [Search]  [Notif]  [Profile]  [Logout]  │
│  (48px)   (120px)       (200px)  (48px)   (48px)    (48px)     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

**Top Bar Container**
- `AppBar` (position="fixed", elevation=2)
  - `Toolbar` (disableGutters)
    - `IconButton` (Menu toggle - mobile only)
    - `Box` (Logo area)
      - `Typography` (Logo)
    - `Box` (flex=1, spacer)
    - `TextField` (Search - desktop)
    - `IconButton` (Search - mobile)
    - `IconButton` (Notifications)
      - `Badge` (Notification count)
    - `IconButton` (Profile)
    - `IconButton` (Logout)

### Element Specifications

**Logo Area**
- Width: 120px
- Height: 48px
- Logo: 32px height
- Text: Headline 5, weight 500
- Click: Navigate to dashboard

**Search Bar**
- Width: 200px (expandable to 400px)
- Height: 36px
- Placeholder: "Search..."
- Icon: Search (16px)
- Focus: Expand to 400px

**Notifications**
- Icon: 20px
- Badge: Top-right, 8px
- Badge color: Error 500
- Badge max: 99+
- Click: Open notification panel

**Profile**
- Avatar: 32px
- Click: Open profile menu
- Menu: Dropdown with options

### User Interactions

**Search**
- Click: Expand search bar
- Type: Real-time suggestions
- Enter: Submit search
- Escape: Collapse search

**Notifications**
- Click: Open notification panel
- Badge: Show unread count
- Mark read: On panel open

**Profile Menu**
- Click: Open dropdown
- Options: Profile, Settings, Logout
- Click outside: Close menu

### Responsive Behavior

**Desktop (> 960px)**
- Full search bar visible
- All icons visible
- Logo + text

**Tablet (600px - 960px)**
- Compact search bar
- All icons visible
- Logo + text

**Mobile (< 600px)**
- Search icon only (click to expand)
- Profile icon only
- Hamburger menu for sidebar
- Logo only (text hidden)

### Keyboard Navigation

**Tab Order**
1. Menu toggle (mobile)
2. Logo
3. Search input
4. Notifications button
5. Profile button
6. Logout button

**Shortcuts**
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + N`: Open notifications
- `Ctrl/Cmd + P`: Open profile

### Accessibility

**ARIA Labels**
- `aria-label="Search"`: Search button
- `aria-label="Notifications"`: Notification button
- `aria-label="User menu"`: Profile button
- `aria-expanded` for dropdowns

**Focus Management**
- Skip link before top bar
- Focus trap in dropdowns
- Clear focus indicators

### Recommended Material UI Components

- `AppBar` - Top bar container
- `Toolbar` - Toolbar layout
- `TextField` - Search input
- `IconButton` - Action buttons
- `Badge` - Notification badge
- `Avatar` - User avatar
- `Menu` - Dropdown menu

---

## Footer

### Purpose

Provide supplementary information, legal links, and quick access to support resources while maintaining a clean, unobtrusive presence at the bottom of the application.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  © 2026 RecoverFlow  |  Privacy  |  Terms  |  Help  |  Contact │
│                     (8px gaps)    (8px)     (8px)    (8px)     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

**Footer Container**
- `Box` (component="footer")
  - `Typography` (Copyright)
  - `Divider` (vertical)
  - `Link` (Privacy)
  - `Link` (Terms)
  - `Link` (Help)
  - `Link` (Contact)

### Element Specifications

**Container**
- Height: 48px
- Background: Gray 50
- Border-top: 1px solid Gray 200
- Padding: 0 24px
- Display: flex, align center

**Copyright**
- Text: "© 2026 RecoverFlow"
- Font: Caption, Gray 500
- Margin-right: 24px

**Links**
- Font: Caption, Gray 600
- Hover: Primary 500
- Gap: 16px

### User Interactions

**Link Interactions**
- Hover: Color change to Primary 500
- Click: Navigate to respective page
- External links: Open in new tab

### Responsive Behavior

**Desktop (> 960px)**
- Full width
- All links visible
- Horizontal layout

**Tablet (600px - 960px)**
- Full width
- All links visible
- Horizontal layout

**Mobile (< 600px)**
- Hidden or minimal
- Move to settings page
- Or use hamburger menu

### Keyboard Navigation

**Tab Order**
- Copyright (skip)
- Privacy link
- Terms link
- Help link
- Contact link

### Accessibility

**Landmark**
- `role="contentinfo"`

**ARIA Labels**
- `aria-label="Footer"`

**Screen Reader**
- Links properly labeled
- Copyright announced

### Recommended Material UI Components

- `Box` - Footer container
- `Typography` - Copyright text
- `Link` - Footer links
- `Divider` - Visual separation

---

## Breadcrumbs

### Purpose

Provide hierarchical navigation context, allowing users to understand their current location within the application and navigate back to parent levels easily.

### Layout Structure

```
Home > Dashboard > Cases > Case Details
 (icon) (link)   (link)     (current)
```

### Component Hierarchy

**Breadcrumbs Container**
- `Breadcrumbs` (MUI)
  - `Link` (Home - with icon)
  - `Link` (Dashboard)
  - `Link` (Cases)
  - `Typography` (Case Details - current)

### Element Specifications

**Container**
- Padding: 12px 0
- Max-width: Content container
- Font: Body 2, Gray 600

**Breadcrumb Items**
- Separator: "/" (default)
- Home icon: Home (16px)
- Links: Primary 500 on hover
- Current: Gray 800, not clickable

**Max Levels**
- Display: Maximum 4 levels
- Overflow: Truncate middle levels
- Example: Home > ... > Parent > Current

### User Interactions

**Navigation**
- Click any link: Navigate to that level
- Hover: Show full path if truncated
- Current page: Not clickable

### Responsive Behavior

**Desktop (> 960px)**
- Full path visible
- Horizontal layout

**Tablet (600px - 960px)**
- Full path visible
- Horizontal layout

**Mobile (< 600px)**
- Truncate to 2-3 levels
- Use "..." for middle levels
- Consider hiding on very small screens

### Keyboard Navigation

**Tab Order**
- Home link
- Parent links
- Current page (skip)

### Accessibility

**ARIA Attributes**
- `aria-label="Breadcrumb navigation"`
- `aria-current="page"` on current item

**Screen Reader**
- Full path announced
- "Breadcrumb" prefix
- Current page indicated

### Recommended Material UI Components

- `Breadcrumbs` - Breadcrumb container
- `Link` - Navigation links
- `Typography` - Current page
- `HomeIcon` - Home icon

---

## Global Search

### Purpose

Provide quick access to search across all application data, including customers, cases, payments, and users, with intelligent suggestions and keyboard navigation.

### Layout Structure

**Search Bar (Top Bar)**
```
┌─────────────────────────────────┐
│ 🔍 Search customers, cases...    │
└─────────────────────────────────┘
```

**Search Modal/Panel**
```
┌─────────────────────────────────────────┐
│ 🔍 Search customers, cases...    [×]    │
├─────────────────────────────────────────┤
│ Recent Searches                          │
│ • John Doe                              │
│ • Case #12345                           │
├─────────────────────────────────────────┤
│ Quick Actions                           │
│ • Add Customer                          │
│ • Create Case                           │
├─────────────────────────────────────────┤
│ Results                                 │
│ 📄 Customer: John Doe                   │
│ 📋 Case: #12345 - $5,000                │
│ 💰 Payment: $1,200 - Today              │
└─────────────────────────────────────────┘
```

### Component Hierarchy

**Search Modal**
- `Dialog` (fullScreen on mobile)
  - `AppBar` (search header)
    - `TextField` (search input)
    - `IconButton` (close)
  - `Box` (content)
    - `Typography` (Recent searches)
    - `List` (recent items)
    - `Divider`
    - `Typography` (Quick actions)
    - `List` (quick actions)
    - `Divider`
    - `Typography` (Results)
    - `List` (search results)

### Element Specifications

**Search Input**
- Placeholder: "Search customers, cases, payments..."
- Auto-focus: On modal open
- Debounce: 300ms
- Min characters: 2

**Search Results**
- Group by type (Customers, Cases, Payments)
- Show icon, title, subtitle
- Highlight matches
- Max results: 5 per category

**Keyboard Navigation**
- `Ctrl/Cmd + K`: Open search
- `Arrow Down/Up`: Navigate results
- `Enter`: Select result
- `Escape`: Close search

### User Interactions

**Search Bar**
- Click: Expand/open search modal
- Type: Show suggestions
- Enter: Submit search

**Search Modal**
- Type: Real-time results
- Click result: Navigate to item
- Click outside: Close modal

### Responsive Behavior

**Desktop (> 960px)**
- Modal: 600px width, centered
- Max-height: 80vh

**Tablet (600px - 960px)**
- Modal: 80% width, centered
- Max-height: 80vh

**Mobile (< 600px)**
- Full-screen modal
- Bottom sheet style
- Swipe to close

### Keyboard Navigation

**Shortcuts**
- `Ctrl/Cmd + K`: Open search
- `Escape`: Close search
- `Arrow Down/Up`: Navigate results
- `Enter`: Select result

**Focus Management**
- Auto-focus input on open
- Return focus on close
- Trap focus in modal

### Accessibility

**ARIA Attributes**
- `role="search"`
- `aria-label="Global search"`
- `aria-expanded` for modal state
- `aria-activedescendant` for results

**Screen Reader**
- Search purpose announced
- Result count announced
- Current result indicated

### Recommended Material UI Components

- `Dialog` - Search modal
- `TextField` - Search input
- `List` - Results container
- `ListItem` - Result items
- `ListItemIcon` - Result icons
- `Autocomplete` - Alternative approach

---

## Notification Panel

### Purpose

Provide a centralized location for users to view and manage system notifications, alerts, and updates without leaving their current context.

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Notifications              [Mark all read] │
├─────────────────────────────────────────┤
│ Today                                   │
│ ✓ Payment received: $1,200    [2m ago]  │
│ ⚠ Case assigned: #12345       [1h ago]  │
│                                         │
│ Yesterday                               │
│ ✓ Customer added: John Doe    [1d ago]  │
│ ℹ Report generated: Monthly   [1d ago]  │
│                                         │
│ Older                                   │
│ ✓ Case closed: #67890        [3d ago]  │
└─────────────────────────────────────────┘
```

### Component Hierarchy

**Notification Panel**
- `Popover` or `Drawer`
  - `Box` (header)
    - `Typography` (title)
    - `Button` (mark all read)
  - `Divider`
  - `Box` (content)
    - `Typography` (section headers)
    - `List` (notification items)
      - `ListItem`
        - `ListItemIcon` (notification icon)
        - `ListItemText` (message, time)
        - `IconButton` (mark read/delete)

### Element Specifications

**Container**
- Width: 380px
- Max-height: 500px
- Background: White
- Shadow: elevation 3
- Border radius: 8px

**Notification Item**
- Height: 64px
- Padding: 12px 16px
- Icon: 24px, colored by type
- Message: Body 2, Gray 800
- Time: Caption, Gray 500
- Unread: Primary 50 background

**Notification Types**
- Success: Green icon, Success 500
- Warning: Amber icon, Warning 500
- Error: Red icon, Error 500
- Info: Blue icon, Primary 500

### User Interactions

**Panel Interactions**
- Click notification icon: Open panel
- Click outside: Close panel
- Mark all read: Clear unread status
- Click notification: Navigate to related item

**Notification Actions**
- Mark read: Single notification
- Delete: Remove notification
- Click: Navigate to context

### Responsive Behavior

**Desktop (> 960px)**
- Position: Top-right dropdown
- Width: 380px
- Max-height: 500px

**Tablet (600px - 960px)**
- Position: Top-right dropdown
- Width: 320px
- Max-height: 400px

**Mobile (< 600px)**
- Full-screen drawer
- Slide from right
- Close button in header

### Keyboard Navigation

**Tab Order**
- Mark all read button
- Notification Mark read buttons
- Notification delete buttons

**Shortcuts**
- `Ctrl/Cmd + N`: Open notifications
- `Escape`: Close panel

### Accessibility

**ARIA Attributes**
- `role="alertdialog"`
- `aria-label="Notifications"`
- `aria-live="polite"` for new notifications
- `aria-unread` for unread items

**Screen Reader**
- Notification count announced
- New notifications announced
- Message content read

### Recommended Material UI Components

- `Popover` - Dropdown panel
- `Drawer` - Full-screen panel (mobile)
- `List` - Notification list
- `ListItem` - Notification items
- `ListItemIcon` - Notification icons
- `Badge` - Unread count
- `IconButton` - Action buttons

---

## Profile Menu

### Purpose

Provide quick access to user account settings, profile management, and application preferences from a centralized dropdown menu.

### Layout Structure

```
┌─────────────────────────────────┐
│  [Avatar] John Doe               │
│  john.doe@company.com            │
├─────────────────────────────────┤
│  👤 My Profile                   │
│  ⚙️ Settings                     │
│  🏢 Organization                 │
├─────────────────────────────────┤
│  🌙 Dark Mode                    │
│  🔔 Notifications               │
├─────────────────────────────────┤
│  ❓ Help & Support               │
│  📖 Documentation               │
├─────────────────────────────────┤
│  🚪 Logout                      │
└─────────────────────────────────┘
```

### Component Hierarchy

**Profile Menu**
- `Menu` (dropdown)
  - `Box` (header)
    - `Avatar` (user avatar)
    - `Typography` (user name)
    - `Typography` (user email)
  - `Divider`
  - `MenuItem` (My Profile)
  - `MenuItem` (Settings)
  - `MenuItem` (Organization)
  - `Divider`
  - `MenuItem` (Dark Mode - with switch)
  - `MenuItem` (Notifications - with switch)
  - `Divider`
  - `MenuItem` (Help & Support)
  - `MenuItem` (Documentation)
  - `Divider`
  - `MenuItem` (Logout - error color)

### Element Specifications

**Header**
- Padding: 16px
- Background: Gray 50
- Avatar: 48px
- Name: Body 1, weight 500
- Email: Caption, Gray 600

**Menu Items**
- Height: 48px
- Padding: 12px 16px
- Icon: 20px, Gray 600
- Text: Body 2, Gray 800
- Hover: Gray 100 background

**Logout**
- Text color: Error 500
- Icon color: Error 500
- Hover: Error 50 background

### User Interactions

**Menu Interactions**
- Click profile icon: Open menu
- Click outside: Close menu
- Click item: Navigate or toggle

**Toggle Items**
- Dark Mode: Switch toggle
- Notifications: Switch toggle
- State persisted

### Responsive Behavior

**Desktop (> 960px)**
- Position: Top-right dropdown
- Width: 280px

**Tablet (600px - 960px)**
- Position: Top-right dropdown
- Width: 260px

**Mobile (< 600px)**
- Full-screen drawer
- Slide from right
- Simplified menu

### Keyboard Navigation

**Tab Order**
- Profile items
- Settings items
- Toggle switches
- Logout button

**Shortcuts**
- `Ctrl/Cmd + P`: Open profile menu

### Accessibility

**ARIA Attributes**
- `role="menu"`
- `aria-label="User menu"`
- `aria-checked` for toggles
- `aria-haspopup="true"`

**Screen Reader**
- Menu structure announced
- Toggle state communicated
- Current user info read

### Recommended Material UI Components

- `Menu` - Dropdown menu
- `MenuItem` - Menu items
- `Avatar` - User avatar
- `Divider` - Section separators
- `Switch` - Toggle switches
- `ListItemIcon` - Menu icons

---

## Quick Action Menu

### Purpose

Provide rapid access to frequently used actions and commands, allowing users to perform common tasks without navigating to specific pages.

### Layout Structure

```
┌─────────────────────────────────┐
│  Quick Actions                  │
├─────────────────────────────────┤
│  ➕ Add Customer                 │
│  ➕ Create Case                  │
│  ➕ Record Payment               │
│  ➕ Schedule Recovery            │
│  ➕ Generate Report              │
├─────────────────────────────────┤
│  📊 View Dashboard               │
│  📋 My Cases                     │
│  💰 Recent Payments             │
└─────────────────────────────────┘
```

### Component Hierarchy

**Quick Action Menu**
- `SpeedDial` or `Menu`
  - `Fab` (trigger button)
  - `SpeedDialAction` (each action)
    - `Icon` (action icon)
    - `Tooltip` (action label)

### Element Specifications

**Trigger Button**
- Position: Bottom-right (desktop)
- Size: 56px
- Icon: Add (24px)
- Color: Primary 500
- Shadow: elevation 4

**Action Items**
- Icon: 24px
- Label: Tooltip on hover
- Color: Primary 500
- Hover: elevation 2

### Quick Actions

**Primary Actions**
- Add Customer
- Create Case
- Record Payment
- Schedule Recovery
- Generate Report

**Navigation Actions**
- View Dashboard
- My Cases
- Recent Payments
- Settings

### User Interactions

**Menu Interactions**
- Click FAB: Open action menu
- Click action: Execute action
- Click outside: Close menu
- Hover: Show tooltip

**Action Execution**
- Navigate: Go to page with form
- Modal: Open modal for action
- Direct: Execute immediately

### Responsive Behavior

**Desktop (> 960px)**
- Position: Bottom-right fixed
- Direction: Up
- Open on hover or click

**Tablet (600px - 960px)**
- Position: Bottom-right fixed
- Direction: Up
- Click to open

**Mobile (< 600px)**
- Position: Bottom-right fixed
- Direction: Up
- Click to open
- Larger touch target

### Keyboard Navigation

**Tab Order**
- FAB button
- Action items

**Shortcuts**
- `Ctrl/Cmd + A`: Open quick actions

### Accessibility

**ARIA Attributes**
- `aria-label="Quick actions"`
- `aria-expanded` for menu state
- `aria-haspopup="true"`

**Screen Reader**
- Menu purpose announced
- Action labels read
- Current focus indicated

### Recommended Material UI Components

- `SpeedDial` - Quick action menu
- `Fab` - Floating action button
- `SpeedDialAction` - Action items
- `Tooltip` - Action labels
- `Icon` - Action icons

---

## Floating Action Button (FAB)

### Purpose

Provide a prominent, always-accessible button for the primary action on a page, typically used for creating new items or initiating key workflows.

### Layout Structure

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│                    ┌─────────┐  │
│                    │    +    │  │
│                    └─────────┘  │
└─────────────────────────────────┘
```

### Component Hierarchy

**FAB Container**
- `Fab` (MUI)
  - `AddIcon` (or action icon)

### Element Specifications

**Standard FAB**
- Size: 56px
- Icon: 24px
- Color: Primary 500
- Shadow: elevation 4
- Position: Bottom-right, 16px margin

**Small FAB**
- Size: 40px
- Icon: 20px
- Color: Primary 500
- Shadow: elevation 3

**Extended FAB**
- Width: Auto
- Height: 48px
- Icon + Label
- Padding: 0 20px

### Usage Guidelines

**When to Use**
- Primary action on page
- Create new item
- Initiate key workflow
- Frequent action needed

**When NOT to Use**
- Destructive actions
- Rare actions
- Actions with complex forms
- Actions requiring confirmation

### User Interactions

**Button States**
- Default: elevation 4
- Hover: elevation 6
- Active: elevation 2
- Disabled: Gray 300, no shadow

**Click Behavior**
- Navigate: Go to create page
- Modal: Open creation modal
- Direct: Execute action

### Responsive Behavior

**Desktop (> 960px)**
- Position: Bottom-right fixed
- Size: 56px (standard)
- Margin: 24px

**Tablet (600px - 960px)**
- Position: Bottom-right fixed
- Size: 56px (standard)
- Margin: 16px

**Mobile (< 600px)**
- Position: Bottom-right fixed
- Size: 56px (standard)
- Margin: 16px
- Larger touch target

### Keyboard Navigation

**Tab Order**
- After main content
- Before footer

**Shortcuts**
- `Ctrl/Cmd + N`: New item (context-specific)

### Accessibility

**ARIA Attributes**
- `aria-label` describing action
- `role="button"`

**Screen Reader**
- Action purpose announced
- Button type indicated

### Recommended Material UI Components

- `Fab` - Floating action button
- `Fab` (extended) - Extended FAB with label
- `Icon` - Action icon

---

## Navigation Hierarchy

### Primary Navigation Structure

```
RecoverFlow
├── Authentication
│   ├── Login
│   ├── Register
│   └── Password Recovery
│
├── Dashboard
│   ├── Overview
│   ├── Statistics
│   └── Activity Feed
│
├── Tenants
│   ├── All Tenants
│   ├── Add Tenant
│   └── Tenant Settings
│
├── Users
│   ├── All Users
│   ├── Roles & Permissions
│   └── User Settings
│
├── Customers
│   ├── All Customers
│   ├── Add Customer
│   └── Customer Details
│       ├── Profile
│       ├── Debt History
│       └── Recovery Actions
│
├── Cases
│   ├── All Cases
│   ├── My Cases
│   ├── Add Case
│   └── Case Details
│       ├── Overview
│       ├── Timeline
│       ├── Recovery Actions
│       └── Payments
│
├── Recovery
│   ├── Recovery Actions
│   ├── Schedule
│   ├── Templates
│   └── Analytics
│
├── Payments
│   ├── All Payments
│   ├── Record Payment
│   ├── Payment History
│   └── Reconciliation
│
├── Reports
│   ├── Dashboard Reports
│   ├── Recovery Reports
│   ├── Payment Reports
│   ├── Case Reports
│   └── Custom Reports
│
├── AI Assistant
│   ├── Chat
│   ├── Insights
│   └── Automation
│
└── Settings
    ├── Profile
    ├── Organization
    ├── Security
    ├── Notifications
    └── Preferences
```

### Breadcrumb Patterns

**Level 1**: Dashboard
**Level 2**: Dashboard > Cases
**Level 3**: Dashboard > Cases > All Cases
**Level 4**: Dashboard > Cases > Case Details > #12345
**Level 5**: Dashboard > Cases > Case Details > #12345 > Timeline

### Navigation Flow

**Authentication Flow**
```
Login → Dashboard (authenticated)
Register → Login → Dashboard
Password Recovery → Login → Dashboard
```

**Case Management Flow**
```
Dashboard → Cases → All Cases → Case Details
Dashboard → Quick Action → Create Case → Case Details
```

**Customer Management Flow**
```
Dashboard → Customers → All Customers → Customer Details
Customer Details → Add Case → Case Details
```

**Payment Recording Flow**
```
Dashboard → Payments → Record Payment
Case Details → Payments → Record Payment
Quick Action → Record Payment
```

---

## Layout Diagrams

### Desktop Layout (> 1280px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo]  RecoverFlow    [Search]  [Notif]  [Profile]                      │ ← Top Bar (64px)
├──────────┬────────────────────────────────────────────────────────────────┤
│          │  Home > Dashboard > Cases > Case Details                       │ ← Breadcrumbs (48px)
│  Sidebar │  ┌──────────────────────────────────────────────────────────┐  │
│  (240px) │  │                                                          │  │
│          │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│  │
│  [Menu]  │  │  │ Stat 1   │  │ Stat 2   │  │ Stat 3   │  │ Stat 4   ││  │
│          │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│  │
│  • Dash  │  │                                                          │  │
│  board   │  │  ┌────────────────────────────────────────────────────┐  │  │
│  • Cases │  │  │                    Content                        │  │  │
│  • Recov │  │  │                                                    │  │  │
│  ery     │  │  │  [Data Table / Charts / Forms]                     │  │  │
│  • Paym  │  │  │                                                    │  │  │
│  ents    │  │  └────────────────────────────────────────────────────┘  │  │
│  • Repor │  │                                                          │  │
│  ts      │  │                                                          │  │
│  • AI    │  │                                                          │  │
│  • Setti │  │                                                          │  │
│  ngs     │  └──────────────────────────────────────────────────────────┘  │
├──────────┴────────────────────────────────────────────────────────────────┤
│  © 2026 RecoverFlow | Privacy | Terms | Help | Contact                  │ ← Footer (48px)
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (600px - 1280px)

```
┌─────────────────────────────────────────────────────────────────┐
│ [☰] [Logo]  RecoverFlow  [🔍] [🔔] [👤]                        │ ← Top Bar (64px)
├──────────┬──────────────────────────────────────────────────────┤
│          │  Home > Dashboard > Cases                            │ ← Breadcrumbs
│  Sidebar │  ┌────────────────────────────────────────────────┐  │
│  (240px) │  │                                                │  │
│          │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  [Menu]  │  │  │ Stat 1   │  │ Stat 2   │  │ Stat 3   │    │  │
│          │  │  └──────────┘  └──────────┘  └──────────┘    │  │
│  • Dash  │  │                                                │  │
│  board   │  │  [Content Area]                                │  │
│  • Cases │  │                                                │  │
│  • Recov │  │                                                │  │
│  ery     │  └────────────────────────────────────────────────┘  │
│  • Paym  │                                                      │
│  ents    │                                                      │
│  • Repor │                                                      │
│  ts      │                                                      │
│  • AI    │                                                      │
│  • Setti │                                                      │
│  ngs     │                                                      │
├──────────┴──────────────────────────────────────────────────────┤
│  © 2026 RecoverFlow | Privacy | Terms | Help                    │ ← Footer
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 600px)

```
┌─────────────────────────────────────┐
│ [☰] RecoverFlow  [🔔] [👤]        │ ← Top Bar (56px)
├─────────────────────────────────────┤
│ Home > Dashboard > Cases            │ ← Breadcrumbs
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Stat 1   │  │ Stat 2   │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Stat 3   │  │ Stat 4   │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  [Content Area]                    │
│                                     │
│  [Data Table / Forms]              │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [🏠] [📋] [💰] [⚙️] [➕]          │ ← Bottom Nav (56px)
└─────────────────────────────────────┘
```

### Login Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   [Logo/Brand]                           │
│                  RecoverFlow                             │
│            Debt Recovery Management                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                 │  │
│  │              [Authentication Form]               │  │
│  │                                                 │  │
│  │  Email: [____________________]                  │  │
│  │  Password: [____________________]               │  │
│  │                                                 │  │
│  │  [        Login Button        ]                 │  │
│  │                                                 │  │
│  │  Forgot password? | Create account              │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│              © 2026 RecoverFlow                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Notes

### Layout Switching Logic

**Route-based Layout**
```typescript
// Route configuration
const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      { path: '', component: LoginPage }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'cases', component: CasesPage }
    ]
  }
]
```

**Layout State Management**
- Current layout in Redux store
- Layout transition animations
- State persistence on refresh

### Responsive Implementation

**Breakpoint Detection**
```typescript
const useBreakpoint = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  return { isMobile, isTablet, isDesktop }
}
```

**Conditional Rendering**
- Sidebar: Desktop only
- Bottom nav: Mobile only
- Search bar: Full on desktop, icon on mobile

### Performance Optimization

**Lazy Loading**
- Route-based code splitting
- Component lazy loading
- Image lazy loading

**Virtual Scrolling**
- Long lists (tables, notifications)
- Large data sets
- Optimized rendering

---

## Version History

**v1.0.0** - June 30, 2026
- Initial layout architecture
- Complete specification
- Responsive design
- Accessibility compliance
