# NPHIES Integration Guide

This guide outlines how the platform interfaces with the Saudi National Platform for Health Information Exchange (NPHIES).

## Regulatory Context
* Governed by the Saudi Council of Health Insurance (CHI) and Ministry of Health (MOH).
* Requires FHIR R4 resources, secure communication, and comprehensive audit trails.
* Business Associate Agreements (BAA) and Data Processing Agreements must be in place with all partners.

## Architecture Overview
1. **API Gateway:** Validates JWT tokens, rate limits, and routes requests to FastAPI microservices.
2. **Service Layer:** Maps internal data models to FHIR resources using Pydantic schemas.
3. **Integration Workers:** Submit payloads to NPHIES via REST/SOAP endpoints, handle retries, and log responses.
4. **Data Stores:** PostgreSQL for transactional state, DynamoDB/QLDB for immutable audit, S3 for attachments.

## Core Interactions
| Workflow | FHIR Resource | Endpoint |
|----------|---------------|----------|
| Eligibility check | `CoverageEligibilityRequest` | `/eligibility` |
| Claim submission | `Claim`, `ClaimResponse` | `/nphies/claim` |
| Pre-authorization | `PriorAuthorization` | `/pre-authorization` |
| Remittance advice | `ExplanationOfBenefit` | Batch ingestion |

## Implementation Steps
1. **Schema Validation**
   * Use FHIR validator or `fhir.resources` library to enforce conformance before submission.
   * Maintain versioned JSON schemas per payer requirements.
2. **Security & Compliance**
   * Mutual TLS with NPHIES endpoints, IP whitelisting, and VPN or private connectivity where mandated.
   * Sign requests, include correlation IDs, and encrypt PHI in transit and at rest.
3. **Idempotency & Retry**
   * Generate unique request IDs; store submission status and replay results safely.
   * Implement exponential backoff with maximum retry thresholds and dead-letter queues for failures.
4. **Monitoring**
   * Track submission latency, success/failure counts, error codes, and SLA breaches (see `monitoring_dashboard_config.json`).
   * Configure alerts for repeated validation errors or integration outages.
5. **Testing & Certification**
   * Use NPHIES sandbox environment for integration tests; pass certification before production go-live.
   * Build automated contract tests to detect upstream schema changes.

## Future Enhancements
* Batch claims import/export via NDJSON with progress reporting.
* Provider directory synchronisation and credential management.
* Real-time eligibility caching with TTL and invalidation hooks when policy changes occur.

