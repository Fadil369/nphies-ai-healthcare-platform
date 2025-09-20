# Workflow Automation Specification

## Objectives
Design an event-driven orchestration layer that automates provider onboarding, eligibility verification, scheduling, EMR synchronisation, and billing for the NPHIES-AI platform while maintaining HIPAA compliance and Saudi healthcare regulations.

## Architectural Principles
1. **Event-driven:** Use AWS EventBridge or Kafka topics to broadcast workflow events (e.g., `patient.registered`, `claim.submitted`).
2. **Composable micro-flows:** Break complex journeys into reusable steps (eligibility check, document upload, clinical review).
3. **Observability:** Provide trace IDs, state transition logs, and SLA tracking for each workflow instance.
4. **Compliance:** Enforce encryption, consent verification, and audit logging at every step.

## Reference Architecture
```
User Actions / External Systems
        ↓
API Gateway → FastAPI Workflow API → Orchestrator (Temporal.io / AWS Step Functions)
                                                 ↓
                               Workers (Celery/SQS, Lambda) executing domain tasks
                                                 ↓
                 Integrations: NPHIES APIs, EHR/EMR (HL7/FHIR), Payment Gateway, Notifications
                                                 ↓
                             Data Stores: PostgreSQL (state), DynamoDB (audit), S3 (documents)
```

## Core Workflows

### 1. Provider Onboarding
1. Collect provider details & documents (S3 + signed URLs).
2. Run background checks (NPHIES registry, license verification).
3. Configure IAM roles and assign RBAC permissions.
4. Notify admin for approval; upon approval, publish `provider.onboarded`.

### 2. Patient Registration & Eligibility
1. Triggered by `patient.registered` event.
2. Validate demographics, consent, and insurance info.
3. Call NPHIES eligibility API; cache result with TTL.
4. Update HealthLake/EMR, emit `eligibility.verified`.
5. If failure, escalate to manual review queue with SLA timers.

### 3. Scheduling & Pre-Authorisation
1. Intake request enters orchestrator; verify coverage and provider availability.
2. If procedure requires pre-authorisation, gather documents and submit to NPHIES.
3. Track status via polling/webhooks; update patient portal in real time.
4. Upon approval, reserve appointment slot, dispatch notifications (SMS, email, in-app).

### 4. Claims Lifecycle
1. Generate claim bundle from encounter data (FHIR Claim resource).
2. Validate using schema + business rules; persist claim state machine (`draft → submitted → adjudicated → paid`).
3. Submit to NPHIES via asynchronous worker; handle retries/backoff.
4. Reconcile remittance advice, update ledger, trigger payment workflows.
5. Emit metrics for turnaround time, denial reasons, and appeal deadlines.

### 5. Billing & Payments
1. Integrate payment gateway for patient co-pay collections.
2. Automate invoice generation, ledger updates, and refunds.
3. Reconcile bank statements nightly; flag discrepancies for finance team.

## Compliance & Controls
* **Audit Logging:** Every state change recorded with actor, timestamp, patient/provider identifiers (hashed), and payload digest.
* **Consent Management:** Store patient consent artifacts; block workflows lacking required consent.
* **Data Retention:** Apply lifecycle policies for PHI per regulatory timelines; purge or anonymise after retention period.
* **Access Control:** Use Attribute-Based Access Control (ABAC) to restrict workflow actions based on role, region, and patient-provider relationships.

## Tooling & Implementation Notes
* Adopt Temporal.io for complex long-running workflows with human-in-the-loop steps; Step Functions for AWS-native serverless flows.
* Define workflow definitions as code (Python DSL) with unit tests and simulation harnesses.
* Provide admin UI to visualise workflow progress, retry failed steps, and inject manual overrides.
* Integrate notifications via SNS, SES, and Twilio/WhatsApp for omnichannel alerts.

## KPIs & Monitoring
* Average eligibility turnaround time.
* Claim submission success rate and retry counts.
* Pre-authorisation approval time and escalation rate.
* Provider onboarding duration and bottlenecks.
* SLA compliance per workflow.

