---
name: ui-system-generator
description: Use this skill when the user asks you to build or assemble a UI system from scratch, create a comprehensive set of UI components (at least 30) for a project, or replicate the "ui-test" component showcase pattern.
---
# UI System Generator

This skill guides you through the process of scaffolding a complete, robust, and consistent UI component system for a project, requiring the creation of at least 30 standard UI components and a comprehensive test page (`ui-test`).

## Objective
To build a premium, highly reusable UI library (similar to Shadcn UI or advanced custom systems) from scratch. This involves creating base components using Tailwind CSS and building a dedicated showcase page (`/ui-test`) to display all components, their variants, and states.

## Minimum 30 Components Required
You **MUST** create a minimum of 30 distinct UI components. Here is the mandatory checklist to ensure you reach the target:

### Core Elements (1-10)
1. **Button** (variants: default, secondary, outline, ghost, destructive, link; sizes: sm, default, lg, icon)
2. **Input** (with icons, error states, disabled states)
3. **Textarea** 
4. **Select** (Trigger, Content, Item, Value)
5. **Checkbox**
6. **Radio / Radio Group**
7. **Switch / Toggle**
8. **Label** (Accessible form labels)
9. **Badge / Tag** (variants: default, secondary, outline, destructive, success, warning)
10. **Separator / Divider**

### Navigation & Layout (11-20)
11. **Breadcrumbs**
12. **Pagination** (Content, Item, Link, Previous, Next, Ellipsis)
13. **Tabs** (List, Trigger, Content)
14. **Card** (Header, Title, Content, Footer)
15. **Accordion / Collapsible** 
16. **Dropdown Menu**
17. **Menubar / Navigation Menu**
18. **Container** (Max-width wrappers)
19. **Scroll Area**
20. **Carousel / Image Slider**

### Feedback & Overlays (21-30+)
21. **Modal / Dialog**
22. **Drawer / Sheet** (Slide-over panels)
23. **Toast / Notification System** (Provider, Viewport, Toast Action)
24. **Alert** (variants: success, warning, info, error)
25. **Tooltip** (Provider, Trigger, Content)
26. **Popover**
27. **Hover Card**
28. **Skeleton / Loading State**
29. **Progress Bar**
30. **Spinner / Loader**
31. *(Bonus)* **SearchBar** (with debouncing capabilities)
32. *(Bonus)* **QuantitySelector** (Stepper with min/max)
33. *(Bonus)* **Avatar** (Image fallback, initials)

## Execution Steps

### 1. Foundation & Theming
- Verify or configure Tailwind CSS in the environment.
- Establish the design language (colors, typography, border radius, standard shadows) in a global CSS file or Tailwind config.

### 2. Scaffold Components (`src/components/ui/`)
- Create each of the 30+ components in individual files.
- Ensure they expose a flexible API (forwarding refs, accepting `className` via `tailwind-merge` and `clsx`).
- Support multiple visual variants using `class-variance-authority` (cva) or similar patterns.
- Ensure full accessibility (ARIA, focus-visible states, keyboard interaction).

### 3. Build the Showcase Page (`src/app/ui-test/page.tsx`)
- Create a dedicated route for testing the system.
- Import and render **every single component** created.
- Group components logically using sections (e.g., "Inputs", "Feedback", "Navigation").
- Showcase all states: default, hover, active, disabled, error, loading.
- Replicate the exact pattern of providing a clear, scannable catalog of the project's UI capabilities.

## Best Practices
- **Premium Aesthetics**: Never use generic or unpolished styles. Ensure sophisticated shadows, subtle borders, and smooth micro-animations.
- **Consistency**: Maintain exact consistency across focus rings (`ring-2 ring-primary ring-offset-2`), rounding, and border colors.
- **Self-Contained**: Components should bring their own icons (e.g., `lucide-react`) when necessary (like error alerts or dropdown carets).
