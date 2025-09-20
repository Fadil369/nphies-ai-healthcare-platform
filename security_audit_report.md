# Security Audit Report

## Overview
This report summarizes the results of a rapid security review of the NPHIES-AI Healthcare Platform codebase with emphasis on HIPAA-aligned controls, privacy protection, and secure software practices. The scope covered the FastAPI service (`main.py`), legacy agent prototype (`app.py`), frontend assets (`static/js`), infrastructure artefacts (`requirements.txt`, `Dockerfile`), and supporting configuration files.

## Executive Summary
* **Overall posture:** _High risk_. Critical authentication, authorization, and transport-layer controls are missing, exposing protected health information (PHI) to unauthenticated clients.
* **Key gaps:** Unrestricted CORS and open endpoints, absence of identity and session enforcement, unsanitized DOM injection on the frontend, hard-coded secrets, and weak operational logging safeguards.
* **Immediate priorities:** Introduce a zero-trust access boundary (JWT + OAuth2 + multi-factor), sanitize user inputs throughout the stack, harden container build and runtime, and implement HIPAA-grade audit logging and breach detection.

## Detailed Findings

### 1. Authentication & Authorization (Critical)
* **Observation:** All REST routes and WebSocket channels are publicly accessible and served without authentication guards (e.g., `/dashboard`, `/nphies`, `/chat`, `/ws/chat`). The router component merely checks for a local storage token but accepts any response from `/auth/validate`, which is not implemented server-side.【F:main.py†L332-L407】【F:static/js/router.js†L60-L127】
* **Risk:** Unauthorized actors can exfiltrate PHI, submit fraudulent claims, or perform enumeration attacks. Violates HIPAA §164.312(d) (person or entity authentication).
* **Recommendations:**
  * Implement OAuth2.1 Authorization Code with PKCE for human users and client credentials for system integrations.
  * Enforce scoped JWT verification and fine-grained role-based access control (RBAC) in FastAPI dependency layers.
  * Require WebSocket authentication via token handshakes and rotate session keys automatically.

### 2. Transport & Session Security (Critical)
* **Observation:** CORS middleware allows `allow_origins=["*"]` with credentials enabled, enabling cross-site request forgery (CSRF) and clickjacking vectors.【F:main.py†L86-L107】 No strict transport security or secure cookies are configured.
* **Recommendations:**
  * Restrict CORS origins to vetted domains, disable credential sharing where not required, and add CSRF tokens for state-changing requests.
  * Mandate HTTPS via HSTS and configure secure, HttpOnly, `SameSite=strict` session cookies.

### 3. Input Validation & Data Handling (High)
* **Observation:** Multiple POST endpoints accept `Dict[str, Any]` without schema validation or size limits (e.g., `/nphies/claim`, `/ai/bedrock-analyze`, `/ai/textract-analyze`).【F:main.py†L609-L679】 Streaming responses echo user-supplied text verbatim without sanitization, enabling stored and reflected XSS when rendered in clients.
* **Frontend:** Router injects HTML fragments directly with `innerHTML`, trusting server responses and remote templates, while notification utilities interpolate unsanitized strings, making XSS trivial.【F:static/js/router.js†L167-L215】【F:static/js/router.js†L320-L371】
* **Recommendations:**
  * Replace `Dict[str, Any]` with Pydantic models enforcing strict types, ranges, and regex validation for IDs (e.g., NPHIES member IDs, ICD-10 codes).
  * Integrate server-side sanitization (e.g., `bleach`) and encode outputs before rendering. On the client, use DOM APIs (`textContent`) or templating libraries that escape by default.
  * Set request body size limits, throttle requests per IP, and implement structured exception handling that returns generic error messages.

### 4. Secrets Management & Configuration (High)
* **Observation:** AWS HealthLake datastore IDs and region configuration are hard-coded in source control.【F:main.py†L115-L135】 Docker image bakes environment details into layers, increasing leak risk.
* **Recommendations:**
  * Load sensitive identifiers from AWS Secrets Manager or Parameter Store via environment variables at runtime.
  * Adopt twelve-factor configuration, ensuring no PHI-related identifiers live in git.

### 5. Logging & Audit Trail (Medium)
* **Observation:** Application logs write to `/app/logs/nphies-ai.log` without encryption or rotation and include verbose route metadata and potentially PHI.【F:main.py†L23-L83】 HIPAA requires tamper-proof audit trails with retention controls.
* **Recommendations:**
  * Route logs to centralized SIEM with TLS (e.g., CloudWatch, Splunk) and sanitize PII/PHI before logging.
  * Implement immutable audit logs with user ID, action, patient ID hash, and outcome; align with §164.312(b).

### 6. Dependency & Supply Chain Risks (Medium)
* **Observation:** Requirements pin FastAPI `0.104.1`, Pydantic `2.5.0`, and Uvicorn `0.24.0` which have recent security advisories; no dependency scanning or signature verification is configured.【F:requirements.txt†L1-L13】
* **Recommendations:**
  * Upgrade to patched versions (FastAPI ≥0.111, Pydantic ≥2.6) after regression testing.
  * Enforce `pip install --require-hashes` or Poetry lockfiles, and integrate Dependabot plus SCA (e.g., Snyk) into CI.

### 7. Container & Infrastructure Hardening (Medium)
* **Observation:** Docker build installs packages as root, leaves build tools (`gcc`) behind, and does not enable multi-stage builds or runtime security controls.【F:Dockerfile†L1-L31】 Health check uses HTTP without authentication, and no file permission tightening or seccomp profiles are defined.
* **Recommendations:**
  * Switch to multi-stage build, prune compiler packages, and run final image with distroless or slim base.
  * Add `USER appuser` earlier, apply `umask`, and mount secrets read-only. Configure AWS IAM with least privilege and enforce network segmentation (private subnets + WAF).

### 8. Compliance & Monitoring Gaps (Medium)
* **Observation:** HIPAA-required breach detection, access monitoring, and encryption at rest/in transit controls are not addressed. No mention of Business Associate Agreements (BAA) or risk assessments.
* **Recommendations:**
  * Implement encryption (AWS KMS) for data at rest and TLS 1.2+ for all endpoints.
  * Deploy continuous compliance monitoring (AWS Config, GuardDuty, Security Hub) and document HIPAA risk analysis.

## Remediation Roadmap
1. **Week 1:** Deploy identity provider integration (Cognito/Azure AD), configure secure CORS, and implement schema validation across APIs. Freeze production deployments until these blockers are resolved.
2. **Week 2:** Harden infrastructure—multi-stage Docker build, AWS Secrets Manager, CloudFront + WAF, and SIEM-forwarded audit logs.
3. **Week 3:** Extend testing to include security automation (SAST, DAST, dependency scans) and conduct HIPAA risk assessment with documented policies.
4. **Week 4+:** Implement continuous monitoring, incident response runbooks, and periodic penetration tests.

## Compliance Alignment Checklist
| Control Area | Current Status | Required Actions |
|--------------|----------------|------------------|
| Access Controls (§164.312(a)) | Missing | Implement RBAC, MFA, and session management |
| Audit Controls (§164.312(b)) | Partial (basic logging) | Centralize, secure, and retain audit trails |
| Integrity (§164.312(c)) | Missing | Add checksums, tamper detection, and hashing |
| Person/Entity Authentication (§164.312(d)) | Missing | Enforce OAuth2/JWT, verify each request |
| Transmission Security (§164.312(e)) | Weak | Enforce TLS, restrict CORS, add CSRF protection |

## Next Steps
* Create security user stories for each high/critical item and track in Jira.
* Schedule a third-party penetration test post-remediation.
* Train engineering teams on secure coding for healthcare (OWASP SAMM, NIST SP 800-66).

