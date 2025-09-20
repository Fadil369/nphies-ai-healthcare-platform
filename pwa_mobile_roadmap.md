# PWA & Mobile Optimization Roadmap

## Current State
* Web app serves static HTML/JS with no service worker, offline cache, or manifest configuration detected in repository.
* Router-driven navigation lacks install prompts, push notification handling, and biometric integrations.
* Mobile-specific TypeScript project (`mobile/`) exists but lacks documentation and build scripts.

## Goals
1. Deliver installable Progressive Web App with offline-first capabilities for claims, eligibility, and emergency workflows.
2. Provide mobile-native experiences (biometric auth, camera scanning, GPS routing) leveraging device APIs securely.
3. Support bilingual content and accessibility on iOS/Android and low-bandwidth networks.

## Roadmap

### Phase 1 – Foundation (Weeks 1-2)
* Create `manifest.json`, configure icons/splash screens, and register service worker handling precache + runtime caching (Workbox).
* Implement App Shell architecture: cache critical routes (`/dashboard`, `/claims`, `/ai-assistant`) and use stale-while-revalidate for API data.
* Build offline queue for claim submissions—store requests in IndexedDB and sync via Background Sync when connectivity returns.

### Phase 2 – Mobile UX (Weeks 3-4)
* Add responsive navigation patterns (tab bar, FAB) and gesture support.
* Integrate biometric authentication (WebAuthn) for login and approvals, with fallback to OTP/MFA.
* Implement camera-based document scanning (WebRTC + barcode/OCR) for uploading insurance cards and prescriptions.
* Provide GPS-based provider lookup and directions for network hospitals.

### Phase 3 – Push & Notifications (Weeks 4-5)
* Configure push notifications via AWS SNS / Firebase Cloud Messaging for claim updates, appointment reminders, and emergency alerts.
* Add in-app notification center synchronised with `/notifications` page; respect user notification preferences stored securely.

### Phase 4 – Native Bridge & Offline Modules (Weeks 6+)
* For React Native/Flutter mobile apps, create shared SDK consuming FastAPI endpoints with offline storage (SQLite) and delta sync.
* Offer offline emergency module containing first-aid instructions, digital insurance cards, and cached eligibility summaries.
* Implement secure local data storage (encrypted storage, biometric unlock) adhering to MOH guidance.

## Deliverables
1. Service worker & manifest integrated into build pipeline with automated Lighthouse CI audits.
2. Mobile component library with reusable offline-aware widgets.
3. Device capability matrix (camera, biometrics, GPS) and risk assessment.
4. Monitoring dashboard tracking install rate, offline usage, push opt-in, and retention.

