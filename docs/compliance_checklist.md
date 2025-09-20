# Compliance Checklist

## HIPAA Administrative Safeguards
- [ ] Security management process (risk analysis, mitigation).
- [ ] Assigned security responsibility (Security Officer).
- [ ] Workforce security (training, access reviews).
- [ ] Information access management (RBAC, least privilege).
- [ ] Security awareness and training (phishing simulations, HIPAA refreshers).
- [ ] Contingency plan (backup, DR, emergency mode operations).

## HIPAA Physical Safeguards
- [ ] Facility access controls (badges, visitor logs).
- [ ] Workstation security (screen locks, asset management).
- [ ] Device and media controls (encryption, secure disposal).

## HIPAA Technical Safeguards
- [ ] Unique user identification & MFA.
- [ ] Emergency access procedures.
- [ ] Automatic logoff and session timeout.
- [ ] Encryption (in transit via TLS 1.2+, at rest via KMS).
- [ ] Audit controls with immutable logs (CloudTrail, QLDB).
- [ ] Integrity controls (hashing, checksums, tamper detection).

## Saudi CHI / NPHIES Requirements
- [ ] FHIR R4 compliance with localisation extensions.
- [ ] Data residency in approved regions (KSA when mandated).
- [ ] Localization (Arabic/English) for patient-facing content.
- [ ] Consent management workflows documented.
- [ ] Alignment with NPHIES certification tests.

## Security Operations
- [ ] Continuous monitoring (GuardDuty, Security Hub, SIEM alerts).
- [ ] Vulnerability management (SAST, DAST, dependency scans).
- [ ] Incident response playbooks tested quarterly.
- [ ] Penetration tests conducted annually.
- [ ] Vendor risk assessments (BAA with partners, third-party reviews).

## Documentation & Governance
- [ ] Policies & procedures approved by compliance committee.
- [ ] Audit trails retained per regulation (≥6 years HIPAA).
- [ ] Data retention & deletion policies enforced.
- [ ] Change management documented (CAB approvals, rollback plans).
- [ ] Privacy notices and patient rights documentation accessible.

