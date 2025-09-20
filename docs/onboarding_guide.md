# Engineering Onboarding Guide

Welcome to the NPHIES-AI Healthcare Platform team. This guide helps new engineers set up their environment, understand core services, and follow compliance practices.

## 1. Account & Access Setup
1. Request access to GitHub, AWS Organization, Atlassian (Jira/Confluence), and communication tools (Slack/Teams).
2. Complete HIPAA security awareness training and sign confidentiality agreements.
3. Obtain VPN credentials and register MFA devices (hardware token preferred).

## 2. Local Development Environment
1. Install prerequisites: Python 3.11+, Node.js 18+, Docker Desktop, AWS CLI v2, Terraform.
2. Clone the repository and create a Python virtual environment:
   ```bash
   git clone git@github.com:brainsait/nphies-ai-healthcare-platform.git
   cd nphies-ai-healthcare-platform
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` (request secrets via AWS Secrets Manager) and export required variables:
   ```bash
   export AWS_PROFILE=nphies-dev
   export ENVIRONMENT=development
   ```
4. Run the FastAPI service:
   ```bash
   uvicorn main:app --reload
   ```
5. Start frontend dev server (post refactor) and Storybook for component development.

## 3. Data & Compliance Practices
* Never use production PHI in local environments. Use synthetic datasets stored in encrypted S3 buckets.
* Store secrets in AWS Parameter Store; avoid committing credentials to git.
* Log access to PHI-related systems and report incidents immediately to Security Operations.

## 4. Branching & Workflow
1. Create feature branches from `develop` (e.g., `feature/nphies-eligibility-cache`).
2. Follow trunk-based development with short-lived branches (<5 days).
3. Ensure all commits pass linting, tests, and security scans (see `cicd_pipeline_setup.yml`).
4. Submit PRs with:
   * Summary of changes and risk assessment.
   * Testing evidence (unit, integration, manual QA).
   * Security review items (secrets, access control, logging).
5. Require at least two approvals (backend + security) for HIPAA-impacting features.

## 5. Documentation & Knowledge Sharing
* Update relevant docs in `/docs` and Confluence after feature completion.
* Record Loom demos for major features and post in #nphies-release channel.
* Attend weekly architecture and compliance reviews.

## 6. Incident Response
* Familiarise yourself with on-call rotation and PagerDuty runbooks.
* Follow SEV triage process: acknowledge within 5 minutes, mitigation in 30 minutes, RCA within 48 hours.
* Document incident timeline, impact, root cause, and corrective actions in Incident Tracker.

## 7. Further Reading
* `security_audit_report.md` – critical remediation tasks.
* `nphies_enhancement_plan.md` – roadmap for regulatory integration.
* `comprehensive_test_suite/TEST_STRATEGY.md` – quality expectations.

Welcome aboard! Reach out to the #nphies-onboarding channel for mentorship and pairing sessions.

