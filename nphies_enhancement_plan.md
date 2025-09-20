# NPHIES Integration Enhancement Plan

## Current State Assessment
* **API coverage is superficial:** The `/nphies/claim` endpoint returns mock responses with random confidence scores and no interaction with the Saudi NPHIES platform.【F:main.py†L609-L639】
* **FHIR validation absent:** No utilities exist to validate payloads against FHIR R4 profiles required by NPHIES.
* **Error handling minimal:** Exceptions bubble up as HTTP 500 without categorising integration vs. validation faults.【F:main.py†L640-L642】
* **Audit and traceability missing:** Claims are not persisted, versioned, or logged with correlation IDs.

## Enhancement Objectives
1. Achieve full compliance with Saudi Council of Health Insurance (CHI) and NPHIES messaging standards (FHIR R4, HL7).
2. Provide resilient claim submission with retries, compensating transactions, and reconciliation pipelines.
3. Deliver operational visibility: dashboards, alerts, audit trails, and SLA monitoring.
4. Support advanced workflows: eligibility checks, pre-authorisations, remittances, batch uploads, and provider onboarding.

## Proposed Architecture
```
Client Apps → API Gateway → FastAPI (routers: claims, eligibility, providers)
                               ↓
                         Service Layer (NPHIES SDK, validation, mapping)
                               ↓
                      Async Task Queue (Celery/SQS) for long-running jobs
                               ↓
                    Persistence (RDS/PostgreSQL) + Audit Log (DynamoDB/QLDB)
                               ↓
                 External Integrations (NPHIES APIs, HealthLake, Insurance APIs)
```

## Workstream Breakdown

### 1. API & Schema Hardening (Week 1-2)
* Create Pydantic models for FHIR resources (Claim, ClaimResponse, CoverageEligibilityRequest/Response) with schema validation.
* Implement request idempotency keys and store submission state in PostgreSQL.
* Enforce OAuth2 client credentials for system-to-system calls and sign payloads as per NPHIES specs.

### 2. Resilient Messaging (Week 2-3)
* Integrate AWS SQS FIFO queues for claim submissions, enabling replay and deduplication.
* Use Celery or AWS Step Functions to orchestrate retries with exponential backoff and circuit breakers.
* Implement compensating actions for partial failures (e.g., rollback eligibility check when claim fails).

### 3. Compliance & Auditing (Week 3)
* Persist audit logs with user ID, patient hashed identifier, payload digests, timestamps, and outcome; store immutable copy in AWS QLDB or DynamoDB Streams.
* Encrypt PHI at rest using KMS-managed keys and mask sensitive fields in logs.
* Build compliance dashboards showing submission success rate, error taxonomy, and SLA adherence.

### 4. Advanced Feature Support (Week 4+)
* **Batch claims:** Accept NDJSON uploads, chunk into asynchronous jobs, provide progress tracking.
* **Eligibility verification:** Integrate `/eligibility` endpoint with synchronous NPHIES eligibility check and fallback caches for repeated queries.
* **Pre-authorisation:** Manage lifecycle (draft → submitted → approved) with document attachments stored in S3 + signed URLs.
* **Provider integration:** Synchronise provider registries, maintain status (active/suspended), and notify stakeholders of changes.

### 5. Monitoring & Alerting
* Emit structured metrics: success rate, retry count, latency percentiles, payload sizes.
* Configure CloudWatch alarms and PagerDuty alerts for elevated failure rates or latency breaches.

## Deliverables
1. Modular FastAPI routers with validated schemas and service interfaces.
2. Integration test suite using mocked NPHIES endpoints and contract tests.
3. Operational runbooks covering incident response, data reconciliation, and regulatory reporting.
4. Deployment blueprints for multi-AZ resilience with blue/green release strategy.

