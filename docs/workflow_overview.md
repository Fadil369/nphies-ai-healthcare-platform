# Workflow Documentation

This document describes the core healthcare workflows supported (or planned) within the NPHIES-AI platform.

## 1. Eligibility Verification
1. Patient registration triggers eligibility request with demographics, insurance policy, and provider details.
2. FastAPI service validates payload, persists audit log, and sends FHIR `CoverageEligibilityRequest` to NPHIES.
3. Response stored in cache (Redis) with TTL; negative responses escalate to manual review queue.
4. Patient portal displays coverage summary, co-pay, and next steps.

## 2. Pre-Authorization
1. Provider submits request with diagnosis, procedure codes, supporting documents.
2. Workflow engine verifies completeness, checks if prior authorization required using payer rules.
3. If required, package FHIR `PriorAuthorization` bundle and send to NPHIES; monitor status via polling/webhooks.
4. Notifications sent to provider/patient; audit log tracks timeline and attachments.

## 3. Claims Submission
1. Encounter data converted to FHIR `Claim` resource with service lines, diagnosis, and attachments.
2. Claim staged in PostgreSQL with idempotency key; validations ensure coding accuracy, eligibility, and documentation.
3. Asynchronous worker submits to NPHIES queue; handles retries/backoff and reconciles `ClaimResponse`.
4. Finance system receives remittance advice, updates ledger, and triggers payment disbursement.

## 4. Appeals & Resubmissions
1. Denied claims automatically categorised by reason (coding, eligibility, documentation).
2. Appeals workflow collects missing info, obtains approvals, and resubmits with corrected data.
3. Dashboard tracks appeal success rates and SLA compliance.

## 5. Provider Onboarding
1. Provider submits credentials and facility data.
2. Compliance team reviews licences, background checks, and network agreements.
3. Upon approval, provider account activated, roles assigned, and data synced with NPHIES provider registry.

## 6. Emergency Response
1. Emergency toggle in patient portal provides quick access to critical info (insurance ID, allergies, emergency contacts).
2. If flagged as emergency, bypass standard authorisation steps and notify care coordination team.
3. After stabilization, workflow reconciles services delivered, ensuring compliance with emergency coverage rules.

## Workflow Controls
* **Audit Logging:** Each workflow step emits structured log with actor, timestamp, patient/provider IDs (hashed), and outcome.
* **SLA Tracking:** Temporal/Step Functions store deadlines; breaches trigger alerts to operations team.
* **Compliance Checks:** Automated rules validate HIPAA, CHI, and NPHIES constraints before state transitions.
* **Human-in-the-loop:** Manual approval steps for high-risk actions (large claims, atypical procedures) with dual authorization.

