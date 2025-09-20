# Performance Optimization Report

## Overview
This assessment captures the main throughput and latency risks in the current NPHIES-AI Healthcare Platform implementation. The analysis covered backend request handling (`main.py`), frontend routing and lazy-loading (`static/js`), dependency footprints, and container build/runtime artefacts.

## Key Observations

### Backend (FastAPI)
* **Global synchronous bottlenecks:** Performance middleware accumulates metrics in shared dictionaries without locks and calculates averages for every request, adding constant overhead while remaining unsuitable for multi-process deployments.【F:main.py†L60-L83】
* **Unbounded streaming delays:** The chat streaming endpoint inserts `await asyncio.sleep(0.1)` for each word, causing O(n) delay proportional to token count and easily breaching the 500 ms SLA.【F:main.py†L546-L583】
* **Lack of I/O offloading:** Calls to AWS SDK are synchronous; timeouts and retries are not configured, making the event loop susceptible to blocking when upstream latency spikes.【F:main.py†L645-L707】
* **No caching or connection pooling:** Redis and asyncpg are listed but unused; repeated lookups (e.g., HealthLake datastore ID, eligibility checks) will always hit upstream services once implemented.【F:requirements.txt†L1-L13】
* **Expensive JSON marshalling:** Several endpoints build large literal payloads on every call rather than caching static metadata (e.g., `/system/status`).【F:main.py†L500-L544】

### Frontend (Static JS)
* **Full-page HTML swaps:** The router fetches entire HTML fragments and injects them with `innerHTML`, forcing the browser to reparse and repaint entire views rather than updating components incrementally.【F:static/js/router.js†L167-L215】
* **Blocking lazy-loader:** Route module loader performs sequential resource fetching, awaiting CSS loads before issuing JS requests and lacking timeout or abort controllers, extending initial paint times.【F:static/js/lazy-loader.js†L20-L99】
* **No bundle splitting for critical path:** Dashboard and AI modules load multiple heavyweight scripts on initial navigation, yet there is no build-step bundling or tree-shaking; the browser performs many separate network trips.【F:static/js/lazy-loader.js†L100-L176】

### Container & Infrastructure
* **Docker image bloat:** Base image installs `gcc` and leaves apt cache, inflating image size and cold-start time; Python dependencies are compiled at runtime rather than via wheels.【F:Dockerfile†L1-L24】
* **Health check overhead:** Container health check polls `/health` every 30s without caching, hitting Python application frequently and skewing metrics.【F:Dockerfile†L24-L30】
* **Missing autoscaling signals:** Performance metrics stored in memory are not exported (Prometheus, CloudWatch), preventing autoscaling policies from acting on real load.【F:main.py†L34-L83】

## Recommendations

### Short Term (Week 1)
1. **Streaming optimisation:** Replace artificial sleeps with token-batch streaming or background tasks; limit message length and use asyncio queues.
2. **Caching:** Introduce Redis-backed cache for static metadata (system status, routing tables) and configure TTL-based caching decorators.
3. **Instrumentation:** Export metrics to Prometheus (via `PrometheusMiddleware`) or CloudWatch Embedded Metrics, removing in-memory averages.

### Medium Term (Week 2-3)
1. **Async AWS clients:** Use `aioboto3` or threadpool executors with timeout/retry policies to avoid blocking the event loop.【F:main.py†L645-L707】
2. **Schema-driven payloads:** Precompute static payloads and store in configuration files to minimize per-request JSON assembly.
3. **Frontend refactor:** Move to component-based rendering (e.g., React/Next.js or web components) with granular updates; adopt build tooling (Vite/Webpack) for tree shaking and HTTP/2 multiplexing.
4. **Lazy-loader redesign:** Parallelize CSS/JS fetching with `Promise.allSettled`, add abort signals, and warm caches using Service Worker prefetch strategies.【F:static/js/lazy-loader.js†L20-L133】

### Long Term (Week 4+)
1. **Edge caching:** Deploy CloudFront in front of static assets and API Gateway with caching for read-heavy endpoints.
2. **Database tuning:** When asyncpg usage is added, configure connection pools, prepared statements, and query observability (pg_stat_statements).
3. **Autoscaling:** Emit high-cardinality metrics (P95 latency, error rates) and configure ECS/Fargate target tracking policies.
4. **Load testing:** Incorporate k6/Gatling scenarios into CI/CD to ensure <200 ms response for primary workflows.

## Expected Impact
* Reducing artificial streaming delays alone should improve chat turnaround by >70% for average 100-token responses.
* Parallelizing frontend resource loading and enabling HTTP caching is projected to cut first-contentful-paint by 40–60% on mobile networks.
* Removing build-time toolchain packages and enabling multi-stage builds can shrink the container image by ~45%, accelerating deployments and cold starts.

