---
name: gemini-prompt-enhancer
description: Applies when the user asks you to perform a task for Gemini 3.1 Pro or requests a prompt for Gemini 3.1 Pro. This skill converts a simple request into a highly detailed, optimized prompt.
---
# Gemini 3.1 Pro Prompt Enhancer

This skill is triggered when the user asks you to create a prompt or perform a task specifically mentioning "Gemini 3.1 Pro" (or similar variations). Before providing the final answer or executing the task directly, your goal is to transform their initial request into a "perfect," well-developed prompt designed to elicit the best possible response from Gemini 3.1 Pro.

## Objective
Convert a basic user request into a comprehensive, high-quality prompt tailored for Gemini 3.1 Pro's capabilities.

## Framework for a Perfect Gemini 3.1 Pro Prompt

When rewriting the prompt, ensure it includes the following elements:

1.  **Role/Persona:** Define the expert persona Gemini should adopt (e.g., "Act as a Senior Next.js Developer," "Act as an Expert Copywriter").
2.  **Context & Background:** Provide all necessary context. What is the overarching project? What is the goal? What information does Gemini need to know beforehand?
3.  **Specific Task/Objective:** Clearly state exactly what needs to be done. Use action verbs.
4.  **Constraints & Guidelines:**
    -   Programming languages or frameworks to use.
    -   Tone of voice (professional, friendly, technical).
    -   Things to *avoid* doing.
5.  **Chain of Thought (Reasoning):** Instruct the model to think step-by-step or plan before generating the final output. (e.g., "First, analyze the problem. Second, outline your approach. Third, provide the solution.")
6.  **Expected Output Format:** Detail exactly how the response should look (e.g., "Provide the answer in a markdown table," "Output only valid JSON," "Write a 5-paragraph essay").

## Execution Steps

When a user asks you to apply this skill:

1.  **Analyze the User's Request:** Identify the core goal, any implicit constraints, and the domain of the request.
2.  **Draft the Enhanced Prompt:** Write out the comprehensive prompt using the framework above.
3.  **Present the Result:** Show the user the enhanced prompt clearly, formatting it inside a markdown block for easy copying. You can also offer to execute the prompt yourself if that aligns with the user's intent.

### Example Transformation

*User Request:* "Write a script to backup a database for gemini 3.1 pro."

*Enhanced Prompt Output:*
```text
**Role:** Act as a Senior DevOps Engineer with expertise in database administration and automated backup systems.

**Context:** We need a robust shell script to automate the daily backup of a PostgreSQL database on a Linux server. The backups need to be compressed and old backups must be pruned to save disk space.

**Task:** Write a bash script that performs a `pg_dump` of a specified PostgreSQL database, compresses the output using `gzip`, saves it to a designated backup directory, and deletes any backup files older than 7 days.

**Guidelines:**
- Use standard bash scripting best practices (e.g., set -e, error handling).
- Include clear comments explaining each step.
- Use variables for database name, user, backup directory, and retention days at the top of the script.
- Ensure the script logs its start time, success/failure status, and end time.

**Expected Output:**
Provide the complete, commented bash script inside a markdown code block. Below the script, provide brief instructions on how to schedule this script using cron.
```
