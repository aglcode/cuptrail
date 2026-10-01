DevOps Best Practices

A standing checklist Claude applies to infrastructure and deployment work — generating new config, editing existing config, or reviewing config the user pastes in or points at. The goal is that infra/deploy output is secure, reliable, and reproducible by default, not as an afterthought. Security gets a full audit mindset, matching the bar set for the frontend accessibility and backend security skills.

When this applies
Writing or editing infra/deploy config: Dockerfiles, docker-compose, CI/CD pipeline YAML, Terraform/CloudFormation/Pulumi, Kubernetes manifests/Helm charts, provisioning scripts.
Setting up or discussing monitoring, logging, alerting, or SLOs.
Debugging a deployment, infra, or pipeline failure — check whether the root cause or the fix touches any checklist item below.
Reviewing pasted infra config or an IaC/pipeline diff when asked.

This applies regardless of cloud provider (AWS, GCP, Azure, bare metal/on-prem) or tool (Terraform, CloudFormation, Pulumi, Ansible, GitHub Actions, GitLab CI, Jenkins, ArgoCD, etc.) unless the user's own project conventions override a specific point below — match their existing setup over any default.

Core workflow
Before writing config: skim the relevant checklist sections below. For anything touching IAM/permissions, secrets, or public network exposure, open references/security.md for the full audit checklist first.
While writing config: apply the checklist inline — don't bolt it on after.
After writing config, or when asked to review pasted config: do a pass against the checklist and call out anything unresolved (either fix it, or explicitly note the trade-off/why it's out of scope). Don't silently ship a wide-open security group, a root-running container, or a pipeline with no rollback path.
When reviewing: even if the user only asked about one thing (e.g., "why is this deploy failing?"), briefly flag other checklist violations you notice — one or two lines each, not a full audit dump, unless they ask for a full review.
Security & hardening — full audit mindset (every task)

Treat every piece of infra/deploy config as if it will be audited — this is the DevOps equivalent of the accessibility/security bars in the frontend and backend skills: not optional, not "only when asked." Load references/security.md for the full checklist before provisioning IAM roles, security groups, or anything with public exposure. Quick-reference must-haves for every task:

No secrets in config or images. No hardcoded credentials, API keys, or tokens in Dockerfiles, IaC files, CI YAML, or committed config — use a secrets manager, CI secret store, or injected env vars. Flag any secret-looking literal on sight.
Least privilege everywhere. IAM roles/policies, service accounts, and CI tokens scoped to only what the task needs — flag wildcard permissions (*:*, overly broad resource ARNs) or requests for broader access "just in case."
Minimal network exposure. No security group/firewall rule open to 0.0.0.0/0 on a sensitive port unless genuinely required and called out explicitly; internal services stay internal.
Containers run unprivileged. No USER root in a running container without justification; no unnecessary --privileged flags or host mounts.
Supply chain awareness. Base images and dependencies pinned to specific versions/digests, not floating latest, where reproducibility/security matters; flag known-vulnerable or unmaintained base images if recognized.
State/backend security. IaC state files (e.g., Terraform state) stored in a secured, access-controlled backend — never committed to version control, since state can contain secrets.

Flag violations of any of these even in code the user didn't explicitly ask to be audited.

Infrastructure as Code

Load references/iac.md for the fuller guide. Defaults for every task:

Resources are declared, not manually clicked/created out-of-band — flag drift risk when a change would only apply outside the IaC tool.
Environments (dev/staging/prod) are parameterized/modularized rather than duplicated as near-identical copies of the same files.
Destructive changes (deleting/replacing a resource that holds state — a database, a volume) are called out explicitly before applying, with a note on data-loss risk.
Remote state uses locking to prevent concurrent-apply corruption.
Outputs/variables avoid hardcoding environment-specific values inline.
CI/CD pipelines

Load references/ci-cd.md for the fuller guide. Defaults for every task:

Pipelines fail fast and fail loud — a broken build/test/lint step blocks deployment, it doesn't get skipped silently.
Deployments are automatable and repeatable from a clean checkout — no manual "also run this by hand" steps left implicit.
A rollback path exists (previous artifact/image retained, or a documented revert step) for anything deploying to production.
Secrets used in pipelines come from the CI platform's secret store, never plaintext in the pipeline file.
Build artifacts are reproducible/pinned (dependency versions locked) so a rebuild doesn't silently pull different code.
Containers & orchestration

Load references/containers.md for the fuller guide. Defaults for every task:

Multi-stage builds used to keep final images small and free of build-time tooling/secrets.
Resource requests/limits set on containers (CPU/memory) in orchestrated environments — no unbounded containers that can starve a node.
Health checks (liveness/readiness probes, HEALTHCHECK in Docker) defined so orchestration can detect and recover from failure.
Config/secrets injected at runtime (env vars, mounted secrets, ConfigMaps) rather than baked into the image.
Observability & reliability

Load references/observability.md for the fuller guide. Defaults for every task:

Logs are structured and shipped somewhere queryable — not left only in ephemeral container stdout with no aggregation.
Key metrics (latency, error rate, saturation) are exposed/collected for anything user-facing, not just infra-level CPU/memory.
Alerts exist for conditions that need a human response, and are actionable (tied to a runbook or clear next step) rather than noisy.
Single points of failure are called out — no unreplicated stateful service silently assumed to be "fine."
Review mode (pasted / existing config)

When the user pastes config or points at a file/diff for feedback, debugging, or review:

Run it against the checklist sections above relevant to what's there (skip container checks on a pure Terraform networking module, etc.).
Report findings grouped by severity: security issues first, then reliability/correctness issues, then structure/maintainability nits.
Give a concrete fix (a snippet or a specific instruction), not just "harden this."
If the user only asked about one specific bug, answer that directly first — then add a short "also noticed" section for anything else material, rather than leading with an unsolicited audit.