# Project Context - [Feature Name]

**Session**: [YYYY-MM-DD] or [Session Number]
**Goal**: [Brief description of what we're trying to accomplish]
**Status**: [Planning / Research / Implementation / Testing / Complete]

---

## 📋 Project Overview

**Feature**: [Name of feature being implemented]

**Purpose**: [Why are we building this? What problem does it solve?]

**User Story**: [As a [user type], I want [goal], so that [benefit]]

---

## 🎯 Current State

### What We Have
- [Existing component/system 1]
- [Existing component/system 2]
- [Relevant technical infrastructure]

### What We Need
- [Required component 1]
- [Required component 2]
- [Integration points needed]

### Known Constraints
- [Technical limitation 1]
- [Time/resource constraint 2]
- [External dependency 3]

---

## 📊 Technical Context

### Tech Stack
- **Frontend**: [Framework/library]
- **Backend**: [Platform/service]
- **Database**: [Database type and project ID]
- **APIs/Integrations**: [External services]

### Database Schema (if relevant)
```sql
-- Current relevant tables
-- (Brief overview, link to System/database-schema.md for details)
```

### File Structure (if relevant)
```
project/
├── src/
│   ├── components/   # Where new UI goes
│   └── api/          # Where new endpoints go
```

---

## 🔍 Research Questions

Questions to be answered by sub-agent research:

1. **[Question 1]**: [Why we need to know this]
2. **[Question 2]**: [How this affects implementation]
3. **[Question 3]**: [What decision depends on this]

---

## 📝 Requirements

### Functional Requirements
- [ ] Requirement 1 - [Description]
- [ ] Requirement 2 - [Description]
- [ ] Requirement 3 - [Description]

### Non-Functional Requirements
- **Performance**: [Target metrics]
- **Security**: [Security considerations]
- **Scalability**: [Expected load/growth]
- **Accessibility**: [A11y requirements]

---

## 🎨 Design Considerations

### User Experience
- [Key UX flow or pattern]
- [Important interaction details]

### Visual Design (if applicable)
- [Design system or component library]
- [Color palette or theme]
- [Layout patterns]

---

## 🔗 Integration Points

### External Services
- **[Service 1]**: [What it does, why we need it]
- **[Service 2]**: [Integration approach]

### Internal Systems
- **[System 1]**: [How we connect to it]
- **[System 2]**: [What data we exchange]

---

## 📅 Timeline & Milestones

**Start Date**: [YYYY-MM-DD]
**Target Completion**: [YYYY-MM-DD]

**Milestones**:
- [ ] Research complete - Implementation plan created
- [ ] Core functionality implemented
- [ ] Testing complete
- [ ] Documentation updated
- [ ] Deployed to production

---

## 🚀 Implementation Plan Status

### Research Phase
- [ ] Sub-agent research assigned
- [ ] Implementation plan created at: [File path]
- [ ] Parent agent reviewed plan
- [ ] Implementation approach approved

### Implementation Phase
- [ ] Core implementation started
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Documentation updated

### Completion
- [ ] Feature deployed
- [ ] Context file archived
- [ ] System/ docs updated

---

## 💭 Decisions & Notes

### Key Decisions Made
**Decision 1**: [What was decided]
- **Rationale**: [Why this approach]
- **Alternatives considered**: [Other options]
- **Date**: [YYYY-MM-DD]

**Decision 2**: [What was decided]
- **Rationale**: [Why this approach]
- **Date**: [YYYY-MM-DD]

### Research Findings
- [Important finding from sub-agent research]
- [Pattern or best practice identified]
- [Risk or consideration discovered]

### Implementation Notes
- [Useful insight discovered during coding]
- [Gotcha or edge case handled]
- [Future improvement identified]

---

## 🔄 Sub-Agent Coordination

### Sub-Agents Involved
- **[Sub-agent name]**: [What they researched]
  - Output: [Link to implementation plan]
  - Status: [Complete / In Progress]

### Files Generated
- Implementation plans in `.agent/Tasks/Implementation/`:
  - [feature-name]-plan.md

---

## 🎓 Lessons Learned

### What Worked Well
- [Success 1]
- [Success 2]

### What Could Be Improved
- [Area for improvement 1]
- [Area for improvement 2]

### Future Considerations
- [Technical debt identified]
- [Future enhancement idea]

---

## 🔗 Related Documentation

**In this project**:
- Implementation plans: `.agent/Tasks/Implementation/[feature]-plan.md`
- Current sprint: `.agent/Tasks/current-sprint.md`
- Tech stack: `.agent/System/tech-stack.md`

**Workspace guides**:
- Root CLAUDE.md: `/home/cpbjr/Documents/AI_Automation/CLAUDE.md`
- Sub-agent guide: `Research/claude-code-subagent-best-practices.md`

---

## 📝 Template Usage Instructions

**When to create**:
- At the start of implementing a new feature
- Before delegating research to sub-agents
- When multiple work sessions expected

**How to use**:
1. Copy this template to your project's `.agent/Tasks/Implementation/`
2. Rename: `context-session-YYYY-MM-DD.md` or `context-[feature-name].md`
3. Fill in [bracketed sections] with actual project details
4. Update throughout implementation as decisions are made
5. Sub-agents read this file before starting research
6. Parent agent updates after implementation steps
7. Archive or mark complete when feature is deployed

**Template Version**: 1.0
**Created**: 2025-10-25
