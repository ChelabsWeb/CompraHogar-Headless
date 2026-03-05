---
name: ui-consistency-check
description: Enforces UI consistency across the project. Use this skill whenever you are making UI changes, creating new pages, or adding frontend components to ensure they align with the project's design system.
---

# UI Consistency Check

This skill ensures that all UI development within the project adheres to the established design system and utilizes existing components.

## Core Rules

1. **Use Existing Components First**
   Whenever you need to build a UI feature, always look in `src/components/ui/` first. You must use these existing primitive components (e.g., buttons, inputs, dialogs, typography elements) rather than creating new ones from scratch or using raw HTML elements when a component equivalent exists.

2. **Validate Against the UI Test Page**
   Whenever you add or modify a UI element/page, you MUST verify its visual consistency by referencing `src/app/ui-test/page.tsx`. This page serves as the source of truth for the project's design system, styling patterns, spacing, colors, and component usage.
   - Check how similar components are composed on the `ui-test` page.
   - Ensure your new UI matches the aesthetic and standard practices demonstrated there.
   - If you create a fundamentally new primitive UI component that belongs in the design system, consider adding an example of it to `src/app/ui-test/page.tsx` so future work can reference it.

## Applying this Skill

When executing tasks related to frontend UI:
- **Search:** Use `list_dir` on `src/components/ui` to see available components.
- **Reference:** Use `view_file` on `src/app/ui-test/page.tsx` to understand the standard layout patterns, class names (Tailwind), and component API usages.
- **Implement:** Write your UI code using the exact patterns discovered.

Do NOT deviate from the visual identity established in the `ui-test` page.
