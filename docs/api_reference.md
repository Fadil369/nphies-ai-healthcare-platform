# API Reference

This document summarises the current FastAPI endpoints defined in `main.py` and highlights required security upgrades before production use.

## Public Pages (Serve Static HTML)
| Method | Path | Description | Notes |
|--------|------|-------------|-------|
| GET | `/` | Home page | Serves `static/index.html`.【F:main.py†L304-L312】|
| GET | `/login` | Login screen | Should be replaced with secure OAuth2 flow.【F:main.py†L310-L314】|
| GET | `/dashboard` | Dashboard page | Requires authentication guard.【F:main.py†L315-L319】|
| GET | `/nphies` | NPHIES overview | Requires authentication guard.【F:main.py†L320-L324】|
| ... | ... | Additional static routes for eligibility, claims, pre-authorization, AI assistant, notifications, profile, settings.【F:main.py†L325-L347】|

## Navigation APIs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/navigation/routes` | Returns list of navigation routes and metadata for frontend router.【F:main.py†L348-L377】|
| GET | `/api/navigation/breadcrumbs/{path}` | Generates breadcrumb trail for supplied path.【F:main.py†L378-L403】|
| POST | `/api/navigation/track` | Logs navigation transitions for analytics.【F:main.py†L404-L425】|
| GET | `/api/navigation/preload/{route_path}` | Provides assets to preload for a given route.【F:main.py†L426-L458】|

## Health & System Status
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Basic health check returning uptime, performance metrics, and AWS service status.【F:main.py†L459-L503】|
| GET | `/system/status` | Expanded diagnostics with AWS service details, features, and metrics.【F:main.py†L504-L545】|

## AI & Chat Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/chat` | Streaming chatbot response for healthcare inquiries; currently uses pattern matching logic.【F:main.py†L546-L583】|
| WebSocket | `/ws/chat` | Real-time chat channel lacking auth handshake.【F:main.py†L585-L607】|
| POST | `/ai/bedrock-analyze` | Calls Amazon Bedrock for clinical analysis (stubbed response).【F:main.py†L645-L695】|
| POST | `/ai/sagemaker-predict` | Returns static SageMaker prediction payload.【F:main.py†L697-L722】|
| POST | `/ai/textract-analyze` | Stubbed document analysis results.【F:main.py†L723-L745】|
| POST | `/ai/personalize-recommend` | Static personalised recommendations.【F:main.py†L747-L772】|
| POST | `/ai/kendra-search` | Mock Kendra search results.【F:main.py†L774-L803】|
| GET | `/ai/analytics` | Synthetic AI metrics using random data.【F:main.py†L805-L858】|

## NPHIES & Healthcare Operations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/nphies/claim` | Mocked claim submission returning random confidence score; replace with real integration.【F:main.py†L609-L642】|
| GET | `/health-services/*` | Static page + AWS service metadata, not yet connected to backend services.【F:static/js/aws-services.js†L1-L120】|

## Required Enhancements
1. Introduce authentication/authorization on all non-public endpoints (JWT/OAuth2).
2. Replace mock responses with actual integrations (NPHIES, AWS AI).
3. Implement schema validation (Pydantic models) for all POST endpoints.
4. Add rate limiting, request body size limits, and audit logging for HIPAA compliance.
5. Version APIs and document using OpenAPI/Swagger once security is enforced.

