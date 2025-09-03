---
description: Prohibits running the development server command to prevent resource conflicts and maintain system stability
author: System Administrator
version: 1.1
tags: ["behavioral", "development", "resource-management", "system-stability"]
globs: ["**/*.md", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
---

# Development Server Restriction Rule

## 🚨 CRITICAL INSTRUCTION FOR AI LANGUAGE MODELS 🚨

**NEVER execute the development server command in any form.**

## Prohibited Commands

### ❌ NEVER RUN THESE COMMANDS

```bash
# Primary prohibition
pnpm run dev
pnpm dev

# Alternative forms that are also prohibited
npm run dev
npm dev
yarn dev
yarn run dev
next dev
npx next dev

# With any flags or options
pnpm run dev --turbopack
pnpm run dev --port 3000
pnpm run dev --experimental-https
```

## Rationale

### System Resource Management
- **Port Conflicts**: Development servers bind to specific ports (typically 3000, 3001, etc.)
- **Memory Usage**: Dev servers consume significant system resources
- **Process Management**: Long-running processes can interfere with other operations
- **File Watching**: Development servers monitor file changes, creating system overhead

### Workflow Integrity
- **User Control**: The user should control when and how the development server runs
- **Environment Isolation**: Prevents conflicts with existing development sessions
- **Testing Focus**: Maintains focus on testing and building rather than serving
- **Resource Allocation**: Preserves system resources for other development tasks

### Security Considerations
- **Network Exposure**: Development servers may expose local network interfaces
- **Hot Reload**: File watching and hot reload can interfere with file operations
- **Process Persistence**: Dev servers continue running beyond the current session

## Permitted Development Operations

### ✅ ALLOWED COMMANDS

```bash
# Building and testing
pnpm build
pnpm test
pnpm test:watch
pnpm lint

# Package management
pnpm install
pnpm add [package]
pnpm remove [package]

# Code generation and utilities
pnpm generate
pnpm format
pnpm type-check

# Static analysis
pnpm analyze
pnpm audit
```

## Alternative Approaches

### For Development Verification
Instead of running the dev server, use these approaches:

1. **Build Verification**
   ```bash
   pnpm build
   ```

2. **Test Execution**
   ```bash
   pnpm test
   pnpm test:watch
   ```

3. **Static Analysis**
   ```bash
   pnpm lint
   pnpm type-check
   ```

### For User Guidance
When the user needs to run the development server:

1. **Inform the user** that they should run the command manually
2. **Provide the exact command** they need to execute
3. **Explain the benefits** of manual execution (control, resource management)

## Exception Handling

### No Exceptions
This rule has **NO EXCEPTIONS**. Under no circumstances should the development server be started programmatically.

### User Override
If a user explicitly requests running the dev server:
1. **Explain this rule** and its rationale
2. **Suggest alternatives** (build, test, lint)
3. **Provide the command** for them to run manually
4. **Do not execute** the command yourself

## Implementation Guidelines

### AI Model Verification Steps

Before executing any command, verify:

```xml
<thinking>
1. Does this command start a development server?
2. Does this command include 'dev' as a script name?
3. Will this command bind to a network port?
4. Will this command start a long-running process?
5. Is there an alternative approach that doesn't require the dev server?
</thinking>
```

### Command Pattern Recognition

Watch for these patterns and **NEVER EXECUTE**:
- `*run dev*`
- `*dev*` (when used as a script)
- `next dev`
- Any command that starts a development server

### Safe Alternatives

Always prefer these patterns:
- `*build*` for production verification
- `*test*` for functionality verification
- `*lint*` for code quality verification
- `*type-check*` for TypeScript verification

## Error Recovery

If accidentally prompted to run a dev server:

1. **Immediately refuse** to execute the command
2. **Explain this rule** to the user
3. **Suggest alternatives** that achieve the same goal
4. **Provide manual instructions** if the user truly needs the dev server

## Integration with Other Rules

This rule works in conjunction with:
- **Resource management rules**: Prevents resource conflicts
- **Testing rules**: Encourages proper testing workflows
- **Build rules**: Promotes production-ready verification
- **Security rules**: Maintains system security boundaries

---

**Remember**: The development server is a powerful tool that should remain under direct user control. This rule ensures system stability, resource management, and proper development workflows.
