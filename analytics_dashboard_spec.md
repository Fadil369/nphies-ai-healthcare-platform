# Analytics Dashboard Specification

## Purpose
Deliver a real-time analytics experience for claims, provider operations, patient engagement, and compliance tracking tailored to Saudi healthcare stakeholders.

## Personas & Needs
* **Revenue Cycle Managers:** Monitor claim throughput, denials, reimbursement timelines.
* **Clinical Directors:** Track care quality, eligibility approvals, and AI decision support outcomes.
* **Compliance Officers:** Ensure HIPAA/CHI adherence, audit trails, and breach detection.
* **Executives:** Assess cost savings, AWS spend, and platform adoption.

## Data Sources
* FastAPI services (claims, eligibility, AI endpoints) via REST/GraphQL.
* NPHIES integration logs and remittance files.
* AWS HealthLake (FHIR resources), RDS (transactional data), S3 (document metadata).
* AI model telemetry (SageMaker, Bedrock), monitoring metrics (CloudWatch), and support tickets.

## Key Views
1. **Claims Operations**
   * Submitted vs. adjudicated vs. paid volumes.
   * Denial reasons by category (coding, eligibility, documentation).
   * Average processing time with percentile breakdown.
   * Batch claims tracker with SLA countdown.
2. **Eligibility & Pre-Authorisation**
   * Eligibility success rate, retries, cache hit ratio.
   * Pre-authorization lifecycle timeline with escalation status.
   * Patient demographics vs. approval probability heatmap.
3. **AI Performance**
   * Model accuracy, confidence intervals, drift indicators.
   * Inference latency distribution (Bedrock, SageMaker).
   * Feedback loop metrics (thumbs-up/down, manual overrides).
4. **Provider & Patient Experience**
   * Provider onboarding funnel, average time to activation.
   * Patient satisfaction scores, appointment adherence, portal usage.
   * Emergency response metrics (response time, outcome categories).
5. **Compliance & Security**
   * Audit log volume, high-risk access attempts, PHI export events.
   * HIPAA/NPHIES checklist completion status, outstanding remediation items.
   * Data retention and purge status by dataset.
6. **Financial & Infrastructure**
   * AWS cost allocation (compute, storage, data transfer) vs. budget.
   * Savings from automation (manual hours reduced, claim accuracy uplift).
   * Resource utilisation (CPU, memory, queue depth) correlated with business metrics.

## Functional Requirements
* Real-time streaming via WebSockets or SSE for live dashboards.
* Role-based widgets (e.g., compliance view restricted to authorized officers).
* Export options (PDF, CSV) with PHI redaction settings.
* Drill-down and cross-filtering (e.g., click on denial reason → show affected providers/patients).
* Alerting integration (PagerDuty, email) triggered from dashboard thresholds.
* Localization for Arabic/English with RTL support.

## Technical Stack Recommendations
* **Backend:** GraphQL gateway aggregating data sources (Hasura or Apollo Federation) with caching.
* **Frontend:** React/Next.js dashboard with component library (Ant Design, Material UI) customised for healthcare.
* **Charts:** ECharts or Vega for interactive visualizations; incorporate accessibility features (high contrast, data tables).
* **Storage:** Time-series DB (Amazon Timestream) for metrics, Redshift/Snowflake for aggregated analytics, Elasticsearch for audit logs.
* **Security:** OAuth2 + JWT, attribute-based access control, row-level security for patient/provider data.

## Implementation Milestones
1. Data modelling and ingestion pipelines (Fivetran/Glue + dbt) with governance policies.
2. MVP dashboards for claims + eligibility with automated tests (Playwright) and Lighthouse accessibility audits.
3. Expand to AI/compliance views with anomaly detection.
4. Continuous improvement via product analytics (Amplitude/Mixpanel) and feedback loops with end users.

