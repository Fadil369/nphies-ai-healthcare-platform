# Troubleshooting Guide

## Common Issues

### Application Fails to Start
* **Symptom:** `FileNotFoundError: [Errno 2] No such file or directory: '/app/logs/nphies-ai.log'`.
  * **Resolution:** Ensure `/app/logs` exists and appuser has write permissions; consider configuring logging to stdout only.【F:main.py†L23-L33】
* **Symptom:** `NameError: name 'random' is not defined` when calling `/nphies/claim` before chat endpoints.
  * **Resolution:** Import `random` at module scope or refactor AI services to dedicated modules.【F:main.py†L208-L274】【F:main.py†L609-L639】

### AWS Service Errors
* **Symptom:** `botocore.exceptions.NoRegionError` on startup.
  * **Resolution:** Set `AWS_REGION` environment variable or load via configuration service; avoid hardcoding in source.【F:main.py†L115-L135】
* **Symptom:** Timeouts when invoking Bedrock/SageMaker.
  * **Resolution:** Configure timeouts/retries via boto3 client configs; ensure network access via VPC endpoints.【F:main.py†L645-L707】

### Frontend Routing Problems
* **Symptom:** Clicking nav links results in blank page.
  * **Resolution:** Verify static HTML files exist under `/static`; router injects HTML via `innerHTML` and fails silently when fetch errors occur.【F:static/js/router.js†L167-L215】 Add error logging and fallback UI.
* **Symptom:** Authentication loop redirecting to `/login` continuously.
  * **Resolution:** Ensure `/auth/validate` endpoint implemented; router expects token validation to return 200.【F:static/js/router.js†L60-L127】

### Deployment & CI/CD
* **Symptom:** ECS task crash due to missing environment secrets.
  * **Resolution:** Inject secrets via AWS Secrets Manager and update task definition overrides (see `cicd_pipeline_setup.yml`).
* **Symptom:** GitHub Actions failing on Trivy scan.
  * **Resolution:** Review vulnerability report in workflow logs; upgrade dependencies or add exceptions via `.trivyignore` after risk assessment.

### Compliance Alerts
* **Symptom:** Audit log missing entries for workflow transitions.
  * **Resolution:** Ensure middleware emits structured logs and writes to centralized SIEM; add tests verifying audit coverage.
* **Symptom:** HIPAA security scanner flags open CORS.
  * **Resolution:** Restrict `allow_origins` to approved domains and add CSRF protection middleware.【F:main.py†L90-L107】

## Support Escalation
1. Check CloudWatch dashboards and `monitoring_dashboard_config.json` for active alarms.
2. Create Jira incident ticket with logs, timestamps, impacted users.
3. Page on-call engineer via PagerDuty for SEV1/SEV2 events.
4. For compliance breaches, notify Security and Compliance within 1 hour per policy.

