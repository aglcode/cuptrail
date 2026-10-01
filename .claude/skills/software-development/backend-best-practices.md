Backend Best Practices

A standing checklist Claude applies to every piece of backend work — generating new code, editing existing code, or reviewing/critiquing code the user pastes in. The goal is that backend output is secure, correct, and structurally sound by default, not as an afterthought. Security in particular gets a full audit mindset, the same weight accessibility gets on the frontend side.

When this applies
Writing or editing any server-side code: API routes/resolvers, services, middleware, auth logic, background jobs, database access.
Reviewing pasted backend code, a diff, or a PR — flag issues even if not asked to.
Designing or discussing an API contract, database schema, or backend architecture.
Debugging a server-side bug — check whether the root cause or the fix touches any checklist item below.

This applies regardless of language/framework/protocol (REST, GraphQL, gRPC, Node/Express, Python/Django/FastAPI, Go, Java/Spring, Ruby/Rails, etc.) unless the user's own project conventions override a specific point below — match their existing codebase over any default lean.

Core workflow
Before writing code: skim the relevant checklist sections below. For anything touching auth, user input, or money/PII, open references/security.md for the full audit checklist first.
While writing code: apply the checklist inline — don't bolt it on after.
After writing code, or when reviewing pasted code: do a pass against the checklist and call out anything unresolved (either fix it, or explicitly note the trade-off/why it's out of scope). Don't silently ship an endpoint with no validation or an unauthenticated write path.
When reviewing: even if the user only asked about one thing (e.g., "why is this query slow?"), briefly flag other checklist violations you notice — one or two lines each, not a full audit dump, unless they ask for a full review.
Security — full audit mindset (every task)

Treat every piece of backend code as if it will be audited — this is the backend equivalent of the accessibility bar on the frontend side: not optional, not "only when asked." Load references/security.md for the full checklist before building anything touching auth, payments, file uploads, or user-supplied input. Quick-reference must-haves for every task:

AuthN/AuthZ on every entry point. Every route/resolver/handler that touches non-public data checks both "who is this" and "are they allowed to do this specific thing" — never authentication alone standing in for authorization.
Never trust input. Validate and sanitize all external input (request bodies, query params, headers, file uploads) at the boundary — type, shape, length, and allowed values — before it reaches business logic.
Injection prevention. Parameterized queries/ORM methods only — never string-concatenated SQL. Same principle for shell commands, NoSQL queries, and template rendering with user input.
Secrets never in code. No hardcoded API keys, passwords, or tokens in source — environment variables or a secrets manager only. Flag any secret-looking literal even in example/test code.
Least privilege. Database users, service accounts, and API tokens scoped to only what they need — flag anything requesting broader access than the task requires.
Sensitive data handling. Passwords hashed (not encrypted/plaintext) with a modern algorithm (bcrypt/argon2/scrypt); PII and secrets never logged; sensitive fields excluded from API responses by default (explicit allow-list, not accidental over-fetch).
Rate limiting / abuse surface. Flag unauthenticated or expensive endpoints (login, search, file upload, password reset) with no rate limiting or brute-force protection.

Flag violations of any of these even in code the user didn't ask you to audit.

API design & correctness

Load references/api-design.md for the fuller guide. Keep guidance protocol-agnostic (REST, GraphQL, RPC) — apply the version relevant to what's being built, don't push a REST or GraphQL lean when the other is in use. Defaults for every task:

Consistent, predictable contracts. Naming, casing, and response shape consistent with the rest of the API/schema being extended — check for existing conventions before inventing new ones.
Correct status codes / error shape. Errors are distinguishable by type (validation vs. auth vs. not-found vs. server error) and return enough detail for the client to act, without leaking internals (stack traces, query text) to the client.
Idempotency where expected. Retriable operations (payments, writes triggered by client retries) are idempotent or protected against duplicate execution.
Versioning/compatibility awareness. Breaking changes to a contract already in use are flagged explicitly, not made silently.
Pagination for anything unbounded. Any endpoint/resolver that can return a growing list is paginated, not returning the full table.
Data layer

Load references/data-layer.md for the fuller guide. Defaults for every task:

No N+1 queries. Loops that issue a query per iteration are flagged — use batching, joins, or a dataloader pattern instead.
Transactions around multi-step writes. Anything that writes to more than one table/collection as a logical unit is wrapped in a transaction, so a partial failure can't leave inconsistent state.
Migrations are safe and reversible. Schema changes include a rollback path where feasible; destructive changes (dropping a column/table) are flagged as needing a deprecation window on a live system.
Indexes match query patterns. Fields used in WHERE/JOIN/sort clauses on non-trivial tables are checked for an index.
Constraints enforced at the DB level, not just application code, for anything correctness-critical (uniqueness, foreign keys, not-null).
Structure & error handling

Load references/code-structure.md for the fuller guide. Defaults for every task:

Functions/services have a single clear responsibility; split when a handler is doing request parsing + business logic + data access + response formatting all inline with no separation.
Errors are caught and handled at an appropriate layer — not swallowed silently, not left to crash the process for a recoverable case.
Logging is structured and useful for debugging without logging sensitive data (see security section).
Config/environment differences (dev/staging/prod) are handled via config, not hardcoded conditionals scattered through business logic.
Retries/timeouts are set explicitly for outbound calls to other services — no unbounded waits.
Review mode (pasted / existing code)

When the user pastes code or points at a file for feedback, debugging, or review:

Run it against the checklist sections above relevant to what's there (skip data-layer checks on a pure auth middleware file, etc.).
Report findings grouped by severity: security issues first, then correctness/API-contract issues, then data-layer issues, then structure/style nits.
Give a concrete fix (a snippet or a specific instruction), not just "add validation here."
If the user only asked about one specific bug, answer that directly first — then add a short "also noticed" section for anything else material, rather than leading with an unsolicited audit.