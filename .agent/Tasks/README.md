# Tasks Directory

This directory tracks all project tasks using a PRD-driven, hierarchical task management system.

---

## File Purposes

### `planned.md` - Sprint Planning
**Purpose**: Tasks extracted from PRD and numbered for upcoming work
**Source**: PRD.md (Product Requirements Document)
**Format**: Hierarchical numbering (1, 1.1, 1.2, 2, 2.1...)

**When to update**:
- During sprint planning when extracting tasks from PRD
- When accepting tasks from backlog into sprint
- When task priorities change

---

### `active.md` - Current Work
**Purpose**: Track progress on task currently being worked on
**Format**: Detailed subtask progress with status emojis (✅ 🚧 ⏸️)

**When to update**:
- When starting a new subtask (move from planned → active)
- When completing a subtask (mark ✅, add completion time)
- Throughout the day as progress is made
- When discovering technical decisions or challenges

---

### `blocked.md` - Blockers
**Purpose**: Document tasks blocked with resolution plans
**Format**: Blocker description + impact + resolution steps

**When to update**:
- When a task becomes blocked (immediately)
- When blocker is resolved (remove from this file)
- When resolution plan changes

---

### `completed/[YYYY-MM]/[N]-[name].md` - Historical Record
**Purpose**: Detailed completion record for major task
**Format**: Full breakdown by subtask with decisions and challenges

**When to create**:
- After completing ALL subtasks in major task (all [N.x] complete)
- Just before git commit (completion record includes commit hash)

---

### `backlog.md` - Future Ideas
**Purpose**: Ideas and enhancements not yet accepted into sprint
**Format**: Unstructured notes, possible future tasks

**When to update**:
- When brainstorming future enhancements
- When identifying technical debt
- When deferring non-critical work

---

### `Implementation/` - Sub-Agent Plans
**Purpose**: Research outputs from specialized sub-agents
**Format**: Context files and implementation plans from sub-agents

**When created**:
- By n8n-workflow-researcher sub-agent (workflow plans)
- By supabase-schema-expert sub-agent (schema plans)

---

## Task Numbering Convention

### Major Tasks (Integers)
- Format: `1`, `2`, `3`, `4`...
- **Never reset** - continues incrementing forever
- Represents a complete feature or major enhancement
- Derived directly from PRD sections

### Subtasks (Decimals)
- Format: `1.1`, `1.2`, `1.3`...
- Can nest deeper: `1.2.1`, `1.2.2`, `1.2.3`...
- No limit on nesting depth (use as needed)
- Represents logical breakdown of major task

### Examples

**Simple feature:**
```
1. Photo Upload Feature
   1.1 Database schema
   1.2 Storage setup
   1.3 Workflow integration
   1.4 Dashboard display
```

**Complex feature with nesting:**
```
2. User Authentication System
   2.1 Database design
       2.1.1 Create users table
       2.1.2 Create sessions table
       2.1.3 Add indexes
   2.2 Backend API
       2.2.1 Register endpoint
       2.2.2 Login endpoint
       2.2.3 Logout endpoint
   2.3 Frontend UI
       2.3.1 Login form
       2.3.2 Register form
       2.3.3 Session management
```

---

## Git Commit Workflow

### When to Commit
**Only after completing ALL subtasks in major task**

Example workflow:
- Complete 1.1 → Update active.md (no commit)
- Complete 1.2 → Update active.md (no commit)
- Complete 1.3 → Update active.md (no commit)
- Complete 1.4 → Create completion record → **Git commit**

### Commit Message Format
```
[N] Brief feature description

✓ N.1 Subtask description
✓ N.2 Subtask description
✓ N.3 Subtask description

Detailed changes:
- Changed X to do Y
- Added feature Z
- Fixed issue W

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Completion Workflow
1. Complete final subtask in major task
2. Create completion record in `completed/[YYYY-MM]/[N]-[name].md`
3. Git commit with `[N]` prefix
4. Add git commit hash to completion record
5. Move to next task in planned.md

---

## Task State Transitions

```
PRD → planned.md → active.md → completed/[date]/[N]-[name].md
                        ↓
                   blocked.md (temporary, stays in active too)
```

### Detailed Workflow

**1. Sprint Planning (PRD → planned.md)**
- Read PRD section by section
- Extract features/enhancements
- Assign task numbers (1, 2, 3...)
- Break into subtasks (1.1, 1.2...)
- Add acceptance criteria

**2. Start Work (planned.md → active.md)**
- Copy task from planned.md
- Mark as "IN PROGRESS"
- Add start timestamp
- Update active.md as you work on each subtask

**3. If Blocked (active.md → blocked.md)**
- Task stays in active.md
- Also add to blocked.md with resolution plan
- When unblocked, remove from blocked.md

**4. Complete Task (active.md → completed/)**
- After ALL subtasks done
- Create detailed completion record
- Git commit with [N] prefix
- Archive to completed/[YYYY-MM]/

**5. Next Task**
- Increment to next number (N+1)
- Repeat workflow

---

## Examples & Templates

See template files for detailed format examples:
- **planned.md** - Task planning format with hierarchical numbering
- **active.md** - Progress tracking with subtask status emojis
- **blocked.md** - Blocker documentation with resolution plans
- **completed/task-completion-template.md** - Detailed completion record format

Each template includes:
- Clear structure with placeholders
- Real-world examples (Photo Upload Feature)
- Helpful notes explaining when to use each section

---

## PRD Requirement

**All tasks MUST originate from PRD.md** (Product Requirements Document):
- Located at project root: `Projects/[Name]/PRD.md`
- Tasks reference specific PRD sections
- No ad-hoc tasks without PRD justification

**If PRD.md doesn't exist:**
- Claude will prompt to create a template
- Task creation blocked until PRD exists

---

## Backward Compatibility

**Projects with old `current-sprint.md` system:**
- Still fully supported by skills
- No forced migration
- Can coexist with new system during transition

**Migration guide:** See `docs/migration-current-sprint-to-task-system.md`

---

## Quick Reference

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `planned.md` | Tasks from PRD | During sprint planning |
| `active.md` | Current progress | Throughout work session |
| `blocked.md` | Blockers | When blocked/unblocked |
| `completed/` | Historical record | After major task complete |
| `backlog.md` | Future ideas | As ideas emerge |
| `Implementation/` | Sub-agent plans | When using sub-agents |

**Task numbering:** Continuous (1, 2, 3... never resets)
**Git commits:** Only after completing all subtasks in major task
**PRD-driven:** All tasks must reference PRD sections
