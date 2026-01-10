# Implementation Plans & Context Files

**Purpose**: This directory stores detailed implementation plans created by sub-agents during the research phase.

---

## 📂 What Goes Here

### Context Files
Shared context files that synchronize information across parent and sub-agents:

- `context-session-YYYY-MM-DD.md` - Overall project context for a work session
- `context-current.md` - Ongoing context file (alternative naming)

**Purpose**: Ensures all agents (parent and sub-agents) stay synchronized on project state, decisions, and progress.

### Implementation Plans
Detailed plans created by specialized sub-agents after research:

- `[feature-name]-plan.md` - Sub-agent research output
- Examples:
  - `ui-design-plan.md` - Frontend design implementation plan
  - `telegram-webhook-plan.md` - Webhook integration plan
  - `supabase-migration-plan.md` - Database migration plan
  - `n8n-workflow-plan.md` - Workflow implementation plan

**Purpose**: Sub-agents research best practices, document patterns, and create detailed plans. Parent agent reads these plans before implementing code.

---

## 🔄 Sub-Agent Workflow

### How This Directory Fits Into Development

**1. Parent Agent Creates Context File**
```markdown
# Project: [Feature Name]
# Session: 2025-10-25
# Goal: Implement user authentication system

## Current State
- Supabase project setup complete
- Frontend scaffolding in place
- Need to design auth flow and UI

## Requirements
- Email/password authentication
- Social login (Google, GitHub)
- Password reset flow
- Session management
```

**2. Parent Delegates Research to Sub-Agent**
Parent agent uses Task tool to delegate specialized research:
- "Research Supabase auth best practices and create implementation plan"
- Sub-agent reads `context-session-2025-10-25.md` for project context

**3. Sub-Agent Conducts Research**
Sub-agent uses specialized tools and documentation:
- Reads Supabase MCP tools and documentation
- Reviews authentication patterns
- Identifies required components and flow
- Creates detailed implementation plan

**4. Sub-Agent Saves Plan to Implementation/**
Sub-agent writes detailed plan to `Implementation/supabase-auth-plan.md`:
- Component architecture
- Database schema requirements
- API endpoints needed
- Frontend UI structure
- Security considerations
- Step-by-step implementation guide

**5. Sub-Agent Updates Context File**
Sub-agent updates `context-session-2025-10-25.md`:
- Marks research phase complete
- Notes key decisions made
- Points to implementation plan location

**6. Parent Agent Implements**
Parent agent:
- Reads `Implementation/supabase-auth-plan.md`
- Understands full context and best practices
- Implements code following the plan
- Has all research context without token overhead

---

## 📋 File Naming Conventions

### Context Files
**Format**: `context-session-YYYY-MM-DD.md` OR `context-current.md`

**When to use dated format**:
- Multi-session projects
- Complex features spanning multiple days
- When you want to preserve historical context

**When to use current format**:
- Single ongoing context file
- Simpler projects
- Context that updates continuously

### Implementation Plans
**Format**: `[feature-name]-plan.md`

**Naming guidelines**:
- Use kebab-case (hyphens, not underscores)
- Be specific but concise
- Include integration point if relevant

**Examples**:
- `telegram-bot-architecture-plan.md`
- `photo-upload-flow-plan.md`
- `ai-content-generation-plan.md`
- `database-migration-strategy-plan.md`

### Completed Plans
**Option 1**: Keep in place (shows project history)
**Option 2**: Add `[COMPLETED]` prefix: `[COMPLETED]-photo-upload-plan.md`
**Option 3**: Move to `Implementation/Archive/` (create if needed)

---

## 🎯 Implementation/ vs Root Tasks/

### Root Tasks/ Directory
**Purpose**: Task tracking and work management

**Contains**:
- `current-sprint.md` - Active work items with checkboxes
- `backlog.md` - Future features and ideas
- `product-requirements.md` - High-level PRD

**Content type**: What needs to be done, when, by whom, status tracking

### Implementation/ Subdirectory
**Purpose**: Detailed implementation guidance

**Contains**:
- `context-session-X.md` - Shared context for agents
- `[feature]-plan.md` - Detailed implementation plans from sub-agents

**Content type**: How to implement features, architecture decisions, technical details

---

## 💡 Benefits of This Structure

### 1. Token Efficiency
- Sub-agent does research (reads many files, docs, examples)
- Research happens in sub-agent session (doesn't pollute parent context)
- Parent only sees summary and final plan (90%+ token reduction)
- Parent maintains clean context for implementation

### 2. Specialized Expertise
- Sub-agents carry extensive documentation in system prompts
- On-demand expertise without loading all docs into parent context
- Multiple specialized sub-agents for different domains

### 3. Context Preservation
- Context files ensure all agents stay synchronized
- Implementation plans persist beyond sessions
- Any agent can reference findings later
- Historical context preserved for future work

### 4. Clear Separation of Concerns
- Sub-agents: Research, analyze, plan
- Parent agent: Implement, debug, iterate
- User: Review, approve, guide

---

## 🚫 What NOT to Put Here

**Don't put these in Implementation/**:
- Actual code files (those go in project source directories)
- Task tracking with checkboxes (use `current-sprint.md` in root Tasks/)
- Future feature ideas (use `backlog.md` in root Tasks/)
- Technical documentation about current state (use `System/` directory)
- Standard operating procedures (use `SOPs/` directory)

**Why**: Implementation/ is specifically for research outputs and context files that guide implementation, not for tracking work or documenting existing code.

---

## 📝 Template Information

**Template Version**: 1.0
**Created**: 2025-10-25
**Source**: Sub-agent best practices from Jason's AI Builder Club

**Related Documentation**:
- Root CLAUDE.md: Sub-agent workflow section
- Research notes: `Research/claude-code-subagent-best-practices.md`
- n8n sub-agent guide: `docs/n8n-workflow-guide.md`

---

## 🔗 Example Sub-Agents

Your AI_Automation workspace can use specialized sub-agents that output to this directory:

- **n8n Workflow Researcher** - Creates workflow implementation plans
- **Supabase Expert** - Database schema and integration plans
- **UI Design Expert** - Frontend design and component plans
- **Telegram Bot Expert** - Bot architecture and flow plans
- **API Integration Expert** - External API integration plans

Each sub-agent reads context files and writes implementation plans here.

---

**🎯 Remember**: Sub-agents research and plan. Parent agent implements. This directory is the handoff point between research and implementation phases.
