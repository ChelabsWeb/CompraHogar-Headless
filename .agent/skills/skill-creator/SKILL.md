---
name: skill-creator
description: Helps you create new skills correctly for the Antigravity agent. Use this skill when the user asks you to create a new skill or modify an existing skill.
---
# Skill Creator

This skill guides you through the process of creating or modifying skills for the Antigravity agent.

## What is a Skill?
Skills are reusable packages of knowledge that extend an agent's capabilities. They consist of a folder containing a `SKILL.md` file with instructions, best practices, and optional scripts or resources.

## Where to Create Skills
You can create skills in two locations:
1. **Workspace-specific:** `<workspace-root>/.agent/skills/<skill-folder>/` (preferred for project-specific skills)
2. **Global:** `~/.gemini/antigravity/skills/<skill-folder>/` (preferred for general, cross-project skills)

## Skill Structure
To create a skill, perform the following steps:
1. Create a new directory named after the skill (format: lowercase, hyphens for spaces e.g. `my-awesome-skill`) inside the chosen location.
2. Create a `SKILL.md` file inside that new directory.

The `SKILL.md` file **MUST** start with YAML frontmatter containing the skill's name and description:

```yaml
---
name: your-skill-name
description: A clear description of what the skill does and when to use it, ideally written in the third person. This description is how the agent decides whether to apply the skill.
---
```

### Optional Subdirectories
You can enhance your skill folder with additional directories if necessary:
- `scripts/`: Helper scripts used by the skill.
- `examples/`: Reference implementations and usage patterns.
- `resources/`: Additional files, templates, or assets.

## Best Practices
- **Focus:** Each skill should handle one specific task or context.
- **Clarity:** Use highly descriptive `description` fields to help the agent decide when to apply the skill.
- **Black Box Scripts:** If you provide scripts, configure them to be used with `--help` rather than requiring the agent to read their source code.
- **Decision Trees:** Provide clear logic to help the agent choose the best approach when executing complex tasks.
