Performance Optimization

Cross-stack performance engineering: diagnosing where time/resources actually go, then applying the right fix for that specific layer — frontend, backend, or infrastructure. The core discipline is measure before you optimize — this skill exists as much to prevent wasted effort on the wrong fix as to supply the right one.

This skill complements, not replaces, the performance sections already in frontend-best-practices, backend-best-practices, and devops-best-practices — those cover baseline hygiene to apply by default; this skill is for when performance itself is the explicit problem: diagnosing a real bottleneck and going deep on the fix.

Core principle: measure first

Never propose or apply a performance fix without first establishing (or asking for) evidence of where the actual bottleneck is. Optimizing the wrong thing wastes effort and can add complexity for zero benefit.

If the bottleneck is unknown: ask what's slow, how it's been measured (if at all), and where in the stack the time is going — or if no measurement exists, walk through how to get one before proposing a fix. Don't guess at a cause and jump straight to a fix.
If the user already has a specific symptom + evidence (a profiler trace, a slow query log, a Lighthouse score, a metric dashboard): use that evidence to scope the fix, don't re-derive from scratch.
If the user proposes a specific optimization without evidence ("let's add caching here", "let's rewrite this in Go for speed"): don't just implement it — ask what's driving the ask, or note explicitly that this is being applied without confirmed bottleneck evidence, and flag the risk of the added complexity being uncalled for.
Always state the expected impact and the trade-off of a proposed optimization (added complexity, memory-for-speed trade, cache invalidation risk) — a fix that isn't worth its cost is still a bad fix even if it works.

Load references/methodology.md for the fuller diagnostic framework and how to reason about it per layer.

Routing to the right layer

Performance problems usually live predominantly in one layer, even if symptoms show up elsewhere (e.g., a "slow page" that's actually a slow backend query). Identify which layer the bottleneck is actually in before applying a layer-specific fix:

Frontend-bound: slow perceived load/interaction despite fast server responses — large bundles, unoptimized rendering, layout thrashing, unnecessary re-renders, unoptimized assets. → references/frontend-perf.md
Backend-bound: slow server response time, high latency under load, CPU/memory pressure on the service itself — inefficient algorithms, blocking I/O, poor concurrency, expensive computation per request. → references/backend-perf.md
Data-layer-bound: slow specifically tied to database/query time — missing indexes, N+1s, lock contention, inefficient query plans. → references/backend-perf.md (data section)
Infra-bound: slow/unreliable under load despite the application code being efficient — under-provisioned resources, poor autoscaling, network latency, cold starts, noisy-neighbor contention, inefficient caching layers. → references/infra-perf.md

A single symptom can span layers (e.g., "slow checkout" could be frontend rendering, a backend query, or a downstream payment API's network latency) — narrow it down with the diagnostic questions in references/methodology.md before picking a fix.

Frontend performance (quick reference)

Load references/frontend-perf.md for the deeper guide (profiling tools, rendering-specific techniques). Common levers:

Bundle size: code-splitting, tree-shaking, lazy-loading routes/components, auditing large dependencies.
Rendering: minimizing re-renders, virtualizing long lists, avoiding layout thrashing, offloading expensive work off the main thread.
Assets: image sizing/format/compression, font loading strategy, caching headers.
Core Web Vitals: LCP (what blocks the largest above-fold element), CLS (reserved space for async content), INP (main-thread cost of interactions).
Backend performance (quick reference)

Load references/backend-perf.md for the deeper guide (profiling approaches, concurrency patterns). Common levers:

Algorithmic complexity: check for accidental O(n²)+ in hot paths before reaching for infrastructure-level fixes.
I/O: batching, avoiding N+1 queries/calls, async/non-blocking I/O where the runtime supports it, connection pooling.
Concurrency: parallelizing independent work, avoiding lock contention/serialization bottlenecks.
Caching: memoization, request-level caching, distributed caches — with explicit attention to invalidation correctness, not just speed.
Computation: moving expensive, reusable computation out of the request path (precompute, background job, cache).
Infrastructure performance (quick reference)

Load references/infra-perf.md for the deeper guide (scaling patterns, caching layers, network). Common levers:

Resource sizing: right-sizing CPU/memory to actual usage patterns (measured, not guessed) before scaling out.
Scaling strategy: horizontal vs. vertical, autoscaling triggers tied to the actual bottleneck metric (not just CPU if the real constraint is memory or connections).
Caching layers: CDN/edge caching, application-level caches, cache hit-rate visibility.
Network: latency between services (co-location/region choice), connection reuse, payload size.
Cold starts: relevant for serverless/on-demand compute — warm pools, provisioned concurrency, or architecture changes if cold start latency matters to the use case.
Trade-offs to always surface

Every optimization has a cost. Name it explicitly rather than presenting a fix as free:

Caching → staleness/invalidation risk, added operational complexity.
Denormalization/precomputation → write-path complexity, data consistency risk.
Horizontal scaling → statelessness requirements, coordination overhead.
Aggressive code-splitting → more network requests, potential waterfall if not managed.
Lower-level rewrites (e.g., a hot path in a faster language/lower-level API) → maintainability cost, team familiarity, whether the gain justifies it.
When reviewing code/config for performance
Ask what's actually slow and what evidence exists — don't audit blind for "anything that could theoretically be faster" unless asked for a general review.
Identify the layer (frontend/backend/infra) the evidence points to.
Propose the smallest fix that addresses the measured bottleneck, with its trade-off stated.
If no evidence exists yet, help get it (suggest the specific profiling/measurement step) before proposing a fix.