# AI Services Optimization Roadmap

## Current Baseline
* Endpoints for Bedrock, SageMaker, Textract, Personalize, and Kendra return static or randomly generated payloads without invoking managed services or enforcing request validation.【F:main.py†L645-L803】
* AWS clients are instantiated globally without credential rotation, timeout policies, or regional failover.【F:main.py†L115-L140】【F:main.py†L645-L707】
* No monitoring of model accuracy, drift, or inference latency exists; analytics endpoint synthesises random metrics.【F:main.py†L805-L858】

## Strategic Goals
1. Deliver clinically relevant AI outputs with measurable accuracy, confidence scoring, and explainability.
2. Provide operational resilience through multi-region failover, retry logic, and circuit breakers.
3. Ensure traceability and compliance (model governance, dataset versioning, audit trails) aligned with Saudi health regulations.
4. Expand AI portfolio with imaging, NLP, decision support, and predictive analytics tailored to provider workflows.

## Roadmap Phases

### Phase 1 – Foundation (Weeks 1-2)
* **Service abstraction:** Wrap each AWS integration in dedicated service classes with typed request/response models and dependency injection.
* **Validation:** Enforce schema validation using Pydantic, verifying prompt contents, patient identifiers, and language selection.
* **Observability:** Instrument latency, success/failure counts, and payload sizes with CloudWatch metrics and X-Ray traces.
* **Security:** Sign requests with IAM roles, enable AWS PrivateLink endpoints, and store PHI in encrypted S3 buckets when staging documents.

### Phase 2 – Clinical Quality (Weeks 3-4)
* **Bedrock:** Implement prompt templates with guardrails, toxicity filters, and retrieval-augmented generation (RAG) pulling from vetted FHIR/ICD knowledge bases.
* **SageMaker:** Deploy managed endpoints with shadow deployments, A/B testing, and model registry tracking; calculate calibration curves and fairness metrics per cohort.
* **Textract & Comprehend Medical:** Chain document OCR to entity extraction; auto-classify document types and push structured data into HealthLake after validation.
* **Personalize & Kendra:** Use patient consent-aware segmentation and track recommendation impact on claim approvals.

### Phase 3 – Advanced Capabilities (Weeks 5-8)
* **Imaging & Diagnostics:** Integrate Amazon Rekognition Medical or custom CV models for radiology triage; support DICOM ingestion.
* **Decision Support:** Introduce clinical pathways, best-practice alerts, and drug interaction checks using curated knowledge graphs.
* **Predictive Analytics:** Train models forecasting claim denial probability, length of stay, and chronic disease risk; expose via analytics dashboards.
* **NLP for Notes:** Leverage Comprehend Medical and Bedrock Titan Text to summarise progress notes, detect missing documentation, and auto-populate claim fields.

### Phase 4 – Reliability & Governance (Ongoing)
* **MLOps:** Adopt SageMaker Pipelines for training/validation, store datasets in Feature Store, and enforce approval workflows before promotion.
* **Failover:** Configure multi-region endpoints with Route 53 health checks; implement graceful degradation returning cached insights when services degrade.
* **Compliance:** Maintain model cards, data lineage, and periodic bias audits; document HIPAA controls and CHI compliance evidence.

## Deliverables
1. Service layer library with unit and integration tests covering AWS interactions.
2. Monitoring dashboards showing per-model latency, error rates, and accuracy trends.
3. Governance documentation (model cards, versioning matrix, approval logs).
4. Backlog of AI-assisted features (image triage, drug interactions, predictive alerts) prioritised with clinical leadership.

